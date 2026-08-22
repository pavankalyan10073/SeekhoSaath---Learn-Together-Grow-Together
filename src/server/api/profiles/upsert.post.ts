import { defineEventHandler, createError, readBody } from "h3";
import { createServerClient } from "@/lib/supabase-server";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const { userId, email, fullName, mobile, role, profilePic, bio, experience, degree, college, yearOfPassing, specializations, subjectsToTeach, chargePerSession, teachingMode, state, district, city, pinCode, fullAddress, languages, aadharFront, aadharBack } = body;

  if (!userId || !email) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      mobile,
      role: role || "student",
      profile_pic: profilePic,
      bio,
      experience,
      degree,
      college,
      year_of_passing: yearOfPassing,
      specializations: specializations || [],
      subjects_to_teach: subjectsToTeach || [],
      charge_per_session: chargePerSession,
      teaching_mode: teachingMode,
      state,
      district,
      city,
      pin_code: pinCode,
      full_address: fullAddress,
      languages: languages || [],
      aadhar_front: aadharFront,
      aadhar_back: aadharBack,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return { success: true, data };
});
