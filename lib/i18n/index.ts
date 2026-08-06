import { en, type Dictionary } from './dictionaries/en'
import { ar } from './dictionaries/ar'
import { defaultLocale, isLocale, type Locale } from './config'

const dictionaries: Record<Locale, Dictionary> = { en, ar }

export function getDictionary(locale: string): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries[defaultLocale]
}

export type { Dictionary }
export * from './config'
