import "use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/env";
import type { Database } from "@/types/supabase";

type CookieWrite = {
  name: string;
  value: string;
  options?: { maxAge?: number; secure?: boolean };
};

/**
 * Browser Supabase client. Safe in client components only — never returns
 * a privileged session. All writes pass through RLS.
 */
export function createBrowserSupabaseClient() {
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Placeholder until real credentials are configured.
    // All real network requests will be rejected by Supabase, surfacing a clear error.
    return createBrowserClient<Database>(
      "https://placeholder.supabase.invalid",
      "placeholder-anon-key",
      {
        cookies: {
          getAll: () => [],
          setAll: () => undefined,
        },
      },
    );
  }
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => {
          if (typeof document === "undefined") return [];
          return document.cookie
            .split("; ")
            .filter(Boolean)
            .map((kv) => {
              const i = kv.indexOf("=");
              return { name: kv.slice(0, i), value: decodeURIComponent(kv.slice(i + 1)) };
            });
        },
        setAll: (toSet: CookieWrite[]) => {
          if (typeof document === "undefined") return;
          for (const { name, value, options } of toSet) {
            document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${
              options?.maxAge ? `; Max-Age=${options.maxAge}` : ""
            }${options?.secure ? "; Secure" : ""}`;
          }
        },
      },
    },
  );
}
