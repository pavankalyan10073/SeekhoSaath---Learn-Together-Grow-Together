import { defineEventHandler, createError, readBody, getRouterParam } from "h3";
import { getAllTutorApplications } from "@/lib/supabase-data";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const applications = await getAllTutorApplications();
  return { success: true, data: applications };
});
