# Supabase + Cloudinary setup

Products, categories, page text, FAQs, and contact details live in Supabase
Postgres. Images live in Cloudinary. Admin login uses Supabase Auth.

Until the keys are filled in, the site still runs — it falls back to the
committed JSON in `data/`, and the admin login page says what's missing. So you
can do these steps in any order without breaking anything.

---

## 1. Create the tables

Supabase dashboard → **SQL Editor** → **New query** → paste the contents of
`supabase/schema.sql` → **Run**.

Re-running it later is safe; every statement is idempotent.

What it sets up: six tables, indexes, a full-text search index over the product
copy, and row level security that lets the public **read** the catalogue but
gives nobody permission to write. Writes only happen server-side with the
service role key, which bypasses RLS.

## 2. Fill in `.env.local`

Supabase dashboard → **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Cloudinary dashboard → **Settings → API Keys**:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=super-tech/products
```

The URL and anon key are public by design — they end up in the browser bundle
and are protected by RLS. **The service role key and the Cloudinary secret are
not.** They stay server-side, and `.env.local` is git-ignored so they never
reach GitHub.

Restart the dev server after editing this file.

## 3. Create your admin user

Supabase dashboard → **Authentication → Users → Add user**. Use your email and
a password, and tick **Auto Confirm User** so no email verification is needed.

Then turn off public sign-ups so nobody else can create an account:
**Authentication → Providers → Email** → disable **Enable sign ups**.

Anyone with a confirmed account can reach `/admin`, so keep that list short.

## 4. Push your existing data up

```
npm run migrate:images
```

This reads `data/*.json` and writes 70 products, 8 categories, FAQs, contact
details, and all the Arabic translations into Supabase — then uploads every
local image to Cloudinary and points the product records at the new URLs.

Use `npm run migrate` instead if you want to move the data now and leave images
as local files for the moment.

The script is safe to re-run: everything is an upsert keyed on id or slug, so a
second run updates rows rather than duplicating them.

## 5. Check it worked

```
npm run dev
```

Open <http://localhost:3000/admin>, sign in with the email and password from
step 3, and confirm the product list shows your catalogue. Edit something and
reload the public site.

---

## How the pieces fit

**Reads.** `lib/server/site-data.ts` pulls the whole catalogue in one batch,
cached by Next under the `catalog` tag. Every page primes that data before it
renders, so the ~20 components that read products synchronously keep working
without becoming async. On the client, `I18nProvider` refreshes from
`/api/site-data` after mount.

Priming happens in each page rather than only in the layout because Next can
start rendering a page body before its layout finishes — priming only in the
layout meant a freshly added product could 404 on its first request.

**Writes.** Only `lib/server/store.ts` touches the database, using the service
role key. Every write calls `revalidateTag('catalog')`, which is what makes an
edit visible on the very next request. An in-process cache would not work here:
route handlers and page renders run in separate module instances, so a counter
bumped by a write is invisible to the renderer.

**Images.** `lib/server/media.ts` is the only file that knows about Cloudinary.
Uploads are signed server-side rather than using an unsigned preset — an
unsigned preset is a public write endpoint anyone can post to. Delivery URLs
carry `f_auto,q_auto`, so browsers get AVIF or WebP at an automatically chosen
quality.

Images are compared by **public id**, never by URL string. The same picture is
reachable through URLs that differ in transformation, version, and the `?_a=`
parameter Cloudinary appends, so a string comparison would let an in-use image
slip past the delete guard.

**Client components.** These are bundled in their own module graph, so the copy
of the catalogue they read is not the one the server primed. The layout passes
the live snapshot to `<I18nProvider>`, which primes the client-side copy during
render — before any child renders, in both SSR and hydration. Without that,
server-rendered markup falls back to the committed seed data.

**Auth.** Supabase Auth with cookie sessions. `proxy.ts` does a cheap cookie
check to bounce signed-out visitors, and `requireAdmin()` in each admin page
verifies the token with Supabase — that second check is the one that counts.

## Deploying to Vercel

Everything here works on serverless now; nothing writes to the filesystem.

Add all the env vars from `.env.local` in **Vercel → Project → Settings →
Environment Variables**, then deploy.

Two things worth knowing:

- Free Supabase projects pause after 7 days with no database requests. A live
  site's traffic prevents this, but a staging project may need waking up.
- `data/*.json` stays in the repo as the seed and as an offline fallback. It is
  no longer the source of truth — once you've migrated, edit through `/admin`.

## Troubleshooting

**"NEXT_PUBLIC_SUPABASE_URL is missing"** — `.env.local` isn't filled in, or the
dev server wasn't restarted after editing it.

**Login says "Invalid login credentials"** — the user exists but isn't
confirmed. Tick Auto Confirm User when creating it, or confirm from the
dashboard.

**Products list is empty** — the migration hasn't run yet, or it ran against a
different project. Check **Table Editor → products** in the dashboard.

**Images don't appear after migrating** — you ran `npm run migrate` without
`--images`, so the records still point at `/images/...`. Re-run
`npm run migrate:images`.
