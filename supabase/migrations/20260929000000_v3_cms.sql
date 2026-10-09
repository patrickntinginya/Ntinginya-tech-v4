-- Ntinginya Tech V3: CMS, admin, contact messages, activity log, settings, storage.
-- Additive and idempotent: safe to run on a project that already has some of these objects.
-- It never drops tables or deletes rows.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roles: user | admin | owner. To add EDITOR / AUTHOR later, extend this constraint.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('user', 'admin', 'owner'));
  end if;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Every new auth user gets a plain 'user' profile. Nobody can sign up as admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role changes are only allowed from the SQL editor / migrations (session_user postgres)
-- or the server-only service-role key. A signed-in user can never change their own role.
create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role
     and session_user not in ('postgres', 'supabase_admin')
     and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'Role changes are not permitted from the client.';
  end if;
  if new.id is distinct from old.id then
    raise exception 'Profile id cannot change.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Staff check used by every policy below. SECURITY DEFINER so it can read profiles without recursion.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'owner')
  );
$$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  );
$$;

revoke all on function public.is_staff() from public;
revoke all on function public.is_owner() from public;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_owner() to authenticated;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff());

-- Users may edit their own row (the trigger above blocks role changes).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No insert/delete policies: rows are created by the trigger and removed with the auth user.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_unique unique (name),
  constraint categories_slug_unique unique (slug),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

-- Category names are public by design (they label public articles).
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories_staff_insert" on public.categories;
create policy "categories_staff_insert" on public.categories
  for insert to authenticated with check (public.is_staff());

drop policy if exists "categories_staff_update" on public.categories;
create policy "categories_staff_update" on public.categories
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "categories_staff_delete" on public.categories;
create policy "categories_staff_delete" on public.categories
  for delete to authenticated using (public.is_staff());

insert into public.categories (name, slug) values
  ('Technology', 'technology'),
  ('Software & Digital Solutions', 'software-digital-solutions'),
  ('AI & Digital Innovation', 'ai-digital-innovation'),
  ('Agriculture & Livestock', 'agriculture-livestock'),
  ('Global AgriTech Innovation', 'global-agritech-innovation'),
  ('Research & Innovation', 'research-innovation'),
  ('Education & Masterclass', 'education-masterclass'),
  ('Ntinginya Tech Updates', 'ntinginya-tech-updates')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null default '',
  featured_image text,
  category_id uuid references public.categories (id) on delete restrict,
  author_id uuid references public.profiles (id) on delete set null,
  status text not null default 'DRAFT',
  seo_title text,
  seo_description text,
  social_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_slug_unique unique (slug),
  constraint posts_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint posts_status_check check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  constraint posts_published_has_date check (status <> 'PUBLISHED' or published_at is not null),
  constraint posts_title_length check (char_length(title) between 1 and 200)
);

create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category_id);
create index if not exists posts_author_idx on public.posts (author_id);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

-- Public visitors see ONLY published posts whose publish time has arrived.
drop policy if exists "posts_public_read_published" on public.posts;
create policy "posts_public_read_published" on public.posts
  for select to anon, authenticated
  using (status = 'PUBLISHED' and published_at is not null and published_at <= now());

drop policy if exists "posts_staff_read_all" on public.posts;
create policy "posts_staff_read_all" on public.posts
  for select to authenticated using (public.is_staff());

drop policy if exists "posts_staff_insert" on public.posts;
create policy "posts_staff_insert" on public.posts
  for insert to authenticated with check (public.is_staff());

drop policy if exists "posts_staff_update" on public.posts;
create policy "posts_staff_update" on public.posts
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "posts_staff_delete" on public.posts;
create policy "posts_staff_delete" on public.posts
  for delete to authenticated using (public.is_staff());

-- Public author names, without exposing emails or roles. Only authors of published posts appear.
create or replace view public.authors_public as
  select p.id, p.full_name
  from public.profiles p
  where exists (
    select 1 from public.posts x
    where x.author_id = p.id and x.status = 'PUBLISHED'
  );
grant select on public.authors_public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- media
-- ---------------------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  filename text not null,
  mime_type text not null,
  size_bytes integer not null,
  alt_text text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint media_storage_path_unique unique (storage_path),
  constraint media_mime_check check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  constraint media_size_check check (size_bytes > 0 and size_bytes <= 5242880)
);

create index if not exists media_created_at_idx on public.media (created_at desc);

alter table public.media enable row level security;

drop policy if exists "media_staff_all_select" on public.media;
create policy "media_staff_all_select" on public.media
  for select to authenticated using (public.is_staff());
drop policy if exists "media_staff_insert" on public.media;
create policy "media_staff_insert" on public.media
  for insert to authenticated with check (public.is_staff());
drop policy if exists "media_staff_update" on public.media;
create policy "media_staff_update" on public.media
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "media_staff_delete" on public.media;
create policy "media_staff_delete" on public.media
  for delete to authenticated using (public.is_staff());

-- ---------------------------------------------------------------------------
-- messages (contact form submissions)
-- Inserted only by the server using the service-role key. No public access at all.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  email_status text not null default 'pending',
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint messages_email_status_check check (email_status in ('pending', 'sent', 'failed', 'not_configured')),
  constraint messages_name_length check (char_length(name) between 1 and 120),
  constraint messages_message_length check (char_length(message) between 1 and 5000)
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_unread_idx on public.messages (is_read) where is_read = false;
create index if not exists messages_ip_recent_idx on public.messages (ip_hash, created_at desc);

alter table public.messages enable row level security;

drop policy if exists "messages_staff_select" on public.messages;
create policy "messages_staff_select" on public.messages
  for select to authenticated using (public.is_staff());
drop policy if exists "messages_staff_update" on public.messages;
create policy "messages_staff_update" on public.messages
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "messages_staff_delete" on public.messages;
create policy "messages_staff_delete" on public.messages
  for delete to authenticated using (public.is_staff());

-- ---------------------------------------------------------------------------
-- activity_log
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);
create index if not exists activity_log_user_idx on public.activity_log (user_id);

alter table public.activity_log enable row level security;

drop policy if exists "activity_staff_select" on public.activity_log;
create policy "activity_staff_select" on public.activity_log
  for select to authenticated using (public.is_staff());
-- Staff can only log entries as themselves. Nobody can edit or delete entries.
drop policy if exists "activity_staff_insert" on public.activity_log;
create policy "activity_staff_insert" on public.activity_log
  for insert to authenticated with check (public.is_staff() and user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- site_settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  site_name text,
  site_description text,
  contact_email text,
  contact_phone text,
  whatsapp text,
  default_seo_title text,
  default_seo_description text,
  social_links jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Settings are public-facing contact/SEO details by design. Secrets never live here.
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);
drop policy if exists "settings_staff_insert" on public.site_settings;
create policy "settings_staff_insert" on public.site_settings
  for insert to authenticated with check (public.is_staff());
drop policy if exists "settings_staff_update" on public.site_settings;
create policy "settings_staff_update" on public.site_settings
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

insert into public.site_settings (id, site_name, site_description, contact_email, contact_phone)
values (
  1,
  'Ntinginya Tech',
  'Ntinginya Tech builds software, digital platforms and technology solutions while advancing innovation across business, agriculture and livestock.',
  'ntinginyatech@gmail.com',
  '+255784949095'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Storage: public-read "media" bucket, staff-only writes, 5 MB, JPEG/PNG/WebP only.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_objects_staff_insert" on storage.objects;
create policy "media_objects_staff_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media_objects_staff_update" on storage.objects;
create policy "media_objects_staff_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media_objects_staff_delete" on storage.objects;
create policy "media_objects_staff_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());

-- Public buckets serve files by URL without a SELECT policy. Listing is limited to staff:
drop policy if exists "media_objects_staff_select" on storage.objects;
create policy "media_objects_staff_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and public.is_staff());

-- ---------------------------------------------------------------------------
-- FIRST OWNER (run manually once, after creating the user in Supabase Auth):
--   update public.profiles set role = 'owner' where email = 'YOUR-EMAIL';
-- ---------------------------------------------------------------------------
