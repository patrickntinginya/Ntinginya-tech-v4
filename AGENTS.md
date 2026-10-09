# AGENTS.md — Ntinginya Tech V3

Company website + CMS for Ntinginya Tech (Tanzania). Next.js 15 App Router, React 19, TypeScript (strict),
Tailwind CSS 3, Supabase (Postgres, Auth, Storage), Resend email, deployed on Netlify (native Next.js runtime).
Beginner setup guide: `docs/V3_SETUP.md`.

## Key decisions
- **Backend is Supabase by owner's decision.** Do not migrate to Netlify Database/Identity/Blobs.
- V3 is the only codebase. The original project was a strict subset of V3 and nothing from it is kept separately.
- Status labels are exactly LIVE / MVP / IN DEVELOPMENT / PROPOSED / FUTURE (`src/content/types.ts`).
  Never present future initiatives as operational; never invent partners, customers, awards or offices.
- R&D route is `/r-and-d`; `/research` 301-redirects (next.config.mjs).
- The site must build and render public pages with **no** Supabase env vars set (helpers return null/defaults).

## Layout
- `src/app/` routes. Public pages, `news/`, `login/`, `admin/*` (server actions in `admin/actions.ts`),
  `api/contact` (public form), `api/admin/media` (staff uploads).
- `src/content/` all marketing copy as data. `src/config/site.ts` company defaults (overridable in admin Settings).
- `src/lib/supabase/` clients: `server.ts` (session + anon public), `browser.ts`, `admin.ts` (service role, server-only).
- `src/lib/cms/` validation, sanitising (sanitize-html allow-list), media validation (magic bytes), activity log.
- `supabase/migrations/` additive, idempotent SQL only. Never add DROP TABLE / DELETE / role overwrites.

## Security rules
- Authorisation: middleware (first gate) → `requireStaff()` in admin layout/pages → `getStaffOrNull()` in every action/API → RLS.
- `SUPABASE_SERVICE_ROLE_KEY` / `RESEND_API_KEY` only in files importing `server-only`. Never `NEXT_PUBLIC_` them.
- Article HTML is sanitised on save and again on render.

## Conventions
- Match existing Tailwind tokens (`deep`, `field-*`, `maize-*`, `mist`, `paper`, `sage`); no new colours.
- Mobile-first; admin must stay usable at 360px.
