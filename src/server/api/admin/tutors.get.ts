import { defineEventHandler, createError } from "h3";
import { createServerClient } from "@/lib/supabase-server";

export default defineEventHandler(async (event) => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch tutors" });
  }

  return { success: true, data: data || [] };
});
