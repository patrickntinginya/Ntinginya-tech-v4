-- Ntinginya Tech V3: post tags, editable author name, profile backfill.
-- Additive and idempotent. Run after 20260929000000_v3_cms.sql. Never drops or deletes data.

-- Tags: lowercase labels, at most 12 per post.
alter table public.posts add column if not exists tags text[] not null default '{}';
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_tags_limit') then
    alter table public.posts
      add constraint posts_tags_limit check (coalesce(array_length(tags, 1), 0) <= 12);
  end if;
end $$;
create index if not exists posts_tags_idx on public.posts using gin (tags);

-- Optional public byline. When empty, the author's profile name is shown.
alter table public.posts add column if not exists author_name text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_author_name_length') then
    alter table public.posts
      add constraint posts_author_name_length check (author_name is null or char_length(author_name) <= 120);
  end if;
end $$;

-- Accounts created before the profiles trigger existed get a plain 'user' profile.
-- Existing profiles (and their roles) are left untouched.
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'full_name', ''), 'user'
from auth.users u
on conflict (id) do nothing;
