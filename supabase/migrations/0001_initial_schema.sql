-- ============================================================================
-- 0001_initial_schema.sql
-- Péptidos Fácil Cali — initial foundation tables + Row Level Security
-- Mirrored in src/types/supabase.ts and documented in /docs/database.md
-- ============================================================================

-- ---- Utility: updated_at trigger ---------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---- profiles -----------------------------------------------------------------
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

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- ---- leads --------------------------------------------------------------------
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

-- Anon inserts require explicit consent. Server handler is the canonical entry.
create policy "leads_insert_anon" on public.leads
  for insert with check (auth.role() = 'anon' and consent_at is not null);
create policy "leads_select_authenticated" on public.leads
  for select using (auth.role() = 'authenticated');
-- No update / delete policy -> leads are immutable once accepted.

-- ---- content_items ------------------------------------------------------------
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

create policy "content_items_select_published" on public.content_items
  for select using (status = 'published');
create policy "content_items_all_authenticated" on public.content_items
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---- providers ----------------------------------------------------------------
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

create policy "providers_select_verified_active" on public.providers
  for select using (active = true and verification_status = 'verified');
create policy "providers_all_authenticated" on public.providers
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
