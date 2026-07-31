# Database — Foundation Schema

> Source SQL lives in `supabase/migrations/`. TypeScript mirror: `src/types/supabase.ts`.

> **Security model (ADR-006):** "authenticated" is **not** an administrator.
> All editorial / administrative operations on `content_items`, `providers`,
> `profiles`, and `leads` happen via server-side code using the
> `SUPABASE_SERVICE_ROLE_KEY`. See "RLS and policies" below.

## Tables (Phase 1)

### `profiles`

| column               | type                     | notes                              |
| -------------------- | ------------------------ | ---------------------------------- |
| id                   | uuid PK                  | FK → `auth.users.id`               |
| email                | text NOT NULL            | lowercase, validated client+server |
| preferred_language   | text NOT NULL default 'es' | check: 'es' \| 'en'              |
| california_region    | text                     | optional                           |
| created_at           | timestamptz default now()|                                    |
| updated_at           | timestamptz default now()| trigger                            |

**RLS**

- `select` / `insert` / `update` only when `auth.uid() = id`.
- `delete` policy intentionally **not** granted — only service-role can delete.

### `leads`

| column               | type                     | notes                              |
| -------------------- | ------------------------ | ---------------------------------- |
| id                   | uuid PK default gen_random_uuid() |                            |
| name                 | text                     |                                    |
| email                | text NOT NULL            |                                    |
| optional_phone       | text                     |                                    |
| region               | text                     |                                    |
| goal                 | text                     |                                    |
| preferred_language   | text NOT NULL default 'es' | 'es' \| 'en'                    |
| source               | text                     | UTM source attribution             |
| utm_source           | text                     |                                    |
| utm_medium           | text                     |                                    |
| utm_campaign         | text                     |                                    |
| consent_at           | timestamptz              | required to accept insert          |
| created_at           | timestamptz              |                                    |

**RLS**

- **`anon`** is granted **INSERT only** with check `consent_at IS NOT NULL`.
- **`authenticated`** is granted **nothing** — no SELECT, no INSERT, no UPDATE, no DELETE on `leads`.
- All reading and administration goes through **service-role** server code (e.g. the future admin dashboard).
- The RLS `enable row level security` is set; the absence of additional policies is the **deny by default** for those roles.

### `content_items`

| column          | type                                       | notes |
| --------------- | ------------------------------------------ | ----- |
| id              | uuid PK                                    |       |
| slug            | text UNIQUE                                |       |
| title           | text NOT NULL                              |       |
| summary         | text                                       |       |
| content_type    | text NOT NULL (enum constraint)            | peptide / article / guide / faq / glp1 / recovery / safety / longevity / weight / california_resource / provider_selection |
| status          | text NOT NULL default 'draft'              | draft / in_review / published / archived |
| language        | text NOT NULL default 'es'                 |       |
| published_at    | timestamptz                                |       |
| updated_at      | timestamptz trigger                        |       |

**RLS**

- **`anon` + `authenticated`** are granted **SELECT only when `status = 'published'`**.
- **`anon` + `authenticated`** are granted **nothing else** — no INSERT, no UPDATE, no DELETE.
- All editorial operations (creating drafts, updating in-review content, publishing, archiving) flow through **service-role** server code only.
- A future admin role system (e.g. JWT custom claims on `auth.users`) will be required before any authenticated user can edit content client-side. Until that ships, only the service-role key can write.

### `providers`

| column                | type                                       | notes |
| --------------------- | ------------------------------------------ | ----- |
| id                    | uuid PK                                    |       |
| name                  | text NOT NULL                              |       |
| region                | text                                       |       |
| website               | text                                       |       |
| referral_url          | text                                       | signed server-side         |
| discount_code         | text                                       |                            |
| verification_status   | text NOT NULL default 'unverified'         | unverified / pending / verified / rejected |
| last_reviewed_at      | timestamptz                                |                            |
| active                | boolean NOT NULL default false             |                            |
| created_at / updated_at | timestamptz                              |                            |

**RLS**

- **`anon` + `authenticated`** are granted **SELECT only when `active = true AND verification_status = 'verified'`**.
- **`anon` + `authenticated`** are granted **nothing else**.
- All provider lifecycle (create, update, deactivate, referral URL change, discount-code edit, deletion) is **service-role** server code.
- **No** "generic authenticated CRUD" is granted.

## Storage buckets

| Bucket            | Public | Writes                | Authenticated writes        | Use                                          |
| ----------------- | ------ | --------------------- | --------------------------- | -------------------------------------------- |
| bioverso-public   | ✅     | **service-role only** | **none**                    | Approved anatomical / molecular assets       |
| content-public    | ✅     | **service-role only** | **none**                    | Article cover images and content assets      |
| user-private      | ❌     | owner only (auth uid) | owner only (auth uid)       | Saved calendars, user uploads                |

- **Public buckets**: read access via `bucket public=true`. Write access is achieved only via service-role server code. We intentionally write **zero** storage INSERT / UPDATE / DELETE policies for `bioverso-public` and `content-public` — that absence is the deny. Generic `authenticated` users cannot mutate public assets.
- **`user-private`**: four policies (select / insert / update / delete) each requiring `auth.uid() = owner`. Anonymous role has no path to this bucket.

Path conventions inside `bioverso-public`:
- `anatomy/` · `organs/` · `cellular/` · `molecules/` · `peptides/` · `mechanisms/` · `backgrounds/` · `icons/` · `motion/`
- File names: `pf-[category]-[subject]-[variant]-[aspect]-[version].png`

## What is NOT in this phase

- `peptide_dosing`, `protocol_*`, or any clinical/health tables.
- Conversation persistence for Pep (Phase 2 — only after rate-limiting is final).
- Email subscription tables (depends on provider, Phase 2+).
- Analytics tables (Phase 3 — separate dataset, PII-free).
- **A custom admin-role system.** Until that ships, any operation that needs elevated access happens server-side via the service-role key.

## Future admin-role implementation (planned)

When content authoring is ready:

1. Add a column to `auth.users` (or a separate `app_admin_users` table joined by `auth.uid()`).
2. Set a JWT `app_metadata.role = 'admin'` on the user.
3. Replace the "absence of policy" pattern with policies that check `auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'` for actions beyond the published-content SELECT.
4. Administrative UIs run server-side and pass through the service-role key OR through admin-role JWTs, never through anon/authenticated directly.

This work belongs to a future ADR (proposed ADR-007) before any editor tooling ships.

## How migrations are applied

1. Log in to the Supabase Dashboard for the dedicated project.
2. SQL Editor → paste `supabase/migrations/0001_initial_schema.sql` → Run.
3. Repeat for `0002_storage_buckets.sql`.

Local development (after Supabase CLI is added):

```bash
supabase link --project-ref <ref>
supabase db push
```

## Next.js version + upgrade date

- Foundation next.js: 15.4.4
- Upgraded to **16.2.12** on 2026-07-30 in PR that also hardened RLS / storage policies
- See `/docs/deployment.md` for the upgrade procedure.
