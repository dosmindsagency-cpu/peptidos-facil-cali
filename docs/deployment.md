# Deployment

## Branching

- `main` — protected. Production deployments only.
- `development` — preview deployments (and pull requests into it).
- Feature branches → PRs into `development`.

Tag conventions:
- `v0.1.0-foundation` — initial technical foundation (Phase 1).
- `v0.2.0-product` — first user-facing product cut (Phase 2).
- `v0.3.0-launch` — analytics + launch readiness (Phase 3).

## Vercel project

1. Project created from this repo on Vercel.
2. Production branch = `main`.
3. Preview branch = `development` and any PR branches.
4. Build command: `npm run build` (default).
5. Output directory: `.next` (default).
6. Install command: `npm install` (default).
7. Node version: 22.x (matches local dev).

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
