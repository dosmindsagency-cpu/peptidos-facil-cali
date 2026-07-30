# Péptidos Fácil Cali — Platform Blueprint

> Modular Spanish-first platform for peptide education, Pep AI, calculators, calendars, and provider discovery in California.

## North star

**Technological / Trustworthy.** Calm, scientific, fast, mobile-first. Spanish by default. Conversion-forward without compromising the educational posture.

## Product modules

| Module              | URL                        | Phase | Source of truth                              |
| ------------------- | -------------------------- | ----- | -------------------------------------------- |
| Pep AI              | `/pep`                     | P2    | `src/features/pep` + adapter to backend      |
| Dose calculator     | `/calculadoras/dosis`      | P2    | `src/features/calculators`                   |
| Reconstitution calc | `/calculadoras/reconstitucion` | P2 | `src/features/calculators`                 |
| Personalized calendar | `/calendario`            | P2    | `src/features/calendar`                      |
| Peptide library     | `/peptidos`                | P2    | `src/features/content` + Supabase content    |
| Blog (SEO)          | `/aprende`                 | P2    | `src/features/content`                       |
| Provider discovery  | `/donde-comprar`, `/recursos` | P2 | `src/features/providers`                     |
| Auth foundation     | (middleware, server actions) | P2  | `src/features/auth` + Supabase Auth          |
| Analytics           | (everywhere)               | P3    | `src/features/analytics` (separate dataset)  |

## Architecture principle

> One platform, modular products.

Pep and the calculators live inside the main app **today**. Each is architected behind a route-and-feature boundary so that, later, they can be exposed at:

- `peptidosfacilcali.com`
- `pep.peptidosfacilcali.com`
- `calculadora.peptidosfacilcali.com`

by either (a) DNS routing the same Vercel deployment, or (b) moving the feature package into its own deployment. Feature code does not import from sibling features except via declared public interfaces under `src/features/<module>/index.ts`.

## Subdomain readiness checklist

- [ ] Each feature exposes only its public surface — no cross-feature DOM/markup imports.
- [ ] Middleware pattern handles host rewriting (separate middleware ready to enable per feature).
- [ ] Analytics events tagged with `module` for namespace isolation.
- [ ] Branding tokens shared (`src/app/globals.css`) so a subdomain can re-skin via CSS vars.

## What is NOT in this phase

- Final homepage design (covered by Phase 1 placeholder)
- Pep AI logic (adapter pending)
- Calculator math (logic pending — no invented dosing)
- Email delivery
- Calendar generation
- Blog automation
- Affiliate tracking
- Complex animations

## Open questions for Phase 2 kickoff

1. Do we have a confirmed product-name domain (`peptidosfacilcali.com`?) — affects canonical hosts and brand surfaces.
2. Will Pep share APIs with the existing Péptidos Fácil or run its own adapter? (Affects whether credentials can be reused or must remain fully isolated.)
3. Provider verification policy — strict manual review, or hybrid?
