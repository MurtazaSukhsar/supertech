'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Globe2 } from 'lucide-react'

import { useI18n } from '@/components/i18n-provider'
import { localeConfig, locales, stripLocale, type Locale } from '@/lib/i18n/config'

/**
 * Swaps the locale segment on the current URL rather than sending the user home,
 * so switching language keeps you on the same product / article / category.
 *
 * Rendered as a real <a href> (not a button with a JS-only handler) so every
 * page carries an actual crawlable link to its other-language counterpart —
 * an SEO audit flagged the old button-based switcher because a link that
 * only exists inside an onClick handler is invisible to a crawler that
 * doesn't execute it, even though the alternates/hreflang metadata already
 * pointed the same direction.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const other = locales.find((l) => l !== locale) as Locale
  const rest = stripLocale(pathname)
  const query = typeof window === 'undefined' ? '' : window.location.search
  const target = `/${other}${rest === '/' ? '' : rest}${query}`

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    // Remember the choice so the middleware honours it on the next visit.
    document.cookie = `NEXT_LOCALE=${other};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`

    startTransition(() => {
      router.push(target)
      router.refresh()
    })
  }

  return (
    <Link
      href={target}
      onClick={handleClick}
      aria-label={`${t.nav.languageSwitchLabel}: ${localeConfig[other].label}`}
      aria-disabled={isPending}
      lang={localeConfig[other].htmlLang}
      className={`inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-background aria-disabled:opacity-60 ${className}`}
    >
      <Globe2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span>{localeConfig[other].nativeLabel}</span>
    </Link>
  )
}
