/**
 * Public environment variables — safe to expose to the browser.
 * Server-only secrets are read separately in src/lib/supabase/server.ts
 * and must NEVER be imported from a "use client" component.
 */
function requireClientEnv(name: keyof PublicEnv): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    // In CI/build, allow missing values; runtime checks happen at first use.
    return "";
  }
  return v;
}

export type PublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_ENVIRONMENT: "development" | "preview" | "production";
};

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: requireClientEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requireClientEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptidosfacilcali.com",
  NEXT_PUBLIC_ENVIRONMENT:
    (process.env.NEXT_PUBLIC_ENVIRONMENT as PublicEnv["NEXT_PUBLIC_ENVIRONMENT"]) ??
    "development",
};

export function getSiteUrl() {
  return publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}
