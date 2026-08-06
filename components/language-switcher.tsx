'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Globe2 } from 'lucide-react'

import { useI18n } from '@/components/i18n-provider'
import { localeConfig, locales, stripLocale, type Locale } from '@/lib/i18n/config'

/**
 * Swaps the locale segment on the current URL rather than sending the user home,
 * so switching language keeps you on the same product / article / category.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const other = locales.find((l) => l !== locale) as Locale

  function switchTo(next: Locale) {
    const rest = stripLocale(pathname)
    // Read the query string off the live URL rather than via useSearchParams().
    // useSearchParams() opts every page containing this button out of static
    // rendering, and the header is on every page.
    const query = typeof window === 'undefined' ? '' : window.location.search
    const target = `/${next}${rest === '/' ? '' : rest}${query}`

    // Remember the choice so the middleware honours it on the next visit.
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`

    startTransition(() => {
      router.push(target)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={() => switchTo(other)}
      disabled={isPending}
      aria-label={`${t.nav.languageSwitchLabel}: ${localeConfig[other].label}`}
      lang={localeConfig[other].htmlLang}
      className={`inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-background disabled:opacity-60 ${className}`}
    >
      <Globe2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span>{localeConfig[other].nativeLabel}</span>
    </button>
  )
}
