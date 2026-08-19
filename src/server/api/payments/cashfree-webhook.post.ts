import { defineEventHandler, createError, readBody, getHeader } from "h3";
import { getBookingByOrderId, updateBookingStatus, createPayment, updatePaymentStatus } from "@/lib/firebase-data";
import { syncPayment } from "@/lib/google-sheets";
import crypto from "node:crypto";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const rawBody = JSON.stringify(body);

  const signature = getHeader(event, "x-webhook-signature") || "";
  const timestamp = getHeader(event, "x-webhook-timestamp") || "";
  const secretKey = process.env.CASHFREE_SECRET_KEY || "";

  if (!signature || !timestamp || !secretKey) {
    throw createError({ statusCode: 400, statusMessage: "Missing webhook verification headers" });
  }

  const dataToVerify = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto.createHmac("sha256", secretKey).update(dataToVerify).digest("hex");

  if (signature !== expectedSignature) {
    throw createError({ statusCode: 400, statusMessage: "Invalid webhook signature" });
  }

  try {
    const orderId = body.order?.order_id || body.order_id;
    const paymentStatus = body.payment?.payment_status || body.payment_status;
    const paymentId = body.payment?.payment_id || body.payment_id;
    const amount = body.order?.order_amount || body.order_amount;

    if (!orderId) {
      throw createError({ statusCode: 400, statusMessage: "Missing order ID" });
    }

    const booking = await getBookingByOrderId(orderId);
    if (!booking) {
      throw createError({ statusCode: 404, statusMessage: "Booking not found" });
    }

    const isPaid = paymentStatus === "PAID" || paymentStatus === "SUCCESS";

    if (isPaid) {
      const payment = await createPayment({
        bookingId: booking.id,
        userId: booking.userId,
        tutorId: booking.tutorId,
        amount: Number(amount),
        currency: "INR",
        status: "paid",
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId || "",
        razorpaySignature: "",
        method: body.payment?.payment_method || body.payment_method || "cashfree",
      });

      await updateBookingStatus(booking.id, "confirmed", "paid");
      await updatePaymentStatus(payment.id, "paid", paymentId || "", "", body.payment?.payment_method || "cashfree");

      await syncPayment({
        id: payment.id,
        bookingId: booking.id,
        tutorName: booking.tutorName,
        studentName: booking.studentName,
        amount: Number(amount),
        status: "paid",
        method: body.payment?.payment_method || "cashfree",
        timestamp: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
