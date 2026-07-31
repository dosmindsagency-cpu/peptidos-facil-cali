# Architecture

> Framework: **Next.js 16.2.12** (App Router) + React 19.2 + TypeScript 5.7 strict.
> Upgraded from 15.4.4 on 2026-07-30. ESLint via flat config
> (`eslint-config-next@16.2.12`).

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

## Trust boundaries — authenticated is not administrator

The `authenticated` role in Supabase is **not** an administrator.

A server-side flow that wants to do any of the following must use the
service-role key (`SUPABASE_SERVICE_ROLE_KEY`):

- Editing / publishing / drafting `content_items`
- Creating / updating / verifying / deactivating `providers`
- Reading or updating any row of `leads`
- Editing or deleting any row of `profiles`

All such operations go through trusted server-only code paths under
`src/lib/supabase/admin.ts`. Authenticated users can:

- Read `profiles` only when `auth.uid() = id`.
- Read `content_items` only when `status = 'published'`.
- Read `providers` only when `active = true AND verification_status = 'verified'`.
- Mutate nothing outside `user-private` storage (their own objects).

A future ADR (proposed **ADR-007**) will introduce a custom admin role for
client-side editorial work. Until that ships, **only server-side
service-role code** mutates anything beyond `user-private` storage.

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
