import { defineEventHandler, createError } from "h3";
import { createServerClient } from "@/lib/supabase-server";

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("tutors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw createError({ statusCode: 500, statusMessage: "Failed to fetch tutors" });
    }

    return { success: true, data: data || [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("Supabase server credentials")) {
      throw createError({ statusCode: 500, statusMessage: "Supabase not configured on server" });
    }
    throw createError({ statusCode: 500, statusMessage: message || "Failed to load tutors" });
  }
});
