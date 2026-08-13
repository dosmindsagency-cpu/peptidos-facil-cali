# Environment Variables

> Source of truth: `.env.example`. TypeScript mirror: `src/env.ts`.

## Required

| Key                              | Required | Server-only | Purpose                                          |
| -------------------------------- | -------- | ----------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`       | ✅       | no          | Supabase project URL (browser-safe)              |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅  | no          | Publishable key for browser requests            |
| `SUPABASE_SECRET_KEY`             | ✅       | **YES**     | Server/admin operations. NEVER commit.          |
| `NEXT_PUBLIC_SITE_URL`           | ✅       | no          | Canonical origin used in metadata / sitemap      |
| `NEXT_PUBLIC_ENVIRONMENT`        | ✅       | no          | `development` \| `preview` \| `production`       |

## Where each is used

| Key                              | Used in                                      |
| -------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | `src/lib/supabase/browser.ts`, `server.ts`, `admin.ts` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `src/lib/supabase/browser.ts`, `server.ts` |
| `SUPABASE_SECRET_KEY`             | `src/lib/supabase/admin.ts` (only)           |
| `NEXT_PUBLIC_SITE_URL`           | `src/env.ts` → `metadataBase`, sitemap, OG   |
| `NEXT_PUBLIC_ENVIRONMENT`        | `SiteFooter` shows the active environment    |

## Phase 2+ additions

| Key                                 | Phase | Notes                                   |
| ----------------------------------- | ----- | --------------------------------------- |
| `OPENROUTER_API_KEY`                | P2    | **Server-only**, required by `/api/pep`  |
| `OPENROUTER_MODEL`                  | P2    | Server-only optional model override      |
| `PEP_AI_API_URL`                    | P2    | Legacy optional adapter                  |
| `PEP_AI_API_KEY`                    | P2    | Legacy optional adapter key              |
| `LEAD_WEBHOOK_TOKEN`                | P2    | Server-only HMAC for outbound CRM        |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`      | P3    | Optional analytics                      |
| `AFFILIATE_SIGNING_SECRET`          | P3    | Server-only, signs referral URLs        |

## How Vercel separates preview vs production

For each environment (`production`, `preview`, `development`):

1. Settings → Environment Variables
2. Add keys scoped individually. Avoid "All environments" if the value
   differs between prod/preview.
3. Production secrets are set only on the production branch.
4. Preview secrets mirror production values for keys that should be identical
   (e.g. NEXT_PUBLIC_SUPABASE_URL) — service-role can be rotated separately
   in preview for safety.

## Safety guard

`src/lib/security/env-guard.ts` provides `assertServerOnly(name)`. Used in
`admin.ts` and `server.ts` to throw if accidentally imported from a
"use client" component. Belt-and-suspenders alongside the `import "server-only"`
directive.
