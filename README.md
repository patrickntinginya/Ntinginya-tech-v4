# Ntinginya Tech website (V4)

> **Phase 2 notes are in `docs/V4_PHASE2.md`. Read the deploy order there: run the new SQL migration before deploying.**

## Phase 2 summary

- **New migration** `supabase/migrations/20261008000000_v4_dynamic_content.sql` (additive): `posts.featured`, `messages.is_archived`, and a
  `content_entries` table (products, solutions, Masterclass sessions, R&D items) with RLS.
- **Admin:** new *Content* manager (`/admin/content`), Featured flag on posts, message Archive, dashboard quick actions and extra counts.
- **Public, now database-driven with built-in fallbacks:** Products (+ detail pages), Solutions, Masterclass sessions, R&D sections,
  home highlights, Latest news (featured first), Innovation Hub and Agriculture article feeds.
- **Search:** `/search` (database search; results pages are `noindex`), search icon in the header, `SearchAction` structured data.
- **PWA:** `manifest.ts` + icons. No service worker; **no offline support**.
- **Verification:** see the end of this file and `docs/V4_PHASE2.md`. Nothing here was built, deployed or run against Supabase by the author.

---


This package upgrades the existing V3 project in place. It is **not** a rebuild: Supabase, authentication, the `/admin`
CMS, the contact pipeline (Supabase `messages` + Resend), `middleware.ts`, `netlify.toml`, the SQL migrations and the
Google Search Console verification are unchanged. Drop the files over the repository and review the diff.

## 1. Audit findings (from the real source, not the old README)

| Area | Finding |
|---|---|
| Stack | Next.js `^15.5`, React `^19.1`, TypeScript strict, Tailwind 3.4, lucide-react, `@supabase/ssr` + `supabase-js`, `sanitize-html` |
| Backend | **Supabase exists**: Postgres, Auth, Storage, RLS. Two migrations (`supabase/migrations/`) |
| Auth / admin | Exists. `middleware.ts` gate, `requireStaff()` in the admin layout, `getStaffOrNull()` in every action/API |
| CMS | Exists: `posts` (with `tags text[]`, `featured_image`, `category_id`, `author_name`), `categories`, `media`, `site_settings`, activity log |
| Contact | `/api/contact`: same-origin check, size limit, honeypot, server validation, hashed-IP rate limit, stores to `messages`, then Resend email |
| Google verification | In `src/app/layout.tsx` (`metadata.verification.google`). **Untouched** |
| SEO | Per-page `buildMetadata`, canonical URLs, sitemap (includes published posts), robots, Organization + Article JSON-LD, OG image |
| Netlify | `netlify.toml` with `@netlify/plugin-nextjs`, Node 22. **Unchanged** |
| Env vars | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. No new variables added |
| Already good | Mostly Server Components (client only: Header, contact form, login, admin editors), `next/font`, skip link, reduced-motion CSS, 44px tap targets, honest status labels (LIVE/MVP/IN DEVELOPMENT/PROPOSED/FUTURE) |
| Problems found | CMS images used raw `<img>` (no resizing/AVIF/WebP); no shared card/radius/shadow tokens; `.env.example` and `.gitignore` were missing from the uploaded ZIP; no `.eslintrc` (so `npm run lint` prompts); no Expert Network; Masterclass, R&D and Agriculture pages lacked the requested sections; hero copy differed from the brief |

## 2. What changed

**Design system**
- CSS variables in `globals.css` (`--radius-card`, `--radius-control`, `--shadow-card`, `--shadow-lift`, `--duration-base`, `--ease-brand`) mapped to Tailwind (`rounded-card`, `shadow-card`, `duration-base`, `ease-brand`). Colours are unchanged, as `AGENTS.md` requires.
- New reusable pieces: `ui/Card`, `ui/EmptyState`, `ui/FormField` (shared `Field` + `inputClass`), `ui/JsonLd`, `media/CmsImage`, `.reveal` and `.lift` utility classes.

**Pages and features**
- **Home**: hero is now "Technology. Agriculture. Innovation." with the requested supporting text and the CTAs "Explore Solutions" / "Work With Us". Added *Latest from the Innovation Hub* (CMS-driven, hidden until an article exists) and an *Expert Network* call to action. All existing sections are kept.
- **Solutions**: six reusable cards (Software, Web, Mobile, AI, Business systems, Digital transformation) with icon, description, CTA that pre-fills the contact form, and hover lift. Existing `#ai` anchor still works.
- **Agriculture**: four category cards (Farming, Livestock, Agricultural Education, AgriTech) plus the newest articles from the existing `agriculture-livestock` CMS category.
- **Innovation Hub** (`/innovation`): CMS-driven article grid with seven topic filters, pagination and cards showing image, title, description, country, category, date and Read more. Existing research content is kept below it.
- **Masterclass**: benefits, upcoming sessions, instructors, testimonials and FAQ (native `<details>`, FAQPage JSON-LD). Sessions, instructors and testimonials render **only when real entries are added** to `src/content/masterclass.ts`; until then the page says so honestly.
- **R&D** (`/r-and-d`): research areas, experiments, innovation projects (linked to products with status badges), publications, future technologies.
- **Projects**: the existing `/products` route is the project showcase. `Product` gained optional `technologies`, `url`, `image`, `featured`; they display only when filled in.
- **Expert Network** (new `/network`): "Join the Ntinginya Tech Network" with the requested fields. It reuses `/api/contact`, so applications are validated server-side, rate-limited, stored in the existing `messages` table (visible in `/admin/messages`, subject starts with "Expert Network:") and emailed via Resend. No new table, route handler or backend.
- **Contact**: "Subject" is now a "Service" select (stored in the same `subject` column), phone validation added, shared accessible `Field`.
- **Navigation**: added Network; desktop bar omits "Home" (the logo links home) so ten links still fit.

**Performance**
- CMS images use `next/image` (AVIF/WebP, responsive `sizes`, lazy loading, reserved width/height) when hosted on this project's Supabase storage; any other https image falls back to a lazy `<img>`. `next.config.mjs` allow-lists the Supabase host derived from the existing `NEXT_PUBLIC_SUPABASE_URL`.
- Scroll reveal and card hover are pure CSS (no JavaScript, no animation library) and are disabled for `prefers-reduced-motion`.
- New sections are Server Components. New client JavaScript: only the Expert Network form.
- Pages remain on ISR (`revalidate` 60-300 s).

**SEO**
- New `/network` metadata and sitemap entry; FAQPage JSON-LD; WebSite JSON-LD and richer Organization JSON-LD; semantic heading order on new sections. Google verification, canonical URLs, robots and existing JSON-LD are unchanged.

## 3. Files

New: `src/app/network/page.tsx`, `src/components/{innovation/InnovationCard,innovation/InnovationFeed,media/CmsImage}.tsx`,
`src/components/sections/{ExpertForm,NetworkCTA,LatestInnovation,SolutionCards,FaqList,MasterclassDetail,ResearchPrograms,AgricultureCategories}.tsx`,
`src/components/ui/{Card,EmptyState,FormField,JsonLd}.tsx`, `src/lib/innovation.ts`, `.env.example`, `.gitignore`.

Changed: `globals.css`, `tailwind.config.ts`, `next.config.mjs`, `package.json` (version only), `src/app/{layout,page,sitemap}.ts(x)`,
`src/app/{innovation,masterclass,r-and-d,agriculture}/page.tsx`, `src/app/news/{page,[slug]/page}.tsx`, `src/config/site.ts`,
`src/content/{solutions,masterclass,research,products}.ts`, `src/lib/cms/public.ts`,
`src/components/layout/Header.tsx`, `src/components/news/PostCard.tsx`,
`src/components/sections/{Hero,ContactForm,CTASection,SolutionsDetail,ProductCard}.tsx`.

## 4. How editors feed the Innovation Hub (no schema change)

In `/admin`, tag a published article with one or more of these lowercase tags: `global innovation`, `tanzania innovation`,
`smart farming`, `livestock technology`, `ai & agriculture`, `modern machinery`, `digital agriculture`.
Add a country name as a tag (for example `japan`, `israel`, `tanzania`) to show the country on the card.
The Agriculture page lists articles in the existing **Agriculture & Livestock** category (slug `agriculture-livestock`).

## 5. Environment variables

No new variables. Existing ones are listed in `.env.example`. Real values stay in Netlify, never in the repo.

## 6. Integration notes

- Nothing to migrate in Supabase. No SQL was added.
- Expert Network answers are stored as text inside `messages.message`. A dedicated table and an admin view belong in the backend/admin package.
- Netlify: `netlify.toml` is unchanged. If next/image is not wanted, delete the `images` block in `next.config.mjs`; `CmsImage` then falls back to `<img>` automatically only when the Supabase host is unset.

## 7. Verification

**Could be done (offline sandbox, npm registry blocked):**
- Syntax parse of all 125 `.ts`/`.tsx` files with the TypeScript compiler: 0 errors.
- Scripted check that every `@/` and relative import resolves to a file and every named import exists as an export: 0 problems.

**Could NOT be done, and has NOT been verified:**
- `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run start`. The sandbox cannot reach the npm registry, so dependencies could not be installed. **Run `npm install && npm run typecheck && npm run build` before merging.**
- No automated tests exist in the repository.
- No browser, device, Lighthouse, screen-reader or Netlify deploy testing. Mobile layouts were written mobile-first with existing breakpoints but are unverified visually.
- Live Supabase queries (tag filters on `posts.tags` using `cs`/`ov`) were not run against a real database.

**Known remaining issues**
- `npm run lint` prompts to create an ESLint config because the repo has none; not changed here.
- Not built, deliberately: `CourseCard` (the existing three Masterclass levels already serve as courses), `ExpertCard` and testimonials (no real people or quotes exist; the architecture accepts them), animated counters (no meaningful numbers to count), a Modal (no use case).
- Hero copy now follows the brief; the "Where we are today" honesty note is kept.

---

# Original V3 notes


Next.js (App Router) + React + TypeScript + Tailwind CSS 3 + Lucide icons.
V3 adds Supabase (auth, database, storage), a News & Insights CMS, an admin area and Resend email.
**Start with `docs/V3_SETUP.md`.**

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Production check:

```bash
npm run typecheck
npm run lint
npm run build && npm run start
```

## Structure

```
src/
  app/            Routes: / /about /solutions /products /products/[slug] /agriculture
                  /innovation /masterclass /r-and-d /news /contact /privacy /terms
                  + api/contact, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  components/
    layout/       Header (sticky, mobile menu), Footer, Logo, SocialLinks
    sections/     Page sections (Hero, CoreAreas, Products, Innovation, Masterclass, ...)
    ui/           Button, Container, Section, SectionHeading, StatusBadge, ProcessRail
    visuals/      HeroVisual, ContourBackdrop (SVG)
  content/        All copy and data (products, countries, core areas, research steps)
  config/site.ts  Company name, tagline, contact details, nav
  lib/            metadata helper, contour math, cn()
```

## Before launch

- Social links and contact details can now be edited in `/admin/settings` (defaults live in `src/config/site.ts`).
- `src/app/privacy/page.tsx` and `terms/page.tsx`: describe what the code actually does; have a lawyer review them.
- `src/components/layout/Logo.tsx` and `src/app/icon.svg`: text/mark placeholder until an official logo exists.
- Status labels: edit `src/content/*.ts` (LIVE, MVP, IN DEVELOPMENT, PROPOSED, FUTURE). Never mark something LIVE before it is.

## V3: CMS, admin and contact

- `/news`, `/news/[slug]`: published posts only (RLS plus an explicit filter). SEO metadata, canonical URL, Article JSON-LD.
- `/login`, `/admin/*`: owner/admin only. Checked in middleware, in the admin layout, on every page and in every server action.
- `/api/contact`: validates on the server, stores the message in Supabase first, then sends a Resend notification.
  If Resend is not configured the message is still stored and the site never claims an email was sent.
- `/api/admin/media`: staff-only image upload (JPEG/PNG/WebP, 5 MB, magic-byte check).
- `supabase/migrations/`: two additive, idempotent SQL files, run in order (tables, RLS, storage bucket, starter categories; then post tags and author name).
- Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) are server-only and must never use the `NEXT_PUBLIC_` prefix.

## Deploy (Netlify)

Netlify builds Next.js natively (`netlify.toml`). Add the variables from `.env.example` in
Site configuration > Environment variables, then deploy. Full steps: `docs/V3_SETUP.md`.

Google Fonts are downloaded at build time, so the build machine needs internet access.


---

# Phase 2 verification status

**COMPLETED (code written):** migration, content manager, featured posts, archive, dynamic public sections, search, manifest/icons, loading skeletons, docs, RLS check script.

**VERIFIED (offline, this sandbox):**
- Syntax parse of all 139 `.ts`/`.tsx` files: 0 errors.
- Import/export resolution script: 0 problems.
- Approximate TypeScript strict check using stand-in type declarations for React, Next, lucide and Supabase (the real packages cannot be installed here): no errors in project code. This is NOT a substitute for `npm run typecheck`.

**NOT VERIFIED:** `npm install`, `npm run build`, lint, any test (none exist), the migration SQL against a real database, RLS behaviour (`supabase/tests/rls_checks.sql` is written but unrun), admin login, post publishing, image upload, contact submission, mobile layout, Lighthouse/Core Web Vitals, PWA installability, Netlify deploy.

**REQUIRES CONFIGURATION:** run the new migration; Supabase env vars; Resend (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`) for email (messages are saved without it).

**FUTURE:** role-management UI, service worker, full-text search index, automatic Masterclass registration, AI integrations.
