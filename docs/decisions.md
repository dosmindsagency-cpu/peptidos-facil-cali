# Architecture Decision Log

> ADR template: Context → Decision → Consequences → Status.

---

## ADR-001 · Foundation as one platform, modular products

**Date.** 2026-07-29
**Status.** Accepted.

**Context.** Pep AI, dose calculator, reconstitution calculator, calendars,
provider discovery, blog, and the marketing surface should all evolve as one
coherent product, but each module should later be exposed independently
(potentially on its own subdomain).

**Decision.** Single Next.js App Router deployment. Each module lives under
`src/features/<module>` with strict boundaries — only public re-exports.
Routes are kept flat to keep URLs stable when subdomain feature flags are
added in Phase 2+.

**Consequences.**

- ✅ One Supabase project, one Auth, one set of analytics namespaces.
- ✅ One Vercel deployment to operate.
- ⚠ Must enforce the no-cross-feature-import rule in code review.
- ⚠ Subdomain routing at the Vercel/middleware layer is added in Phase 2+;
  this commit lays no DNS groundwork.

---

## ADR-002 · Supabase as the only external service

**Date.** 2026-07-29
**Status.** Accepted.

**Context.** Phase 1 is intentionally narrow: GitHub + Vercel + Supabase only.

**Decision.** Use Supabase Auth (HS256/JWT), Postgres + RLS, and Storage.
Service-role keys never reach the browser. Anon key is for client reads.

**Consequences.**

- ✅ No vendor sprawl in Phase 1.
- ⚠ Email providers (Resend, etc.) not introduced yet — deferred to Phase 2.
- ⚠ Analytics not introduced yet — deferred to Phase 3.

---

## ADR-003 · No thin-content regional pages

**Date.** 2026-07-29
**Status.** Accepted.

**Context.** California resources could be exploited for mass-generated
doorway pages.

**Decision.** Each `/recursos/[region]` route is only published with unique
content or verified providers. No auto-generated city pages.

**Consequences.**

- ✅ Maintains editorial integrity & SEO quality.
- ⚠ Slower expansion across regions. Mitigated by reusable content
  fragments validated per region.

---

## ADR-004 · RLS is mandatory on every public table

**Date.** 2026-07-29
**Status.** Accepted.

**Context.** Lead/contact data and provider relationships require strict
boundaries. Mistakes here are public.

**Decision.** All tables created in Phase 1 ship with `enable row level
security`. The migration never leaves a table in an unprotected state.
`leads` are immutable post-accept; `providers` only show verified+active to
public; `content_items` only show `status='published'` to public.

**Consequences.**

- ✅ Migrations are reviewed with RLS-by-default as a checklist item.
- ⚠ Admin tooling needs authenticated role; we will create an "admin" user
  group in Phase 2.

---

## ADR-005 · Dosing & clinical content excluded from Phase 1

**Date.** 2026-07-29
**Status.** Accepted.

**Context.** No dosing or protocol tables are introduced in Phase 1.

**Decision.** No `peptide_dosing`, no `protocol_*` tables, no calculator
logic. The calculator pages render shells that explicitly say "lógica
revisada — Fase 2".

**Consequences.**

- ✅ No risk of shipping a half-implemented clinical calculator.
- ⚠ Routes don't satisfy "real product" criteria yet — explicitly approved by
  spec stop-condition.

---

## Pending decisions (raise before Phase 2 kickoff)

1. Domain: `peptidosfacilcali.com` confirmation.
2. Pep backend: shared with existing Péptidos Fácil, or isolated adapter?
3. Provider verification policy: human-only, hybrid, or self-serve?
