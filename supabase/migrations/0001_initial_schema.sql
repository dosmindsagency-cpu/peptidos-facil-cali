-- ============================================================================
-- 0001_initial_schema.sql
-- Péptidos Fácil Cali — initial foundation tables + Row Level Security
--
-- Mirrored in src/types/supabase.ts and documented in /docs/database.md
--
-- SECURITY MODEL (per ADR-006):
--   * Authenticated role is NOT an administrator.
--   * No public SELECT / INSERT / UPDATE / DELETE on leads or providers
--     from the anon or authenticated roles beyond what's spelled out below.
--   * All editorial reads/writes on content_items and providers happen
--     via SERVICE-ROLE-keyed server code. The auth role has no implicit
--     CRUD on these tables.
--   * Implies: a future admin role will be implemented separately
--     (e.g. custom claims on JWTs) before any authenticated user can
--     edit content or providers.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Utility: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ===========================================================================
-- profiles — each authenticated user can only access their own row.
-- No admin policy.
-- ===========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  preferred_language text not null default 'es',
  california_region text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_language_chk check (preferred_language in ('es', 'en'))
);
create index if not exists profiles_email_idx on public.profiles (email);
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- DELETE is intentionally NOT granted to the authenticated role.
-- Service-role key is the only path for profile deletion.

-- ===========================================================================
-- leads
--   * anonymous INSERT only when consent_at is not null
--   * no anon UPDATE, no anon DELETE
--   * no authenticated SELECT, no authenticated UPDATE/DELETE
--   * all reading & administration happens through SERVICE-ROLE server code
-- ===========================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  optional_phone text,
  region text,
  goal text,
  preferred_language text not null default 'es',
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint leads_email_required check (length(email) between 3 and 254),
  constraint leads_language_chk check (preferred_language in ('es', 'en'))
);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_region_idx on public.leads (region);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Anonymous INSERT only with explicit consent captured on the row.
-- No SELECT / UPDATE / DELETE granted to anon.
create policy "leads_insert_anon_with_consent"
  on public.leads for insert
  to anon
  with check (consent_at is not null);

-- Intentionally NO policies for authenticated role.
-- Authenticated users CANNOT select leads or modify them client-side.
-- All admin-style access goes through service-role server-side only.

-- ===========================================================================
-- content_items
--   * public SELECT only when status = 'published'
--   * NO authenticated CRUD
--   * all editorial access (drafts, create, update, delete) via service-role
-- ===========================================================================
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content_type text not null,
  status text not null default 'draft',
  language text not null default 'es',
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint content_type_chk check (
    content_type in (
      'peptide', 'article', 'guide', 'faq',
      'glp1', 'recovery', 'safety', 'longevity',
      'weight', 'california_resource', 'provider_selection'
    )
  ),
  constraint content_status_chk check (
    status in ('draft', 'in_review', 'published', 'archived')
  )
);
create index if not exists content_items_slug_idx on public.content_items (slug);
create index if not exists content_items_status_idx on public.content_items (status);
create index if not exists content_items_content_type_idx on public.content_items (content_type);
create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute function public.tg_set_updated_at();

alter table public.content_items enable row level security;

-- Public reads only for published items. Anon and authenticated both get
-- this; nothing else.
create policy "content_items_public_select_published"
  on public.content_items for select
  to anon, authenticated
  using (status = 'published');

-- Intentionally NO INSERT / UPDATE / DELETE policy for anon or authenticated.
-- Editing happens via service-role server code only.

-- ===========================================================================
-- providers
--   * public SELECT only when active = true AND verification_status = 'verified'
--   * NO authenticated CRUD
--   * all provider lifecycle (create, update, deactivate, referral URL,
--     discount code, deletion) via service-role server code
-- ===========================================================================
create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  website text,
  referral_url text,
  discount_code text,
  verification_status text not null default 'unverified',
  last_reviewed_at timestamptz,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint providers_verification_chk check (
    verification_status in ('unverified', 'pending', 'verified', 'rejected')
  )
);
create index if not exists providers_region_idx on public.providers (region);
create index if not exists providers_active_idx on public.providers (active);
create trigger providers_set_updated_at
  before update on public.providers
  for each row execute function public.tg_set_updated_at();

alter table public.providers enable row level security;

-- Public reads only for verified, active providers.
create policy "providers_public_select_verified_active"
  on public.providers for select
  to anon, authenticated
  using (active = true and verification_status = 'verified');

-- Intentionally NO INSERT / UPDATE / DELETE policy for anon or authenticated.
-- Provider lifecycle is service-role-only.
