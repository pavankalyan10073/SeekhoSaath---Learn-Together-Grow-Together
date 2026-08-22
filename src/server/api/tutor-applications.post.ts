import { defineEventHandler, createError, readBody } from "h3";
import { saveTutorApplication } from "@/lib/supabase-server-data";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);

  if (!body.email || !body.fullName || !body.mobile) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  try {
    const result = await saveTutorApplication({
      id: body.id || `tutor-app-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId: body.userId,
      fullName: body.fullName,
      email: body.email,
      mobile: body.mobile,
      profilePic: body.profilePic || "",
      bio: body.bio || "",
      experience: body.experience || "",
      degree: body.degree || "",
      college: body.college || "",
      yearOfPassing: body.yearOfPassing || "",
      specializations: body.specializations || [],
      subjectsToTeach: body.subjectsToTeach || [],
      chargePerSession: body.chargePerSession || "",
      teachingMode: body.teachingMode || "online",
      state: body.state || "",
      district: body.district || "",
      city: body.city || "",
      pinCode: body.pinCode || "",
      fullAddress: body.fullAddress || "",
      languages: body.languages || [],
      aadharFront: body.aadharFront || "",
      aadharBack: body.aadharBack || "",
      aadharNumber: body.aadharNumber,
      applicationDate: body.applicationDate || new Date().toISOString(),
      verified: false,
      status: "pending",
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit application";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
