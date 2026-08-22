import { defineEventHandler, createError, readBody } from "h3";
import { createServerClient } from "@/lib/supabase-server";

export default defineEventHandler(async (event) => {
  const supabase = createServerClient();
  const url = new URL(event.request.url);
  const action = url.searchParams.get("action") || "applications";

  if (event.method === "GET") {
    if (action === "tutors") {
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw createError({ statusCode: 500, statusMessage: "Failed to fetch tutors" });
      return { success: true, data: data || [] };
    }

    if (action === "bookings") {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw createError({ statusCode: 500, statusMessage: "Failed to fetch bookings" });
      return { success: true, data: data || [] };
    }

    const { data, error } = await supabase
      .from("tutor_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw createError({ statusCode: 500, statusMessage: "Failed to fetch applications" });
    return { success: true, data: data || [] };
  }

  if (event.method === "PATCH") {
    const body = await readBody(event);
    const id = url.searchParams.get("id");
    if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });

    if (body.action === "approve") {
      const appResult = await supabase.from("tutor_applications").select("*").eq("id", id).single();
      if (appResult.error) throw createError({ statusCode: 404, statusMessage: "Application not found" });
      const app = appResult.data as Record<string, unknown>;

      const tutorId = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const insertResult = await supabase.from("tutors").insert({
        id: tutorId,
        user_id: app.user_id as string | null,
        name: app.full_name as string,
        email: app.email as string,
        mobile: app.mobile as string,
        profile_pic: app.profile_pic as string,
        bio: app.bio as string,
        experience: app.experience as string,
        degree: app.degree as string,
        college: app.college as string,
        year_of_passing: app.year_of_passing as string,
        specializations: (app.specializations as string[]) || [],
        subjects_to_teach: (app.subjects_to_teach as string[]) || [],
        charge_per_session: app.charge_per_session as string,
        teaching_mode: app.teaching_mode as string,
        location: `${app.city}, ${app.district}, ${app.state}`,
        languages: (app.languages as string[]) || [],
        state: app.state as string,
        district: app.district as string,
        city: app.city as string,
        pin_code: app.pin_code as string,
        full_address: app.full_address as string,
        aadhar_front: app.aadhar_front as string,
        aadhar_back: app.aadhar_back as string,
        application_date: app.application_date as string,
        verified: true,
        rating: 0,
        sessions: 0,
        response_time: "< 1 hour",
        status: "approved",
      });
      if (insertResult.error) throw insertResult.error;

      await supabase.from("tutor_applications").update({ status: "approved", verified: true }).eq("id", id);
      return { success: true, data: { tutorId } };
    }

    if (body.action === "reject") {
      const reason = body.reason as string | undefined;
      if (!reason) throw createError({ statusCode: 400, statusMessage: "Rejection reason is required" });
      const { error } = await supabase.from("tutor_applications").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
      if (error) throw error;
      return { success: true };
    }

    throw createError({ statusCode: 400, statusMessage: "Invalid action" });
  }

  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
