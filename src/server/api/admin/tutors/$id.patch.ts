import { defineEventHandler, createError, readBody, getRouterParam } from "h3";
import { approveTutorApplication, rejectTutorApplication } from "@/lib/firebase-data";
import { syncTutorApplication } from "@/lib/google-sheets";

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
      const tutor = await approveTutorApplication(id, "admin");
      await syncTutorApplication({
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
        mobile: tutor.mobile,
        subjects: tutor.subjectsToTeach.join(", "),
        specializations: tutor.specializations.join(", "),
        location: tutor.location,
        chargePerSession: tutor.chargePerSession,
        status: "approved",
        timestamp: new Date().toISOString(),
      });
      return { success: true, message: "Tutor approved successfully", data: tutor };
    } else {
      if (!reason) {
        throw createError({ statusCode: 400, statusMessage: "Rejection reason is required" });
      }
      await rejectTutorApplication(id, reason);
      await syncTutorApplication({
        id,
        status: "rejected",
        reason,
        timestamp: new Date().toISOString(),
      });
      return { success: true, message: "Tutor application rejected" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Operation failed";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
