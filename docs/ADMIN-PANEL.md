# Admin panel

Edit the whole site — products, images, hero, every page's text, contact
details, FAQs — from `/admin`, with no code changes.

## Signing in

1. Start the site: `npm run dev`
2. Open <http://localhost:3000/admin>
3. Sign in with the email and password of your Supabase Auth user

Admin accounts are managed in the Supabase dashboard under **Authentication →
Users**. First-time setup (creating the tables, filling in keys, creating your
user, migrating the data) is covered in
[SUPABASE-SETUP.md](./SUPABASE-SETUP.md).

## What each section edits

| Section | Controls |
| --- | --- |
| **Products** | Add, edit, delete, feature. Name, category, subcategory, brand, description, multiple images, spec table, Arabic translation. |
| **Categories** | Name, slug, icon, image, subcategory list, display order (drives the homepage grid and header menu). |
| **Page text** | Every string on the site, grouped by page — hero headline, buttons, stats, testimonials, why-choose-us, about copy, SEO titles and descriptions. English and Arabic. |
| **Site & contact** | Company name, email, phone, address, Maps and Instagram links, plus the hero background, logo, about photo, and CTA background. |
| **FAQs** | Questions and answers for the FAQ page, homepage sidebar, and Google's FAQ rich results. |
| **Media** | Every image in your Cloudinary folder. Upload, copy URLs, delete unused ones. |

Changing the phone number automatically updates the call and WhatsApp links.

## Where the data lives

Text and catalogue data are in **Supabase Postgres**; images are in
**Cloudinary**. Edits appear on the site immediately — every save clears the
cache and revalidates the affected pages.

The JSON files in `data/` are no longer the source of truth. They stay in the
repo as the seed the migration script pushes up, and as a fallback so the site
still renders if Supabase is briefly unreachable.

Page text stores only the strings you actually changed. Anything you haven't
touched keeps following the code, so a future update to an untouched label
still reaches the site.

## Safety rails

- The panel is `noindex`, and every page and API route verifies the session
  against Supabase rather than trusting a cookie.
- Public database access is read-only. Writes only happen server-side with the
  service role key, so a leaked public key can't change anything.
- Uploads are checked by file signature, not by extension, and capped at 10 MB.
- A category still in use by products can't be deleted, and neither can an image
  still referenced by a product or by site settings.
- Renaming a category slug moves its products with it automatically.

## Deploying

Nothing writes to the filesystem, so this runs on Vercel, Netlify, or your own
server. Copy the env vars from `.env.local` into your host's settings and
deploy. Details in [SUPABASE-SETUP.md](./SUPABASE-SETUP.md).
