import { defineEventHandler, createError } from "h3";
import { createServerClient } from "@/lib/supabase-server";

export default defineEventHandler(async (event) => {
  const supabase = createServerClient();
  const url = new URL(event.request.url);
  const action = url.searchParams.get("action") || "applications";

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
});
