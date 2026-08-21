import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSafeClient(): SupabaseClient {
  if (url && key) {
    return createClient(url, key);
  }
  return createClient("http://localhost", "0000000000000000000000000000000000000000");
}

export const supabase = createSafeClient();
