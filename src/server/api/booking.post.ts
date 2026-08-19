import { defineEventHandler, createError, readBody } from "h3";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const { fullName, phone, email, mode, tutorName, tutorSubject } = body;

  if (!fullName || !phone || !email || !mode) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  const payload = {
    fullName,
    phone,
    email,
    mode,
    tutorName,
    tutorSubject,
    type: "book_session",
    timestamp: new Date().toISOString(),
  };

  const webhook = process.env.VITE_GOOGLE_SHEET_WEBHOOK || process.env.GOOGLE_SHEET_WEBHOOK;
  if (webhook) {
    try {
      await $fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to submit to Google Sheet:", error);
    }
  }

  return {
    success: true,
    message: "Session request received",
  };
});
