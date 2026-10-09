# Ntinginya Tech V3: setup guide

This guide takes you from a fresh computer to a live site with the admin area, the News & Insights CMS,
the contact form and email notifications. **Never put real passwords or keys in this file, in Git, or in chat.**

What you need: a computer with Node.js 22 (20 also works), a free [Supabase](https://supabase.com) account,
a free [Resend](https://resend.com) account, and your existing Netlify site.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Run locally

```bash
cp .env.example .env.local     # then fill in the values (steps 3 to 10)
npm run dev                    # open http://localhost:3000
```

The public website works even without Supabase. Sign-in, the admin area and the news list need it.

## 3. Create a Supabase project

1. In Supabase click **New project**, choose a name and a strong database password (store it in a password manager).
2. Wait until the project is ready.
3. Open **Project settings > API**. Copy the **Project URL**, the **anon public** key and the **service_role** key.

| Value | Goes into | Safe in the browser? |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| anon public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (limited by Row Level Security) |
| service_role key | `SUPABASE_SERVICE_ROLE_KEY` | **NO. Server only. Never prefix with `NEXT_PUBLIC_`.** |

## 4. Apply the database migrations

There are two migration files in `supabase/migrations/`. Run them **in this order**:

1. `20260929000000_v3_cms.sql` — tables (profiles, categories, posts, media, messages, activity_log, site_settings),
   Row Level Security policies, the `media` storage bucket and the 8 starter categories.
2. `20261001000000_v3_post_tags_author.sql` — adds post **tags** and an optional public **author name**, and creates
   profiles for any accounts that existed before the first migration.

How: open **SQL Editor** in Supabase, paste the whole of file 1, press **Run**; then do the same with file 2.
Both are safe to run more than once. They only add things. They never drop a table, reset the database or delete rows,
and they never change the role of an existing profile.

(Or with the Supabase CLI: `supabase link` then `supabase db push`.)

## 5. Configure authentication

1. **Authentication > Providers**: keep **Email** enabled.
2. **Authentication > Sign In / Providers**: turn **off** "Allow new users to sign up". This stops strangers creating accounts.
   (Even if someone did, new accounts only get the plain `user` role and cannot open `/admin`.)
3. **Authentication > URL Configuration**: set **Site URL** to your production address
   and add `http://localhost:3000` to **Redirect URLs** for local work.
4. Session lifetime is controlled in **Authentication > Sessions**. Sessions refresh automatically and expire on their own.

## 6. Create the first OWNER

1. **Authentication > Users > Add user > Create new user**. Enter your email and a strong password. Tick "Auto confirm user".
2. In the **SQL Editor** run (put your own email in):

```sql
update public.profiles set role = 'owner' where email = 'YOUR-EMAIL-HERE';
```

This is the only way to create an owner or admin. Nobody can promote themselves from the website: a database
trigger blocks role changes from the browser, and there is no public sign-up page.
To add an admin later, create the user the same way and set `role = 'admin'`.

## 7. Configure Storage

The migration already creates a public bucket named `media` (5 MB limit, JPEG/PNG/WebP only) with staff-only
upload/delete rules. Check in **Storage** that a bucket named `media` exists. The app never exposes storage secrets.

## 8. Row Level Security (RLS)

Already enabled on every table by the migration. To double-check, open **Authentication > Policies** and confirm
each table (`profiles`, `categories`, `posts`, `media`, `messages`, `activity_log`, `site_settings`) shows RLS enabled.
Public visitors can only read: published posts, categories, site settings and author names of published posts.

## 9. Configure Resend (email notifications)

1. In Resend, **Domains > Add domain**, and add the DNS records it shows at your domain provider. Wait until it says **Verified**.
2. **API Keys > Create API key** (sending access). Copy it once.
3. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (for example `Ntinginya Tech <website@your-domain>`).
   `CONTACT_TO_EMAIL` defaults to `ntinginyatech@gmail.com`.

Without a verified domain and key, the contact form still **saves the message** in the database and the admin
Messages page shows "Email notifications are not configured". The website never claims an email was sent when it was not.

## 10. Environment variables

Put these in `.env.local` for local work (this file is ignored by Git):

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=ntinginyatech@gmail.com
CONTACT_FROM_EMAIL=
```

## 11. Run the checks

```bash
npm run typecheck
npm run lint
npm run build
```

All three must finish without errors before you deploy.

## 12. Deploy to Netlify

The project is already configured (`netlify.toml`): build command installs dependencies then runs `npm run build`, Node 22, and Netlify's native
Next.js runtime (no plugin entry needed). Pages, server actions, API routes and middleware run as Netlify Functions
automatically. Use the one existing Netlify site; do not create a second one.

## 13. Netlify environment variables

In Netlify open **Project configuration > Environment variables > Add a variable** and add:

| Variable | Value | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key | **Yes — tick "Contains secret values"** |
| `RESEND_API_KEY` | Resend API key | **Yes** |
| `CONTACT_FROM_EMAIL` | e.g. `Ntinginya Tech <website@your-domain>` (verified in Resend) | No |
| `CONTACT_TO_EMAIL` | optional; defaults to `ntinginyatech@gmail.com` | No |
| `NEXT_PUBLIC_SITE_URL` | optional; your live address without trailing slash. If empty, Netlify's site URL is used | No |

Scope them to **Builds, Functions and Runtime** (the default "All scopes" is fine).
`NEXT_PUBLIC_*` values are baked in at build time, so **trigger a new deploy** after adding or changing them
(**Deploys > Trigger deploy > Deploy site**).

## 14. Create your first post

1. Open `/login` on your site and sign in.
2. **Posts > New post**. Type a title (the slug is created for you), write the content, pick a category.
   Optionally add **tags** (comma separated), an **author** name to show publicly, and a **published date**
   (leave empty to use the moment you publish; a future date keeps the article hidden until then).
3. Optional: upload an image in **Media**, then choose it as the featured image.
4. Press **Save draft**. Drafts are never public.

## 15. Publish your first article

Open the post and press **Publish**. It appears on `/news`, at `/news/your-slug`, and in `/sitemap.xml`.
**Unpublish** returns it to draft; **Archive** hides it without deleting.
Before publishing, set your display name in **Settings > Your profile** so the author name shows on the article.

## 16. Manage contact messages

**Messages** lists everything sent through the contact form. Tap a message to read it, then **Mark read / unread** or **Delete**.
Unread messages are counted on the dashboard and in the menu.

---

## Quick reference

| Area | Address |
|---|---|
| Public news | `/news`, `/news/[slug]` |
| Sign in | `/login` |
| Admin | `/admin`, `/admin/posts`, `/admin/categories`, `/admin/media`, `/admin/messages`, `/admin/settings`, `/admin/activity` |
| R&D page | `/r-and-d` (old `/research` links redirect to it) |

## Troubleshooting

- **"Sign-in is not set up yet"**: the two `NEXT_PUBLIC_SUPABASE_*` variables are missing on this environment.
- **Signed in but sent back to login**: the account's role is still `user`. Run the SQL in step 6.
- **Posts cannot be saved / News is empty after publishing**: the second migration (step 4) has not been run.
- **Uploads fail**: check the `media` bucket exists (step 7) and the image is JPEG/PNG/WebP under 5 MB.
- **Form says online sending is not switched on**: neither Supabase (service key) nor Resend is configured on that environment.
