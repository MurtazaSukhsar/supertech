'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import { type Locale, getDir, localePath } from '@/lib/i18n/config'
import { setRuntimeCatalog } from '@/lib/product-storage'

type I18nValue = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  isRtl: boolean
  t: Dictionary
  /** Prefix an app-relative path with the active locale. */
  href: (path?: string) => string
}

const I18nContext = createContext<I18nValue | null>(null)

/**
 * The slice of live data that client components read through the synchronous
 * catalogue helpers. Passed down from the server layout.
 */
export type ClientSiteData = {
  products: unknown[]
  categories: unknown[]
  contact: Record<string, string>
  images: Record<string, string>
  translationsAr: unknown
}

export function I18nProvider({
  locale,
  dictionary,
  siteData,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  siteData?: ClientSiteData | null
  children: React.ReactNode
}) {
  /**
   * Prime during render, not in an effect.
   *
   * Client components are bundled in their own module graph, so the copy of
   * `lib/product-storage` they read is *not* the one the server layout primed
   * — server-rendered markup would show the committed seed data instead of
   * live values. Priming here, in the provider body, happens before any child
   * renders in both SSR and hydration, so children see live data immediately.
   *
   * Doing this during render is safe because it is idempotent module state,
   * identical for every visitor, with nothing user-specific in it.
   */
  if (siteData) {
    setRuntimeCatalog(siteData as Parameters<typeof setRuntimeCatalog>[0])
  }

  const value = useMemo<I18nValue>(() => {
    const dir = getDir(locale)
    return {
      locale,
      dir,
      isRtl: dir === 'rtl',
      t: dictionary,
      href: (path = '/') => localePath(locale, path),
    }
  }, [locale, dictionary])

  /**
   * A browser that loaded the page before an admin edit still holds the
   * build-time catalogue in its JS bundle. Pull the current copy and hand it to
   * the runtime cache that `lib/products.ts` reads through, so the next render
   * anywhere in the tree uses the edited data.
   */
  useEffect(() => {
    let cancelled = false
    fetch('/api/site-data', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data || data.error) return
        setRuntimeCatalog({
          products: data.products,
          categories: data.categories,
          contact: data.contact,
          images: data.images,
          translationsAr: data.translationsAr,
        })
      })
      .catch(() => {
        // Offline or the route is unavailable — the server-rendered data stands.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used inside <I18nProvider>')
  }
  return ctx
}
