import { defineEventHandler, createError, readBody } from "h3";
import { createBooking } from "@/lib/firebase-data";
import { syncBooking } from "@/lib/google-sheets";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const { planName, amount, customerName, customerEmail, customerPhone } = body;

  if (!planName || !amount || !customerName || !customerEmail || !customerPhone) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = process.env.CASHFREE_ENV || "production";

  if (!appId || !secretKey) {
    throw createError({ statusCode: 500, statusMessage: "Cashfree credentials not configured" });
  }

  const baseUrl = env === "sandbox" ? "https://sandbox.cashfree.com" : "https://api.cashfree.com";
  const auth = Buffer.from(`${appId}:${secretKey}`).toString("base64");

  try {
    const response = await fetch(`${baseUrl}/pg/v2/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2025-01-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.VITE_APP_URL || "https://seekhosaath.com"}/payment/success?order_id={order_id}`,
          notify_url: `${process.env.VITE_APP_URL || "https://seekhosaath.com"}/api/payments/cashfree-webhook`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cashfree order creation failed:", errorText);
      throw new Error(`Cashfree order creation failed: ${response.status}`);
    }

    const orderResponse = await response.json();

    const booking = await createBooking({
      userId: "guest",
      tutorId: "subscription",
      tutorName: planName,
      tutorSubject: "Subscription",
      studentName: customerName,
      studentPhone: customerPhone,
      studentEmail: customerEmail,
      mode: "online",
      status: "pending",
      paymentStatus: "pending",
      amount: Number(amount),
      orderId,
    });

    await syncBooking({
      id: booking.id,
      tutorName: planName,
      studentName: customerName,
      studentPhone: customerPhone,
      studentEmail: customerEmail,
      mode: "online",
      amount: Number(amount),
      status: "pending",
      paymentStatus: "pending",
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      data: {
        orderId: orderResponse.order_id,
        paymentSessionId: orderResponse.payment_session_id,
        bookingId: booking.id,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create payment order";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
