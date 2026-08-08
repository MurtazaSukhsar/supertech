/**
 * Arabic translations for the product catalogue.
 *
 * Live values come from Supabase (product/category rows carry `*_ar` columns,
 * and the `translations` table holds the shared subcategory and spec-key
 * labels). The committed JSON is the seed used before the first read resolves.
 *
 * Anything missing falls back to the English string, so a newly added product
 * still renders on the Arabic site until it gets translated.
 */
import arSeed from '@/data/translations-ar.json'
import { getRuntimeArabic } from './product-storage'

export type ProductTranslation = {
  name: string
  description: string
  specs?: Record<string, string>
}

export type CategoryTranslation = {
  name: string
  shortName: string
  description: string
}

const seed = arSeed as unknown as {
  categories: Record<string, CategoryTranslation>
  subcategories: Record<string, string>
  specKeys: Record<string, string>
  products: Record<string, ProductTranslation>
}

const source = () => getRuntimeArabic() ?? seed

/**
 * Proxies rather than plain objects: the twenty-odd call sites read these as
 * `categoryTranslationsAr[slug]`, and a proxy lets that keep working while the
 * underlying data swaps from seed to live without anyone re-importing.
 */
function liveRecord<T>(pick: (s: ReturnType<typeof source>) => Record<string, T>): Record<string, T> {
  return new Proxy({} as Record<string, T>, {
    get: (_, key: string) => pick(source())[key],
    has: (_, key: string) => key in pick(source()),
    ownKeys: () => Reflect.ownKeys(pick(source())),
    getOwnPropertyDescriptor: (_, key: string) => {
      const value = pick(source())[key]
      return value === undefined
        ? undefined
        : { value, enumerable: true, configurable: true, writable: false }
    },
  })
}

export const categoryTranslationsAr = liveRecord<CategoryTranslation>((s) => s.categories)
export const subcategoryTranslationsAr = liveRecord<string>((s) => s.subcategories)
export const specKeyTranslationsAr = liveRecord<string>((s) => s.specKeys)
export const productTranslationsAr = liveRecord<ProductTranslation>((s) => s.products)

/**
 * Translate a spec block. Keys fall back to the English label and values fall
 * back to the English value, so an untranslated spec still renders.
 */
export function translateSpecs(
  specs: Record<string, string>,
  translated?: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(specs)) {
    const label = specKeyTranslationsAr[key] ?? key
    out[label] = translated?.[key] ?? value
  }
  return out
}
