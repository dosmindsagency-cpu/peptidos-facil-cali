# Architecture

## Layering

```
                ┌───────────────────────────────┐
                │  App Router routes  (app/)    │
                │  Presentational, route-level  │
                └───────────────┬───────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │    features/<module>          │
                │    Domain logic + data layer  │
                └───────────────┬───────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │  lib (supabase, validation,  │
                │  security, seo, utils)        │
                └───────────────┬───────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │  Supabase (Postgres, Auth,    │
                │  Storage) at run-time         │
                └───────────────────────────────┘
```

- `app/` knows nothing about data sources directly — only features.
- `features/` owns business rules, calls `lib/`, never the reverse.
- `lib/` is reusable plumbing (Supabase clients, Zod schemas, env guard, SEO JSON-LD, utility functions).
- `components/` is presentation only, no domain logic.

## Supabase clients — three flavors

| Client                    | Where                     | RLS | Cookie | Use                            |
| ------------------------- | ------------------------- | --- | ------ | ------------------------------ |
| `createBrowserSupabaseClient()` | `"use client"` components | ✅ | ✅     | UI reads/writes within user session |
| `createServerSupabaseClient()`  | Server Components, Route Handlers, Server Actions | ✅ | ✅ | Server reads/writes with user session |
| `createAdminSupabaseClient()`   | Server-only trusted jobs | ❌ | ❌ | Background imports, admin tools |

The admin client throws on missing env at runtime and is the **only** client that bypasses RLS. It cannot be imported from a client component.

## Routing

We use a single Next.js App Router deployment with route groups reserved for future use:

```
app/
  (marketing)/   → public, SEO-focused
  (platform)/    → authenticated experience (Phase 2)
  api/           → route handlers (Phase 2)
```

Routes are defined flatly under their public paths (`/pep`, `/calculadoras`, etc.). Future: convert to groups without breaking URLs.

## Security headers

`next.config.ts` sets:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

In Phase 2 we add: `Content-Security-Policy` (after analytics & any third-party origins are finalized).

## Subdomain strategy (Phase 2+)

Today every feature lives under `peptidosfacilcali.com`. To expose e.g. `pep.peptidosfacilcali.com`:

1. Add a `middleware.ts` with `host`-based rewriting:
   ```ts
   if (req.headers.get("host")?.startsWith("pep.")) {
     url.pathname = `/pep${url.pathname}`;
   }
   ```
2. (Alternative) Deploy feature as a tiny standalone Next.js app importing only `src/features/pep`.
3. Share Supabase project; analytics stays namespaced via `module` field.

This is intentionally orthogonal to feature design so no code change is forced.
