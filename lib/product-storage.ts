import type { Category, ContactInfo, Product, SiteImages } from './products'
import siteSeed from '@/data/site.json'

/**
 * Runtime cache for everything the catalogue helpers read.
 *
 * The problem this solves: roughly twenty components call synchronous helpers
 * like `getAllProducts()` or read `contactInfo.phone` during render. Supabase
 * is async. Rather than turn all of them into async server components — and
 * lose the client ones entirely — the live data is loaded once per request by
 * the layout and pushed in here, and the helpers read through it.
 *
 * `contactInfo` and `siteImages` are mutated in place rather than reassigned,
 * because modules that imported them hold the original reference. Assigning a
 * new object would update this module and nothing else.
 *
 * Sharing this across requests is safe: the catalogue is the same for every
 * visitor, so there is no per-user state to leak.
 */

export type ArabicData = {
  categories: Record<string, { name: string; shortName: string; description: string }>
  subcategories: Record<string, string>
  specKeys: Record<string, string>
  products: Record<string, { name: string; description: string; specs?: Record<string, string> }>
}

let runtimeProducts: Product[] | null = null
let runtimeCategories: Category[] | null = null
let runtimeArabic: ArabicData | null = null

/** Seeded from the committed JSON so the site still renders before the first load. */
export const contactInfo: ContactInfo = { ...(siteSeed.contact as unknown as ContactInfo) }
export const siteImages: SiteImages = { ...(siteSeed.images as unknown as SiteImages) }

export function getRuntimeProducts(): Product[] | null {
  return runtimeProducts
}

export function getRuntimeCategories(): Category[] | null {
  return runtimeCategories
}

export function getRuntimeArabic(): ArabicData | null {
  return runtimeArabic
}

export function primeRuntimeSiteData(next: {
  products?: Product[] | null
  categories?: Category[] | null
  contact?: Partial<ContactInfo> | null
  images?: Partial<SiteImages> | null
  translationsAr?: ArabicData | null
}): void {
  if (next.products?.length) runtimeProducts = next.products
  if (next.categories?.length) runtimeCategories = next.categories
  if (next.translationsAr) runtimeArabic = next.translationsAr
  if (next.contact && Object.keys(next.contact).length > 0) Object.assign(contactInfo, next.contact)
  if (next.images && Object.keys(next.images).length > 0) Object.assign(siteImages, next.images)
}

/** Back-compat alias used by the client provider. */
export const setRuntimeCatalog = primeRuntimeSiteData

export function clearRuntimeCatalog(): void {
  runtimeProducts = null
  runtimeCategories = null
  runtimeArabic = null
}
