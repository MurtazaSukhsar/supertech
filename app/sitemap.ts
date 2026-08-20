import type { MetadataRoute } from 'next'
import { blogPosts, siteUrl } from '@/lib/content'
import {
  getAllProducts,
  getCategories,
  categories as seedCategories,
  products as seedProducts,
} from '@/lib/products'
import { primeSiteDataSafely } from '@/lib/server/site-data'
import { areas } from '@/lib/seo/locations'
import { defaultLocale, locales } from '@/lib/i18n/config'

/**
 * Merge the live (Supabase) catalogue with the committed JSON seed, keeping the
 * live record whenever both describe the same id.
 *
 * Why the sitemap needs this and the rest of the app does not
 * ----------------------------------------------------------
 * `getProductSource()` in lib/products.ts resolves to
 * `getRuntimeProducts() ?? products` — the live catalogue *replaces* the seed
 * outright rather than merging with it. For rendering that is correct: you want
 * to show exactly what the database says.
 *
 * But the product and blog *pages* are statically generated from the seed:
 * `generateStaticParams()` in app/[locale]/products/[id]/page.tsx maps over the
 * imported `products` JSON, not over the runtime catalogue. So every seed entry
 * has a real, crawlable, indexable page — whether or not Supabase still lists
 * it.
 *
 * That mismatch was silently shrinking the sitemap. The deployed sitemap.xml
 * listed roughly 46 products while the site actually served 82: every product
 * that existed in the JSON but not in the live table had a page Google could
 * crawl and no sitemap entry pointing at it. Taking the union fixes that from
 * both directions — live-only records (which are served dynamically) and
 * seed-only records (which are prerendered) both get listed exactly once.
 */
function mergeById<T>(live: T[], seed: T[], id: (item: T) => string): T[] {
  const seen = new Set<string>()
  const merged: T[] = []

  for (const item of [...live, ...seed]) {
    const key = id(item)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged
}

/**
 * Every URL is emitted once per locale, and each entry carries `alternates` so
 * Google sees the en/ar pair as one page in two languages rather than as
 * duplicate content.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The sitemap doesn't go through the locale layout, so it primes its own copy
  // of the catalogue — otherwise new products would never get listed.
  await primeSiteDataSafely()

  const categories = mergeById(getCategories(), seedCategories, (c) => c.slug)
  const products = mergeById(getAllProducts(), seedProducts, (p) => p.id)
  const now = new Date()

  function languages(path: string) {
    return {
      ...Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])),
      /**
       * Tells Google which version to serve when a visitor's language matches
       * neither `en` nor `ar` — without it, searchers outside those two
       * languages get an arbitrary pick. The page-level metadata already
       * declares this; the sitemap was the one place still missing it.
       */
      'x-default': `${siteUrl}/${defaultLocale}${path}`,
    }
  }

  function entry(
    path: string,
    lastModified: Date,
    changeFrequency: 'weekly' | 'monthly',
    priority: number,
  ) {
    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    }))
  }

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/products',
    '/hardware-shop',
  ].flatMap((route) => entry(route, now, 'weekly', route === '' ? 1 : 0.8))

  const categoryRoutes = categories.flatMap((category) =>
    entry(`/categories/${category.slug}`, now, 'weekly', 0.85),
  )

  /**
   * Area pages sit high in the sitemap because they are the pages targeting
   * "hardware shop in <area>" — the queries with the clearest buying intent.
   */
  const areaRoutes = areas.flatMap((area) =>
    entry(`/hardware-shop/${area.slug}`, now, 'weekly', 0.85),
  )

  const productRoutes = products.flatMap((product) =>
    entry(`/products/${product.id}`, now, 'monthly', product.featured ? 0.8 : 0.65),
  )

  const blogRoutes = blogPosts.flatMap((post) =>
    entry(`/blog/${post.slug}`, new Date(post.publishedAt), 'monthly', 0.75),
  )

  return [...staticRoutes, ...categoryRoutes, ...areaRoutes, ...productRoutes, ...blogRoutes]
}
