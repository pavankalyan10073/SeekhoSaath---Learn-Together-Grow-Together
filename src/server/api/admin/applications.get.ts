import { defineEventHandler, createError, readBody, getRouterParam } from "h3";
import { getAllTutorApplications, approveTutorApplication, rejectTutorApplication } from "@/lib/firebase-data";
import { syncTutorApplication } from "@/lib/google-sheets";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const applications = await getAllTutorApplications();
  return { success: true, data: applications };
});
