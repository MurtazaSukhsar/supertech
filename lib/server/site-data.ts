import { unstable_cache } from 'next/cache'

import {
  getCategories,
  getContentOverrides,
  getFaqs,
  getProducts,
  getSite,
  getTranslationsAr,
  type ArabicTranslations,
  type SiteData,
} from './store'
import type { Category, Product } from '@/lib/products'
import { primeRuntimeSiteData } from '@/lib/product-storage'
import { CATALOG_TAG } from './cache'
import { primeContentOverrides } from '@/lib/i18n'
import { replaceFaqs, type Faq } from '@/lib/content'
import { replaceFaqsAr } from '@/lib/content-ar'

/**
 * One cached read of everything the public site needs from Supabase.
 *
 * The catalogue is identical for every visitor, so querying Postgres on each
 * render is pure waste — and on the free tier it's the quickest way through
 * the egress allowance. Next's data cache holds the result under
 * `CATALOG_TAG`, and admin writes call `revalidateTag`, so an edit is visible
 * on the very next request rather than whenever a timer happens to lapse.
 */

export type SnapshotData = {
  products: Product[]
  categories: Category[]
  site: SiteData
  content: Record<string, unknown>
  translationsAr: ArabicTranslations
  faqs: { en: Faq[]; ar: Faq[] }
}

async function load(): Promise<SnapshotData> {
  const [products, categories, site, content, translationsAr, faqsEn, faqsAr] = await Promise.all([
    getProducts(),
    getCategories(),
    getSite(),
    getContentOverrides(),
    getTranslationsAr(),
    getFaqs('en'),
    getFaqs('ar'),
  ])
  return {
    products,
    categories,
    site,
    content,
    translationsAr,
    faqs: { en: faqsEn, ar: faqsAr },
  }
}

/**
 * The `revalidate` window is a backstop only — tag invalidation is what makes
 * edits appear immediately. It exists so a change made directly in the
 * Supabase dashboard still reaches the site without a deploy.
 */
const loadCached = unstable_cache(load, ['super-tech-site-data'], {
  tags: [CATALOG_TAG],
  revalidate: 300,
})

export async function getSiteData(): Promise<SnapshotData> {
  return loadCached()
}

/**
 * Load the snapshot and push it into the module-level runtime cache that the
 * synchronous catalogue helpers read through.
 *
 * Called from the locale layout, so by the time any page body renders,
 * `getAllProducts()`, `contactInfo`, and friends all return live data without
 * every component having to become async.
 *
 * Sharing module state across requests is safe because the data is identical
 * for every visitor — there is nothing user-specific to leak.
 */
export async function primeSiteData(): Promise<SnapshotData> {
  const snapshot = await getSiteData()
  primeRuntimeSiteData({
    products: snapshot.products,
    categories: snapshot.categories,
    contact: snapshot.site.contact,
    images: snapshot.site.images,
    translationsAr: snapshot.translationsAr,
  })
  primeContentOverrides(snapshot.content)
  replaceFaqs(snapshot.faqs.en)
  replaceFaqsAr(snapshot.faqs.ar)
  return snapshot
}

/**
 * Prime without throwing.
 *
 * Called from layouts, pages, and metadata, where a Supabase outage or missing
 * env vars should degrade to the committed seed data rather than take the
 * whole site down with a 500.
 */
export async function primeSiteDataSafely(): Promise<SnapshotData | null> {
  try {
    return await primeSiteData()
  } catch (error) {
    console.error('[site-data] falling back to seed data:', (error as Error).message)
    return null
  }
}
