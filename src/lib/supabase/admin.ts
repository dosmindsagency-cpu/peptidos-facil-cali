import "server-only";
import { createClient } from "@supabase/supabase-js";
import { assertServerOnly } from "@/lib/security/env-guard";
import type { Database } from "@/types/supabase";

/**
 * Service-role Supabase client — bypasses RLS. Use ONLY for trusted server
 * jobs (e.g. background imports, admin endpoints). Never import from a
 * "use client" component. Never expose this client through an API route
 * that anonymous users can hit.
 */
let cachedAdminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminSupabaseClient() {
  assertServerOnly("supabase/admin");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Hard error: service-role must never silently misconfigure.
    throw new Error(
      "[supabase/admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Configure both in the environment before using the admin client.",
    );
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient<Database>(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cachedAdminClient;
}
