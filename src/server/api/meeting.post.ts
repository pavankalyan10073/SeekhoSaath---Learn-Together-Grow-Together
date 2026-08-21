import { defineEventHandler, createError, readBody } from "h3";
import { createMeeting } from "@/lib/supabase-data";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const { fullName, phone, email, tuitionType, date, time, tutorName, tutorSubject } = body;

  if (!fullName || !phone || !email || !tuitionType || !date || !time) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  try {
    await createMeeting({
      fullName,
      phone,
      email,
      tuitionType,
      date,
      time,
      tutorName,
      tutorSubject,
    });
  } catch (error) {
    console.error("Failed to save meeting:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to save meeting" });
  }

  return {
    success: true,
    message: "Meeting request received",
  };
});
