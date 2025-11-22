// Public Supabase client using hard-coded public credentials to avoid env issues
// This uses the anon/publishable key which is safe to expose in the frontend.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://kaaqxiivmkuhvybnwmrb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYXF4aWl2bWt1aHZ5Ym53bXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTA3NjYsImV4cCI6MjA3OTM2Njc2Nn0.YootvXfeEAf7iok6S6a3e_l7Fkipsuv_SRwQXPTtJ7o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
