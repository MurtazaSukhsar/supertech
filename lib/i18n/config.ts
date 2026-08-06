export const locales = ['en', 'ar'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeConfig: Record<
  Locale,
  { label: string; nativeLabel: string; dir: 'ltr' | 'rtl'; htmlLang: string; ogLocale: string }
> = {
  en: {
    label: 'English',
    nativeLabel: 'English',
    dir: 'ltr',
    htmlLang: 'en',
    ogLocale: 'en_US',
  },
  ar: {
    label: 'Arabic',
    nativeLabel: 'العربية',
    dir: 'rtl',
    htmlLang: 'ar',
    ogLocale: 'ar_KW',
  },
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return localeConfig[locale].dir
}

/**
 * Build a locale-prefixed href. Accepts an app-relative path like `/products`
 * and returns `/en/products` or `/ar/products`.
 */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

/**
 * Strip a leading locale segment from a pathname, returning the app-relative path.
 * `/ar/products/abc` -> `/products/abc`
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}
