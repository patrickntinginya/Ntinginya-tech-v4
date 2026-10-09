-- Ntinginya Tech V4 (Phase 2): dynamic content, featured posts, archived messages.
-- ADDITIVE AND IDEMPOTENT. Run AFTER 20260929000000_v3_cms.sql and 20261001000000_v3_post_tags_author.sql.
-- It never drops a table, never deletes rows and never changes a role. Safe to run more than once.

-- ---------------------------------------------------------------------------
-- posts: featured article flag (shown first on the home page and /news)
-- ---------------------------------------------------------------------------
alter table public.posts add column if not exists featured boolean not null default false;
create index if not exists posts_featured_idx on public.posts (featured, published_at desc) where featured = true;

-- ---------------------------------------------------------------------------
-- messages: archive instead of delete (existing read/unread flag is kept)
-- ---------------------------------------------------------------------------
alter table public.messages add column if not exists is_archived boolean not null default false;
create index if not exists messages_archived_idx on public.messages (is_archived, created_at desc);

-- ---------------------------------------------------------------------------
-- content_entries: one table for structured, editor-managed content that is not an article.
--   kind = product | solution | masterclass | research
-- Articles (News, Agriculture, Innovation Hub) stay in public.posts, organised by categories and tags.
-- ---------------------------------------------------------------------------
create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  slug text not null,
  title text not null,
  summary text,
  body text,
  image text,
  category text,
  status_label text not null default 'proposed',
  features text[] not null default '{}',
  cta_label text,
  cta_url text,
  event_at timestamptz,
  location text,
  byline text,
  seo_title text,
  seo_description text,
  featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_entries_kind_check check (kind in ('product', 'solution', 'masterclass', 'research')),
  constraint content_entries_status_check check (status_label in ('live', 'mvp', 'in-development', 'proposed', 'future')),
  constraint content_entries_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint content_entries_title_length check (char_length(title) between 1 and 200),
  constraint content_entries_features_limit check (coalesce(array_length(features, 1), 0) <= 20),
  constraint content_entries_kind_slug_unique unique (kind, slug)
);

create index if not exists content_entries_public_idx
  on public.content_entries (kind, is_published, sort_order, created_at desc);
create index if not exists content_entries_featured_idx
  on public.content_entries (featured) where featured = true;

drop trigger if exists content_entries_set_updated_at on public.content_entries;
create trigger content_entries_set_updated_at before update on public.content_entries
  for each row execute function public.set_updated_at();

alter table public.content_entries enable row level security;

-- Visitors (anon) and signed-in users see PUBLISHED entries only.
drop policy if exists "entries_public_read_published" on public.content_entries;
create policy "entries_public_read_published" on public.content_entries
  for select to anon, authenticated
  using (is_published = true);

-- Staff (admin/owner) see everything and are the only ones who can write.
drop policy if exists "entries_staff_read_all" on public.content_entries;
create policy "entries_staff_read_all" on public.content_entries
  for select to authenticated using (public.is_staff());

drop policy if exists "entries_staff_insert" on public.content_entries;
create policy "entries_staff_insert" on public.content_entries
  for insert to authenticated with check (public.is_staff());

drop policy if exists "entries_staff_update" on public.content_entries;
create policy "entries_staff_update" on public.content_entries
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "entries_staff_delete" on public.content_entries;
create policy "entries_staff_delete" on public.content_entries
  for delete to authenticated using (public.is_staff());

-- No rows are inserted here. Until staff publish entries, the website shows its built-in content.
