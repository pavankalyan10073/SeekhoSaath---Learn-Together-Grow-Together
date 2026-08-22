import { defineEventHandler, createError, readBody } from "h3";
import { createBooking, getTutorById } from "@/lib/supabase-data";
import { createServerClient } from "@/lib/supabase-server";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const { tutorId, tutorName, tutorSubject, studentName, studentPhone, studentEmail, mode, amount, tuitionType, date, time, userId } = body;

  if (!tutorId || !studentName || !studentPhone || !studentEmail || !amount) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  const tutor = await getTutorById(tutorId);
  if (!tutor) {
    throw createError({ statusCode: 404, statusMessage: "Tutor not found" });
  }

  const bookingUserId = (userId as string) || "guest";

  const booking = await createBooking({
    userId: bookingUserId,
    tutorId,
    tutorName: tutorName || tutor.name,
    tutorSubject: tutorSubject || tutor.subjectsToTeach[0] || tutor.location,
    studentName,
    studentPhone,
    studentEmail,
    mode: mode || "online",
    tuitionType,
    date,
    time,
    status: "pending",
    paymentStatus: "pending",
    amount: Number(amount),
  });

  return {
    success: true,
    data: {
      bookingId: booking.id,
      amount: booking.amount,
      tutorName: booking.tutorName,
    },
  };
});
