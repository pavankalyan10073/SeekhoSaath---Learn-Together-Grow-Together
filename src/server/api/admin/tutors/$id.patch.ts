import { defineEventHandler, createError, readBody, getRouterParam } from "h3";
import { approveTutorApplication, rejectTutorApplication } from "@/lib/supabase-server-data";

export default defineEventHandler(async (event) => {
  if (event.method !== "PATCH") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Application ID is required" });
  }

  const body = await readBody(event);
  const { action, reason } = body as { action: "approve" | "reject"; reason?: string };

  if (!action || !["approve", "reject"].includes(action)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid action. Use 'approve' or 'reject'" });
  }

  try {
    if (action === "approve") {
      const result = await approveTutorApplication(id);
      return { success: true, message: "Tutor approved successfully", data: result };
    } else {
      if (!reason) {
        throw createError({ statusCode: 400, statusMessage: "Rejection reason is required" });
      }
      await rejectTutorApplication(id, reason);
      return { success: true, message: "Tutor application rejected" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Operation failed";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
