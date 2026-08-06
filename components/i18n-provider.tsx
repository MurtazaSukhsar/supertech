'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import { type Locale, getDir, localePath } from '@/lib/i18n/config'

type I18nValue = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  isRtl: boolean
  t: Dictionary
  /** Prefix an app-relative path with the active locale. */
  href: (path?: string) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  children: React.ReactNode
}) {
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

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used inside <I18nProvider>')
  }
  return ctx
}
