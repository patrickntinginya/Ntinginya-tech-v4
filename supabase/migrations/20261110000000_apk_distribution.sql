-- Ntinginya Tech: APK distribution
-- Additive migration. Does not modify existing CMS tables.

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon_url text,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint apps_name_length
    check (char_length(name) between 1 and 120),

  constraint apps_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table if not exists public.app_releases (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  version text not null,
  version_code bigint not null,
  release_notes text not null default '',
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null default 'application/vnd.android.package-archive',
  size_bytes bigint not null,
  status text not null default 'DRAFT',
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint app_releases_status_check
    check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),

  constraint app_releases_size_check
    check (size_bytes > 0 and size_bytes <= 157286400),

  constraint app_releases_version_code_check
    check (version_code > 0),

  constraint app_releases_published_date_check
    check (status <> 'PUBLISHED' or published_at is not null),

  constraint app_releases_version_code_unique
    unique (app_id, version_code)
);

create index if not exists apps_published_idx
  on public.apps (is_published);

create index if not exists app_releases_app_created_idx
  on public.app_releases (app_id, created_at desc);

create index if not exists app_releases_published_idx
  on public.app_releases (app_id, published_at desc)
  where status = 'PUBLISHED';

drop trigger if exists apps_set_updated_at on public.apps;
create trigger apps_set_updated_at
before update on public.apps
for each row execute function public.set_updated_at();

drop trigger if exists app_releases_set_updated_at on public.app_releases;
create trigger app_releases_set_updated_at
before update on public.app_releases
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.apps enable row level security;
alter table public.app_releases enable row level security;

grant select on public.apps to anon, authenticated;
grant select on public.app_releases to anon, authenticated;
grant insert, update, delete on public.apps to authenticated;
grant insert, update, delete on public.app_releases to authenticated;

-- Public visitors can see published applications.
drop policy if exists "apps_public_read_published" on public.apps;
create policy "apps_public_read_published"
on public.apps for select
to anon, authenticated
using (is_published = true);

-- Staff can manage and view all applications.
drop policy if exists "apps_staff_read_all" on public.apps;
create policy "apps_staff_read_all"
on public.apps for select
to authenticated
using (public.is_staff());

drop policy if exists "apps_staff_insert" on public.apps;
create policy "apps_staff_insert"
on public.apps for insert
to authenticated
with check (public.is_staff());

drop policy if exists "apps_staff_update" on public.apps;
create policy "apps_staff_update"
on public.apps for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "apps_staff_delete" on public.apps;
create policy "apps_staff_delete"
on public.apps for delete
to authenticated
using (public.is_staff());

-- Public visitors can see published releases of published applications only.
drop policy if exists "app_releases_public_read_published" on public.app_releases;
create policy "app_releases_public_read_published"
on public.app_releases for select
to anon, authenticated
using (
  status = 'PUBLISHED'
  and published_at is not null
  and published_at <= now()
  and exists (
    select 1
    from public.apps a
    where a.id = app_releases.app_id
      and a.is_published = true
  )
);

drop policy if exists "app_releases_staff_read_all" on public.app_releases;
create policy "app_releases_staff_read_all"
on public.app_releases for select
to authenticated
using (public.is_staff());

drop policy if exists "app_releases_staff_insert" on public.app_releases;
create policy "app_releases_staff_insert"
on public.app_releases for insert
to authenticated
with check (public.is_staff());

drop policy if exists "app_releases_staff_update" on public.app_releases;
create policy "app_releases_staff_update"
on public.app_releases for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "app_releases_staff_delete" on public.app_releases;
create policy "app_releases_staff_delete"
on public.app_releases for delete
to authenticated
using (public.is_staff());

-- Separate public APK bucket. Maximum size: 150 MB.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'apks',
  'apks',
  false,
  157286400,
  array['application/vnd.android.package-archive']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Only authenticated staff can upload APK files.
drop policy if exists "apks_staff_insert" on storage.objects;
create policy "apks_staff_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'apks'
  and public.is_staff()
);

drop policy if exists "apks_staff_update" on storage.objects;
create policy "apks_staff_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'apks'
  and public.is_staff()
)
with check (
  bucket_id = 'apks'
  and public.is_staff()
);

drop policy if exists "apks_staff_delete" on storage.objects;
create policy "apks_staff_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'apks'
  and public.is_staff()
);

drop policy if exists "apks_staff_select" on storage.objects;
create policy "apks_staff_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'apks'
  and public.is_staff()
);
