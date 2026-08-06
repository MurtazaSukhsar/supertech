/**
 * Locale-aware view over the product catalogue.
 *
 * `lib/products.ts` stays the single English source of truth. These helpers
 * layer the Arabic translations from `lib/products-ar.ts` on top of it, falling
 * back to English for anything not yet translated so nothing ever renders
 * blank.
 *
 * Ids, slugs, images, brands, and the `category`/`subcategory` *keys* are never
 * translated — they are used for routing, filtering, and lookups.
 */
import {
  categories as enCategories,
  products as enProducts,
  getCategory as getEnCategory,
  getProduct as getEnProduct,
  getProductsByCategory as getEnProductsByCategory,
  getFeaturedProducts as getEnFeaturedProducts,
  getRelatedProducts as getEnRelatedProducts,
  searchProducts as searchEnProducts,
  type Category,
  type Product,
} from '@/lib/products'
import {
  categoryTranslationsAr,
  productTranslationsAr,
  specKeyTranslationsAr,
  subcategoryTranslationsAr,
} from '@/lib/products-ar'
import type { Locale } from '@/lib/i18n/config'

/**
 * A product with its display strings resolved for the active locale. The
 * original English `subcategory` is preserved on `subcategoryKey` so filtering
 * and grouping keep working while the UI shows the translated label.
 */
export type LocalizedProduct = Product & {
  subcategoryKey: string
  specsDisplay: Record<string, string>
}

export type LocalizedCategory = Category & {
  subcategoryKeys: string[]
}

export function localizeCategory(category: Category, locale: Locale): LocalizedCategory {
  if (locale !== 'ar') {
    return { ...category, subcategoryKeys: category.subcategories }
  }

  const tr = categoryTranslationsAr[category.slug]

  return {
    ...category,
    name: tr?.name ?? category.name,
    shortName: tr?.shortName ?? category.shortName,
    description: tr?.description ?? category.description,
    subcategories: category.subcategories.map((sub) => subcategoryTranslationsAr[sub] ?? sub),
    subcategoryKeys: category.subcategories,
  }
}

export function localizeProduct(product: Product, locale: Locale): LocalizedProduct {
  if (locale !== 'ar') {
    return {
      ...product,
      subcategoryKey: product.subcategory,
      specsDisplay: product.specs,
    }
  }

  const tr = productTranslationsAr[product.id]

  const specsDisplay: Record<string, string> = {}
  for (const [key, value] of Object.entries(product.specs)) {
    specsDisplay[specKeyTranslationsAr[key] ?? key] = tr?.specs?.[key] ?? value
  }

  return {
    ...product,
    name: tr?.name ?? product.name,
    description: tr?.description ?? product.description,
    subcategory: subcategoryTranslationsAr[product.subcategory] ?? product.subcategory,
    subcategoryKey: product.subcategory,
    specsDisplay,
  }
}

/* ------------------------------------------------------------------ */
/* Locale-aware wrappers around the English lookups                    */
/* ------------------------------------------------------------------ */

export function getCategories(locale: Locale): LocalizedCategory[] {
  return enCategories.map((category) => localizeCategory(category, locale))
}

export function getCategoryLocalized(slug: string, locale: Locale): LocalizedCategory | undefined {
  const category = getEnCategory(slug)
  return category ? localizeCategory(category, locale) : undefined
}

export function getProducts(locale: Locale): LocalizedProduct[] {
  return enProducts.map((product) => localizeProduct(product, locale))
}

export function getProductLocalized(id: string, locale: Locale): LocalizedProduct | undefined {
  const product = getEnProduct(id)
  return product ? localizeProduct(product, locale) : undefined
}

export function getProductsByCategoryLocalized(slug: string, locale: Locale): LocalizedProduct[] {
  return getEnProductsByCategory(slug).map((product) => localizeProduct(product, locale))
}

export function getFeaturedProductsLocalized(locale: Locale): LocalizedProduct[] {
  return getEnFeaturedProducts().map((product) => localizeProduct(product, locale))
}

export function getRelatedProductsLocalized(
  product: Product,
  locale: Locale,
  limit = 4,
): LocalizedProduct[] {
  return getEnRelatedProducts(product, limit).map((p) => localizeProduct(p, locale))
}

/**
 * Search runs against the English catalogue *and* the Arabic translations, so
 * an Arabic-speaking buyer can search either language — which matters here,
 * since technicians in Kuwait routinely type part names in English.
 */
export function searchProductsLocalized(query: string, locale: Locale): LocalizedProduct[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const englishHits = searchEnProducts(query)
  const seen = new Set(englishHits.map((p) => p.id))

  const arabicHits =
    locale === 'ar' || /[؀-ۿ]/.test(q)
      ? enProducts.filter((product) => {
          if (seen.has(product.id)) return false
          const tr = productTranslationsAr[product.id]
          if (!tr) return false
          const haystack = [
            tr.name,
            tr.description,
            subcategoryTranslationsAr[product.subcategory] ?? '',
            ...Object.values(tr.specs ?? {}),
          ]
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
      : []

  return [...englishHits, ...arabicHits].map((product) => localizeProduct(product, locale))
}
