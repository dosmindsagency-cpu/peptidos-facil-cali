-- ============================================================================
-- 0002_storage_buckets.sql
-- Initial Storage buckets for Péptidos Fácil Cali.
-- Apply only after a Supabase project has been created via the dashboard or
-- Management API. Storage policies are defined per bucket.
-- ============================================================================

-- ---- bioverso-public ----
-- Read-only public assets (anatomy, organs, cellular, etc.).
-- No public uploads. Inserts must come from the service role.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bioverso-public',
  'bioverso-public',
  true,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Convention path prefix: anatomy/, organs/, cellular/, molecules/, peptides/,
-- mechanisms/, backgrounds/, icons/, motion/

-- Public read access is handled by the bucket's `public=true` flag.

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

create policy "user_private_select_own"
  on storage.objects for select
  using (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

create policy "user_private_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

create policy "user_private_update_own"
  on storage.objects for update
  using (
    bucket_id = 'user-private'
    and auth.uid() = owner
  )
  with check (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

create policy "user_private_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'user-private'
    and auth.uid() = owner
  );

-- =============================================================================
-- Storage policies for bioverso-public / content-public:
-- These buckets are public for reads. Writes are restricted to the service role
-- (no public INSERT/UPDATE/DELETE policies are defined).
-- =============================================================================
