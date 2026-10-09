-- Ntinginya Tech V4 Phase 2: Row Level Security checks.
-- Run in the Supabase SQL editor AFTER the three migrations. Everything runs inside a transaction that is
-- rolled back at the end, so no data is kept. Each check prints PASS or raises an exception named FAIL.
-- NOTE: this script was written but has NOT been executed by the author (no database access).

begin;

-- Test data (as the SQL editor's privileged role). One published and one draft entry.
insert into public.content_entries (kind, slug, title, summary, status_label, is_published)
values ('product', 'rls-test-published', 'RLS test published', 'x', 'proposed', true),
       ('product', 'rls-test-draft', 'RLS test draft', 'x', 'proposed', false);

-- 1) ANONYMOUS visitors see published entries only -------------------------------------------------------
set local role anon;
do $$
declare n int;
begin
  select count(*) into n from public.content_entries where slug like 'rls-test-%';
  if n <> 1 then raise exception 'FAIL anon read: expected 1 published row, saw %', n; end if;
  raise notice 'PASS anon sees only published entries';
end $$;

-- 2) ANONYMOUS cannot write ---------------------------------------------------------------------------
do $$
begin
  begin
    insert into public.content_entries (kind, slug, title, status_label) values ('product', 'rls-anon', 'x', 'proposed');
    raise exception 'FAIL anon insert succeeded';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    raise notice 'PASS anon cannot insert content_entries';
  end;
  update public.content_entries set title = 'hacked' where slug = 'rls-test-published';
  if exists (select 1 from public.content_entries where title = 'hacked') then raise exception 'FAIL anon update succeeded'; end if;
  raise notice 'PASS anon cannot update content_entries';
  delete from public.content_entries where slug = 'rls-test-published';
  if not exists (select 1 from public.content_entries where slug = 'rls-test-published') then raise exception 'FAIL anon delete succeeded'; end if;
  raise notice 'PASS anon cannot delete content_entries';
end $$;

-- 3) ANONYMOUS cannot read contact messages --------------------------------------------------------------
do $$
declare n int;
begin
  select count(*) into n from public.messages;
  if n <> 0 then raise exception 'FAIL anon can read messages (%)', n; end if;
  raise notice 'PASS anon cannot read messages';
end $$;

-- 4) ANONYMOUS sees only published, already-live posts (unchanged V3 policy, re-checked) --------------------
do $$
declare n int;
begin
  select count(*) into n from public.posts where status <> 'PUBLISHED' or published_at is null or published_at > now();
  if n <> 0 then raise exception 'FAIL anon can see unpublished posts (%)', n; end if;
  raise notice 'PASS anon cannot see drafts, archived or scheduled posts';
end $$;

reset role;

-- 5) SIGNED-IN NORMAL USER (role "user") is not staff --------------------------------------------------------
-- Replace the UUID below with the id of a real account whose profile role is 'user', then uncomment:
--
-- set local role authenticated;
-- select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated"}', true);
-- select count(*) as draft_entries_visible_to_normal_user from public.content_entries where slug = 'rls-test-draft';  -- expect 0
-- select count(*) as messages_visible_to_normal_user from public.messages;                                          -- expect 0
-- reset role;

-- 6) STAFF: repeat step 5 with the id of an admin/owner profile. Drafts and messages should then be visible.

rollback;
