# supertechint.com.kw — Indexing & Product Schema Diagnosis

Prepared by inspecting the live site (supertechint.com.kw), its robots.txt and sitemap.xml, the raw HTML of the example product page and several others, and the actual Next.js source in your connected `super-tech-website` project (`app/sitemap.ts`, `app/robots.ts`, `app/[locale]/products/[id]/page.tsx`, `proxy.ts`, `data/products.json`, git history).

## Bottom line

The 221 "Discovered – currently not indexed" URLs are almost certainly **not** caused by a technical defect and **not** caused by the Product structured-data warning. Your git history shows the first commit on 23 July 2026 and the sitemap-validation request started 23 August 2026 — this is a brand-new domain with essentially zero external footprint (a web search for the domain returns nothing at all, not even a directory listing). Google discovered ~224 URLs from your sitemap almost all at once, has crawled a handful, and is being conservative about indexing the rest until the site earns some trust and authority signals. That is the normal, expected lifecycle for a new catalogue site with 80+ near-simultaneously-published product pages — it is not a sign that something is broken, and it typically resolves over 4–12 weeks as Google works through the backlog, provided (as is the case here) the technical foundation and content are sound.

Everything I checked on the technical side — robots.txt, sitemap.xml, canonical tags, hreflang, HTTP status codes, rendering, internal linking, content depth — is implemented correctly. There was one small, unrelated technical issue (a temporary, language-sniffing redirect on the bare domain root), covered in Q6/Q9. The rest of this document works through your ten questions in order, then gives the concrete template-level changes.

**Status: the two concrete code fixes below (sitemap `lastmod`, root redirect) have been applied directly in your `super-tech-website` project.** They're sitting as uncommitted changes in your working tree — commit and deploy them the same way you normally ship changes. Nothing was changed on the live server directly; the diffs are described exactly where each fix is discussed below (Q5, Q9, §10).

---

## 1. Does the Product structured-data error have anything to do with the 221 not-indexed URLs?

No. These are two separate, unrelated systems inside Search Console:

- **Page indexing** (crawling → rendering → the decision to add a URL to the index) is driven by crawl budget, site trust/authority, perceived content quality and uniqueness, and technical crawlability (robots.txt, status codes, canonicalization). It has nothing to do with whether your structured data validates.
- **Enhancements → Products** (what flagged "Either 'offers', 'review' or 'aggregateRating' should be specified") only governs eligibility for the Product *rich result* — the price/rating snippet in search results. Google explicitly documents that structured-data errors do not affect ranking or indexing; a page with invalid or missing optional structured data is indexed exactly the same as one with perfect structured data. It just won't get the extra visual treatment in the SERP.

Your product page (`heavy-duty-spring-mount-isolator`) is a clean illustration of this: Google's own Live Test already told you "Page can be indexed ✅" and "Crawled successfully ✅" *at the same time* it flagged the Product snippet as invalid. Google itself is telling you these are independent. Fixing the schema warning will not move a single URL from "Discovered – currently not indexed" to "Indexed."

## 2. Can/should a quote-only product use `offers` without a public price?

No — and you were right not to. Google's structured-data guidelines treat `price` (and `priceCurrency`) as required *within* an `Offer` for it to validate. There is no schema.org or Google-recognized value for "call for price" or "request a quote" inside `offers`. Your options if you wanted to force it to validate would all involve publishing something untrue (a real price you don't charge, `price: 0`, or "Contact us" as a price string), and Google's structured-data policy explicitly prohibits inaccurate or misleading markup — doing this risks a manual structured-data spam action later, on top of just being dishonest to anyone who reads your page source. So: don't add `offers`, and don't feel obligated to.

## 3. What's the correct JSON-LD for a Request-a-Quote product?

I pulled the actual JSON-LD your product page template emits, and it's already the right shape — someone (or a previous session) clearly thought this through:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Heavy Duty Spring Mount Isolator",
  "description": "Floor-mounted heavy spring vibration isolator designed for cooling towers, chillers, and large industrial pumps.",
  "category": "Duct Accessories",
  "image": ["https://res.cloudinary.com/.../picture12"],
  "inLanguage": "en"
}
```

The source even has a comment explaining exactly why `offers` is omitted (no published price, Google requires a real one, a fake price would be inaccurate). That reasoning is correct and I've left it exactly as-is — no code change needed here. `brand` is already conditionally included when `product.brand` exists, which is good. I checked whether you're tracking internal/manufacturer part numbers anywhere (a `sku`/`mpn` field would be a free, honest addition) — your product records (`data/products.json` and the Supabase schema) don't currently carry one, so there's nothing to add without inventing data; worth revisiting if you start tracking part numbers.

I would **not** add `aggregateRating` or `review` until you have real customer reviews to attach (see Q4), and I would not invent an `Offer` block.

## 4. Should you use `offers`, `review`, or `aggregateRating` at all?

Not right now, and specifically:

- **offers** — no, per Q2/Q3, until you publish real per-unit pricing (even a public "starting from X KWD" price on some items would qualify, if that ever becomes viable).
- **review / aggregateRating** — no, unless you start collecting real customer reviews (e.g. via Google Business Profile reviews you're allowed to reference, or an on-site review system with real submissions). Fabricating either is exactly the kind of thing Google's structured-data spam policies target, and it's a much bigger risk than a permanent "invalid item" notice — a manual action for spam structured data can suppress rich results sitewide, not just for one product type.

Practically: accept that Search Console's **Enhancements → Products** report will keep showing "0 valid items" indefinitely, because none of your products will ever qualify for the Product rich result without real pricing or real reviews. That report going "green" is not an achievable or meaningful goal for a quote-only wholesale catalogue, and chasing it with synthetic data would actively hurt you. If having a permanently-red Enhancements tile bothers you and you want it gone entirely rather than just ignored, the clean way to do that is to stop declaring `@type: "Product"` at all (use `@type: "Service"` instead, which Google doesn't evaluate against the offers/review/aggregateRating requirement) — I've included that as an optional variant in the template section below. It's a cosmetic choice either way; it has no effect on indexing.

## 5. Is the sitemap correctly structured?

Yes, structurally. I fetched it directly: valid XML, 224 `<url>` entries (166 product URLs across en/ar, 16 category URLs, 12 blog URLs, plus static/area pages), each entry carries reciprocal `xhtml:link rel="alternate" hreflang="en/ar/x-default"` pairs, and `robots.ts`/`sitemap.ts` are both generated from the live catalogue via Next.js's built-in `MetadataRoute` APIs rather than hand-maintained — so it can't drift out of sync with what pages actually exist (your own code comment in `sitemap.ts` documents a past bug where it did drift, and how the union-merge fixed it).

One real but minor issue, **now fixed**: `lastmod` for almost every URL (everything except blog posts) was set to `new Date()` at the moment the sitemap is *requested*, not the actual last time that product/category's content changed. Practically every non-blog URL was reporting "modified right now" on every single fetch. Google treats an implausibly-fresh `lastmod` with skepticism and can start ignoring it as a freshness signal if it never correlates with real content changes.

Your Supabase `products` and `categories` tables already had a real `updated_at` column (with a trigger keeping it honest), it just wasn't threaded through to the app — the Supabase row was fetched with `select('*')` but `toProduct()`/`toCategory()` in `lib/server/store.ts` dropped the column when mapping to the app's `Product`/`Category` types. I added `updatedAt` to both types (`lib/products.ts`), carried it through the row mapping (`lib/server/store.ts`), and `app/sitemap.ts` now uses it when present, falling back to request-time only for seed-only records that have never been edited through the admin panel. Products and categories added or edited from here on will report their real modification date in the sitemap automatically.

## 6. Could EN + AR versions be causing canonical/duplicate/indexing problems?

No — this is implemented the textbook-correct way, and it's one of the stronger parts of the site. I checked the raw HTML `<head>` of both the English and Arabic versions of the example product page:

- Each locale has its own **self-referencing canonical**: the English page canonicals to the `/en/...` URL, the Arabic page canonicals to the `/ar/...` URL. Neither is canonicalized to the other, which is correct — they're translations, not duplicates.
- Each locale carries the full reciprocal **hreflang** set (`en`, `ar`, `x-default` → `en`), both in the page `<head>` and in the sitemap. Reciprocal, matching hreflang in both places is exactly what Google's internationalization guidelines ask for.
- `<html lang="en" dir="ltr">` vs `<html lang="ar" dir="rtl">` are set correctly per locale.

Google will treat these as one logical page in two languages, not as duplicate content. This is not contributing to the indexing backlog.

## 7. Do the product pages have enough unique content to be indexed?

Yes. I pulled the real product data (`data/products.json`) and the rendered page text, not just the meta description. Each product has a genuine multi-paragraph description — the Fischer anchor entry, for example, runs to several hundred words covering the actual use case (concrete-ceiling MEP fixings in Kuwait's building stock), a specifications rundown (brand, material, sizes, application), and locally-relevant context, not spun or templated filler. The rendered page adds a specifications table, breadcrumbs, a related-products rail, and clear calls to action. Visible text on the example page ran to roughly 1,800+ words once you include the shared elements (nav, related products, business info) and a few hundred words that are specific to that one product. This is not thin content by any reasonable definition, and it's not the kind of copy-pasted manufacturer boilerplate that commonly causes "discovered, not indexed" for distributor sites. If anything, this is above-average for the vertical — keep writing product copy this way as you add more products; it's a real asset once the site has aged enough for Google to lean on it.

## 8. Could internal linking be causing "Discovered – currently not indexed"?

Mostly no. I checked whether products are reachable only through the sitemap (a common cause of this exact status) or actually linked from crawlable HTML. The `/en/products` listing page server-renders plain `<a href>` links to all 83 English product pages in the raw HTML — not behind a "load more" button or client-side pagination — so nothing is orphaned relative to the main catalogue index. Individual category pages (e.g. `/en/categories/clamps`) show a smaller, paginated subset with a client-side pager, so a product deep in a large category might only get a first-class internal link from the flat `/products` page rather than from its category page too — worth keeping an eye on as categories grow, but since the flat listing already covers everything, this isn't leaving pages undiscoverable today.

## 9. Canonical tags, hreflang, robots directives, HTTP status, and other technical checks

Checked directly against the live site:

- **HTTP status**: product, category, and listing pages all return `200 OK`, served from Next.js's prerender cache (`x-nextjs-prerender: 1`) — meaning Googlebot receives fully-rendered HTML on the first request, not a JavaScript shell it has to execute. This rules out the other most common cause of "Discovered – currently not indexed" (client-side-rendered content Google can't see without a second rendering pass).
- **robots.txt**: permissive (`Allow: /`, only `/admin` and `/api` disallowed), references the sitemap correctly, and is generated from `app/robots.ts` — matches what Google's Live Test already told you.
- **Meta robots**: no `noindex` anywhere on the pages I checked.
- **Canonical / hreflang**: correct on every page checked (see Q6).
- **One real issue, unrelated to the products, now fixed**: the bare domain root `https://supertechint.com.kw/` (and `www.`) was issuing an HTTP **307** redirect to `/en`, decided by `proxy.ts` reading a `NEXT_LOCALE` cookie first and falling back to the `Accept-Language` header. Two problems with that: (1) a 307 is a *temporary* redirect, which tells Google not to consolidate the root URL's signals into `/en` the way a permanent redirect would; (2) Google's own internationalization guidelines specifically advise against auto-redirecting based on detected language/locale, because it can be inconsistent across crawl locations and prevents a stable, indexable version of the root URL. This wasn't causing your 221 products to sit unindexed (product URLs are direct routes and never touched this logic), but it was real and easy to fix — see §10.B for exactly what changed.

## 10. What should you change once in the template so it applies to all products automatically?

Good news: your architecture already works this way, and I confirmed it by reading the actual code rather than assuming. There's exactly one product page template (`app/[locale]/products/[id]/page.tsx`) that every product route is statically generated from via `generateStaticParams()`, and it's the single place that builds both the JSON-LD and the canonical/hreflang metadata for every product. There's exactly one sitemap generator (`app/sitemap.ts`) and one robots generator (`app/robots.ts`). You are not maintaining anything per-product by hand — a change to these three files applies to all 80+ products (and both locales) on the next deploy. The three changes worth making:

### A. Sitemap `lastmod` — use real content dates instead of request time — ✅ applied

`entry()` in `app/sitemap.ts` was always being called with `now = new Date()` for products and categories. Your Supabase tables already track a real `updated_at` per row; it just wasn't exposed to the app. Applied across three files:

- `lib/products.ts` — added `updatedAt?: string` to both the `Product` and `Category` types.
- `lib/server/store.ts` — added `updated_at: string` to the `ProductRow`/`CategoryRow` shapes and mapped it through in `toProduct()`/`toCategory()` (the Supabase query already used `select('*')`, so no query changed, only the mapping).
- `app/sitemap.ts`:

```ts
const productRoutes = products.flatMap((product) =>
  entry(
    `/products/${product.id}`,
    product.updatedAt ? new Date(product.updatedAt) : now, // seed-only entries with no real timestamp
    'monthly',
    product.featured ? 0.8 : 0.65,
  ),
)
```

and the same pattern for `categoryRoutes`. Seed-JSON-only entries (never edited through the admin panel) still fall back to request time since they have no real timestamp — that's expected and harmless.

Verified with `npx tsc --noEmit`: zero new type errors from these changes (the repo has ~80 pre-existing, unrelated errors in a stale `_to_delete/` cache folder and two `lucide-react` import names — untouched, out of scope here).

### B. Root-domain redirect — stop auto-redirecting by detected language — ✅ applied

In `proxy.ts`, the root path (and any locale-less path) was redirecting via a temporary `307` to a locale chosen by reading `Accept-Language` when no cookie was set — the exact pattern Google's internationalization guidelines advise against, since crawlers don't send a consistent `Accept-Language` and the same URL could resolve to a different locale depending on who requests it. Applied:

- `detectLocale()` now only honors an explicit, previously-saved language-switcher cookie (`NEXT_LOCALE`) — a real, deliberate user choice, which Google's guidance is fine with. It no longer inspects `Accept-Language` at all; everyone with no saved preference, including every crawler, gets the one fixed default locale (`en`).
- The redirect itself now passes `308` (permanent) instead of the implicit `307`, since this is a fixed URL-structure decision, not a temporary one, and the target no longer varies by request headers.

One UX trade-off worth knowing about: a first-time Arabic-speaking visitor hitting the bare domain with no saved language cookie will now land on `/en` by default instead of being auto-detected into `/ar`, until they use the language switcher once (after which their choice is remembered via the cookie, as before). This is the trade Google's own guidance recommends, but flagging it in case you'd rather default new Kuwait-region visitors to Arabic — that would be a deliberate product decision to make explicitly (e.g. keying off something more stable than `Accept-Language`), not something to auto-detect for SEO reasons.

### C. Optional, not applied: make the Product-schema warning disappear from Search Console entirely

Left this one alone — it's a discretionary cosmetic choice, not a fix, and your existing code (Q3) is already the correct default. Only do this if the permanent "invalid item" notice actively bothers you; it has no SEO cost either way. Swap `@type: 'Product'` for `@type: 'Service'` in the same JSON-LD block in `page.tsx`:

```ts
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: product.name,
  description: product.description,
  serviceType: category?.name ?? product.category,
  image: product.images.map((image) => absoluteImageUrl(image)),
  provider: { '@id': 'https://supertechint.com.kw/#localbusiness' },
  areaServed: { '@type': 'Country', name: 'Kuwait' },
  inLanguage: locale,
}
```

`Service` has no offers/review/aggregateRating requirement, so Search Console's Products enhancement report simply won't evaluate these pages at all — no more red notice, and nothing fake was added. The tradeoff is you give up eligibility for a future Product rich result if you ever do publish real prices (at which point you'd switch back to `Product` + a real `offers` block in this same one file). I'd only make this change if the dashboard noise is a genuine distraction; otherwise Option A (do nothing, per Q3/Q4) is perfectly fine and is what your code already does.

---

## What will actually move the indexing needle

Since the technical and content fundamentals are already solid, the highest-leverage things from here are mostly *off-page and patience*, not more template fixes:

1. **Time and re-crawling.** A 6-week-old domain with 224 URLs submitted almost simultaneously and zero external mentions is exactly the profile that produces a large "Discovered – currently not indexed" backlog. This typically thins out over 4–12 weeks on its own as Google re-crawls, provided nothing regresses technically.
2. **Real backlinks and citations**, even a handful: your Kuwait supplier/manufacturer relationships, industry directories, your Instagram (already referenced in your LocalBusiness schema), Google Business Profile, local Kuwait business listings. New sites with even a few credible external links get crawled measurably faster than ones with none — and right now a search for your domain turns up nothing at all on the open web.
3. **Use "Request Indexing" sparingly** in URL Inspection on your 10–20 highest-value product/category pages rather than all 221 — it's rate-limited and won't move the needle if used indiscriminately, but it can nudge your best pages to the front of the queue.
4. **Keep publishing genuinely unique content** the way you already are (the product descriptions and blog posts) — this is what will convert "discovered" into "indexed, and ranking" once Google starts trusting the domain, rather than something to fix urgently now.

None of this involves fake prices, fake reviews, or fake ratings — the honest path here is also the correct one technically: your current "no offers" JSON-LD is already what Google recommends for a business that genuinely doesn't have public prices, and the indexing backlog is a maturity issue, not a defect to patch.

---

## Deploying the applied fixes

The changes in §10.A and §10.B are sitting as uncommitted edits in your `super-tech-website` working tree (`lib/products.ts`, `lib/server/store.ts`, `app/sitemap.ts`, `proxy.ts`) — nothing has been touched on the live Hostinger deployment itself. Review the diff, commit, and deploy the way you normally do to get them live. Two things to sanity-check after deploying: fetch `/sitemap.xml` and confirm product `lastmod` values are no longer all identical/current-instant for anything you've edited via the admin panel since launch, and confirm `curl -I https://supertechint.com.kw/` now returns `308` instead of `307`.
