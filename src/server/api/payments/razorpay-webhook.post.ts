import { defineEventHandler, createError, readBody } from "h3";
import { updateBookingStatus, getBookingById, createPayment, updatePaymentStatus } from "@/lib/supabase-data";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    throw createError({ statusCode: 400, statusMessage: "Missing required payment verification fields" });
  }

  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw createError({ statusCode: 404, statusMessage: "Booking not found" });
  }

  try {
    const payment = await createPayment({
      bookingId,
      userId: booking.userId,
      tutorId: booking.tutorId,
      amount: booking.amount,
      currency: "INR",
      status: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature,
      method: body.method || "unknown",
    });

    await updateBookingStatus(bookingId, "confirmed", "paid");
    await updatePaymentStatus(payment.id, "paid", razorpay_payment_id, razorpay_signature, body.method);

    return { success: true, message: "Payment verified successfully", data: { paymentId: payment.id } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
