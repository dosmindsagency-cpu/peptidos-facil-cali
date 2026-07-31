# Deployment

## Branching

- `main` — protected. Production deployments only.
- `development` — preview deployments (and pull requests into it).
- Feature branches → PRs into `development`.

Tag conventions:
- `v0.1.0-foundation` — initial technical foundation (Phase 1).
- `v0.2.0-foundation-security` — Next.js upgrade (15.4.4 → 16.2.12) + RLS / storage hardening (Phase 1.5).
- `v0.3.0-product` — first user-facing product cut (Phase 2).
- `v0.4.0-launch` — analytics + launch readiness (Phase 3).

## Vercel project

1. Project created from this repo on Vercel.
2. Production branch = `main`.
3. Preview branch = `development` and any PR branches.
4. Build command: `npm run build` (default).
5. Output directory: `.next` (default).
6. Install command: `npm install` (default).
7. Node version: 22.x (matches local dev).

## Next.js version + upgrade procedure

- **Next.js 15.4.4** (initial foundation)
- **Next.js 16.2.12** (current — upgraded 2026-07-30)

The 16.x upgrade entails:

- React 19.1 → **19.2** (compatible with `next@16.2.x`).
- `eslint-config-next` upgraded in lockstep with `next`. Flat config
  re-imported (default export is now a `Linter.Config[]` array, not a
  CommonJS shareable config).
- `next lint` removed. `npm run lint` now invokes `eslint .` directly.
- `tsconfig.json` was auto-updated by the codemod:
  - `jsx` was forced from `"preserve"` to `"react-jsx"` (Next.js uses the
    React automatic runtime).
  - `include` gained `.next/dev/types/**/*.ts` for the dev server types.
- `--turbopack` flag dropped from `npm run dev` — Next 16 takes the
  Turbopack path by default; the explicit flag is now implicit.

A future ADR (`v0.3.0-product` and beyond) may need to revisit
`webpack` configuration if edge cases emerge in Phase 2.

## Required Vercel environment variables

See `/docs/environment-variables.md`. Set per environment. The service-role
key lives ONLY on Production and (separately) on Preview when needed for
preview-time integration tests.

## Rollback process

Vercel keeps every deploy. To roll back:

1. Open the Vercel project → Deployments tab.
2. Find the last known-good deployment.
3. Click "Promote to Production".

For database changes, supabase migrations are forward-only. If you must
reverse a change, write a NEW migration that undoes it; never edit
historical migrations.

## Pre-deploy checklist

- [ ] `npm run build` passes locally.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `git log --no-color` includes only intended commits.
- [ ] No `console.log` left in shipping code.
- [ ] `.env.example` reflects any new variables.
- [ ] Migrations applied to the target Supabase environment.
- [ ] CHANGELOG / decisions.md updated.
