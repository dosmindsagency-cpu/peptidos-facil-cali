-- ============================================================================
-- 0002_storage_buckets.sql
-- Initial Storage buckets for Péptidos Fácil Cali.
-- Apply only after a Supabase project has been created via the dashboard or
-- Management API.
--
-- SECURITY MODEL (per ADR-006):
--   * Bucket public=true controls READ access (anyone with the URL can read).
--   * Bucket policies control WRITE access.
--   * The auth.role() in storage policies is ALWAYS service-role or anon or
--     authenticated — explicitly scoped to keep generic authenticated users
--     out of public-bucket mutation.
-- ============================================================================

-- ---- bioverso-public ----
-- Read-only public assets. No public uploads. Inserts must come from the
-- service-role only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bioverso-public',
  'bioverso-public',
  true,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- ---- content-public ----
-- Article cover images and other public content assets.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-public',
  'content-public',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- ---- user-private ----
-- Requires authentication. Used for saved calendars and user-uploaded assets.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-private',
  'user-private',
  false,
  26214400, -- 25 MB
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/calendar']
)
on conflict (id) do nothing;

-- ===========================================================================
-- Public bucket policies
-- ===========================================================================
--
-- The buckets `bioverso-public` and `content-public` are public for READS.
-- Per the security model, NO role should be able to write to them through
-- the public APIs:
--   * anon            — never granted INSERT / UPDATE / DELETE.
--   * authenticated   — never granted INSERT / UPDATE / DELETE.
--   * service-role    — bypasses RLS, used by trusted background jobs only.
--
-- We enforce this by writing no INSERT / UPDATE / DELETE storage policies
-- for these buckets. The explicit deny is by absence — Supabase storage
-- policies default to deny when no policy matches.

-- ===========================================================================
-- user-private bucket policies
-- ===========================================================================
-- Only the owner can SELECT / INSERT / UPDATE / DELETE their own objects.
-- The `auth.uid()` comparison makes "owner" implicitly the authenticated user.
-- Nothing here grants access to anonymous users.

drop policy if exists "user_private_select_own" on storage.objects;
create policy "user_private_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

drop policy if exists "user_private_insert_own" on storage.objects;
create policy "user_private_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

drop policy if exists "user_private_update_own" on storage.objects;
create policy "user_private_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'user-private'
    and auth.uid() = owner
  )
  with check (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

drop policy if exists "user_private_delete_own" on storage.objects;
create policy "user_private_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );
