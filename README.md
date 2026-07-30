# Péptidos Fácil Cali

> Modular Spanish-first platform for peptide education, Pep AI, calculators, calendars, and provider discovery in California.

This repository hosts the **technical foundation**. Phase 1 only. Product modules land in subsequent phases under `src/features/<module>`.

## Stack

- **Next.js 15.4** · App Router · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** (PostCSS)
- **Supabase** · Postgres + Row Level Security + Auth + Storage
- **Vercel** for deployment
- **Zod** for input validation
- **Instrument Serif** (display) + **Inter** (UI/body) — only two font families

## Getting started

```bash
npm install
cp .env.example .env.local        # fill in NEXT_PUBLIC_SUPABASE_URL, _ANON_KEY, _SERVICE_ROLE_KEY, _SITE_URL
npm run dev                       # http://localhost:3000
npm run typecheck
npm run build                     # production build
```

## Scripts

- `npm run dev` — Next.js dev with Turbopack
- `npm run build` — production build (used by Vercel)
- `npm run start` — serve the production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js ESLint config
- `npm run format` — Prettier

## Folder layout

```
src/
  app/            App Router routes + global error/not-found/loading
  components/     Pure presentation — ui / layout / marketing / pep / calculators / content / providers
  features/       Domain logic (Phase 2+)
    auth/  pep/  calculators/  calendar/  content/  providers/  analytics/
  lib/            Reusable plumbing
    supabase/   browser, server, admin clients
    validation/ zod schemas
    security/   server-only guards
    seo/        JSON-LD helpers
    utils/      cn() helper
  types/          TypeScript mirror of the database schema
  config/         Site config + nav (no PII)
public/           Static assets (favicon, robots.txt)
supabase/         SQL migrations (run via Supabase Dashboard SQL Editor)
docs/             platform-blueprint, architecture, database, env-vars, deployment, decisions
```

## Branching

- `main` (protected) — production
- `development` — preview / non-prod
- feature branches → PRs into `development`

## Independent platform — confirmation

This repository is **not** connected to the existing Péptidos Fácil codebase.
It has its own Supabase project, its own Vercel deployment, and its own
analytics namespace. Existing péptidos-facil code remains untouched.

## Rollback

Vercel keeps every deployment. Promote a previous known-good deployment to
production with one click. Database changes are forward-only: reverse via
new migrations.

---

## Phase 1 deliverables (current state)

1. ✅ Independent GitHub repository
2. ⏳ Vercel preview (deployment pending — credentials needed)
3. ⏳ Supabase connection (project pending — credentials needed)
4. ✅ 14 functional route shells
5. ✅ Modular folder structure (app / components / features / lib / types / config / docs / public)
6. ✅ Database migration SQL + RLS policies
7. ✅ Storage bucket definitions
8. ✅ Three Supabase clients with explicit server-only separation
9. ✅ Env var checklist + .env.example
10. ⏳ Build & test results (awaiting secret provisioning)
11. ✅ List of pending integrations
12. ⏳ Initial commit & checkpoint tag (pending secrets)
13. ✅ No credentials committed
