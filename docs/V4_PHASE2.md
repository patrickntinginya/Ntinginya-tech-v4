# Ntinginya Tech V4, Phase 2: dynamic content, hardening notes

## Deploy order (important)
1. In Supabase SQL editor run, in order, if not already applied:
   `20260929000000_v3_cms.sql`, `20261001000000_v3_post_tags_author.sql`, **`20261008000000_v4_dynamic_content.sql`** (new).
   The new migration is additive and idempotent: it adds `posts.featured`, `messages.is_archived` and the `content_entries` table
   with RLS. It deletes nothing and changes no roles.
2. **Run the migration BEFORE deploying this code.** The admin dashboard, posts list and messages list read the new columns; until the
   migration is applied those admin lists will show empty or an error. Public pages are written to fall back safely.
3. Deploy to the existing Netlify site. No new environment variables, no `netlify.toml` change.
4. Optional: run `supabase/tests/rls_checks.sql` (rolls back; keeps no data).

## What editors can now do (no code changes)
| Goal | Where |
|---|---|
| Write, schedule, publish or unpublish an article; mark it Featured | Admin > Posts. A future "Published date" schedules it |
| Add Agriculture articles | Posts, category **Agriculture & Livestock** (they appear on /agriculture and /news) |
| Add Innovation Hub articles | Posts, add one of the topic tags (see README section 4); add a country as a tag to show it on the card |
| Add or edit products | Admin > Content > Products (appear on /products, /products/slug, home highlights, search, sitemap) |
| Add solutions | Admin > Content > Solutions (cards after the built-in ones on /solutions) |
| Add Masterclass sessions | Admin > Content > Masterclass. Registration is NOT automatic: the button sends people to the contact form |
| Add R&D items | Admin > Content > R&D; type Experiment, Publication, Research project or Innovation project |
| Archive a contact message | Admin > Messages > Archive (restore any time) |

Built-in content stays in the source files and is shown alongside database content. A database product with the same slug as a built-in one replaces it.

## Caching
Pages are ISR (`revalidate` 60-300 s). Every admin save also calls `revalidatePath` for the affected pages, so new content normally appears
immediately without a rebuild. Duplicate queries inside one render are removed with React `cache`.

## Security notes
- Every admin server action calls `getStaffOrNull()`, then uses the caller's own Supabase session, so RLS is a second independent gate.
- `content_entries`: public can read **published** rows only; only staff can insert, update or delete (policies in the migration).
- Entry links accept only `https://` or site-relative paths; images only `https://`; body text is plain text rendered by React (never HTML).
- Contact and Expert Network submissions still go through `/api/contact` (same-origin check, size limit, honeypot, server validation,
  hashed-IP rate limit, stored before email). If Resend is not configured the message is still saved.
- Secrets: only `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are secret and both are used only in `server-only` files. No `VITE_*` or
  `GEMINI_API_KEY` exist in this project.

## Not implemented (honest list)
- **Role management UI.** Roles (`user`/`admin`/`owner`) are still changed only in SQL, deliberately, to avoid privilege-escalation risk.
- **Service worker / offline.** There is a manifest and icons (installable to the home screen) and nothing else. The site does not work offline.
- **AI features.** None added. Provider keys, if ever added, must be server-only variables without a `NEXT_PUBLIC_` prefix.
- **Automatic Masterclass registration.** Not built; the CTA is "Request information".
- Search is database `ilike` over titles, excerpts, tags and entry summaries (fine at this size). For thousands of articles add a Postgres full-text index.
