# Database — Foundation Schema

> Source SQL lives in `supabase/migrations/`. TypeScript mirror: `src/types/supabase.ts`.

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

- `select` / `insert` / `update` / `delete` only on rows where `auth.uid() = id`.

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

Indexes: `email`, `region`, `created_at desc`.

**RLS**

- `insert` allowed only from `anon` role AND when `consent_at is not null` — server endpoint must enforce consent before writing.
- `select` limited to `authenticated` role.
- No update / delete policy — leads are immutable once accepted.

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

- Public (anon/authenticated) can `select` only rows where `status = 'published'`.
- Authenticated (admin tooling) has full CRUD via separate policy.

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

- Public sees only `active = true` AND `verification_status = 'verified'`.
- Authenticated role: full CRUD for admin tooling.

## Storage buckets

| Bucket            | Public | Writes                | Use                                          |
| ----------------- | ------ | --------------------- | -------------------------------------------- |
| bioverso-public   | ✅     | service-role only     | Approved anatomical / molecular assets       |
| content-public    | ✅     | service-role only     | Article cover images and content assets      |
| user-private      | ❌     | owner only            | Saved calendars, user uploads                |

Path conventions inside `bioverso-public`:
- `anatomy/` · `organs/` · `cellular/` · `molecules/` · `peptides/` · `mechanisms/` · `backgrounds/` · `icons/` · `motion/`
- File names: `pf-[category]-[subject]-[variant]-[aspect]-[version].png`

## What's NOT in this phase

- `peptide_dosing`, `protocol_*`, or any clinical/health tables.
- Conversation persistence for Pep (Phase 2 — only after rate-limiting is final).
- Email subscription tables (depends on provider, Phase 2+).
- Analytics tables (Phase 3 — separate dataset, PII-free).

## How migrations are applied

1. Log in to the Supabase Dashboard for the dedicated project.
2. SQL Editor → paste `supabase/migrations/0001_initial_schema.sql` → Run.
3. Repeat for `0002_storage_buckets.sql`.

Local development (after Supabase CLI is added):
```bash
supabase link --project-ref <ref>
supabase db push
```
