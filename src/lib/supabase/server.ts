import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { publicEnv } from "@/env";
import type { Database } from "@/types/supabase";
import { assertServerOnly } from "@/lib/security/env-guard";

type CookieWrite = {
  name: string;
  value: string;
  options?: { maxAge?: number; secure?: boolean };
};

/**
 * Server Supabase client. Uses the user's session cookie so RLS policies
 * apply. NEVER returns or stores the service role key.
 */
export async function createServerSupabaseClient() {
  assertServerOnly("supabase/server");
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Placeholder server client when env not configured. Reads return empty.
    return createServerClient<Database>(
      "https://placeholder.supabase.invalid",
      "placeholder-anon-key",
      { cookies: { getAll: () => [], setAll: () => undefined } },
    );
  }
  const cookieStore = await cookies();
  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet: CookieWrite[]) => {
          try {
            for (const { name, value, options } of toSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot set cookies — ignored in middleware
            // and route handlers are responsible for setting them on the
            // server response.
          }
        },
      },
    },
  );
}
