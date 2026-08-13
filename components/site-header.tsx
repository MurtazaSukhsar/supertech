'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Image } from '@/components/site-image'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { getCategories, siteImages } from '@/lib/products'
import { categoryTranslationsAr } from '@/lib/products-ar'
import { useQuote } from '@/context/quote-context'
import { useI18n } from '@/components/i18n-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { EASE_OUT, springPop, staggerContainer, staggerItem } from '@/lib/motion'

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const { totalCount, openDrawer } = useQuote()
  const { t, locale, isRtl, href } = useI18n()
  const shouldReduce = useReducedMotion()

  const categoryName = (slug: string, fallback: string) =>
    locale === 'ar' ? (categoryTranslationsAr[slug]?.name ?? fallback) : fallback

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`${href('/search')}?q=${encodeURIComponent(q)}`)
      setMobileOpen(false)
    }
  }

  const navLinkClass =
    'nav-underline relative shrink-0 whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full'

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/98 shadow-lg shadow-primary/5 backdrop-blur-lg'
          : 'bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85'
      }`}
    >
      {/* Top brand bar */}
      <div
        className={`w-full bg-primary transition-all duration-300 ${
          scrolled ? 'h-1' : 'h-4 md:h-6'
        }`}
        aria-hidden="true"
      />

      {/* Main nav */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 md:px-8 lg:px-12">
          <Link href={href('/')} className="flex shrink-0 items-center gap-3" aria-label={t.nav.homeAriaLabel}>
            <Image
              src={siteImages.logo}
              alt={t.footer.logoAlt}
              width={360}
              height={188}
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? 'h-10 sm:h-12 md:h-16 lg:h-18' : 'h-12 sm:h-16 md:h-22 lg:h-28'
              }`}
              priority
              suppressHydrationWarning
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label={t.nav.mainNavigation}>
            <Link href={href('/')} className={navLinkClass}>
              {t.nav.home}
            </Link>
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href={href('/products')}
                className={`${navLinkClass} flex items-center gap-1`}
              >
                {t.nav.products}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </Link>
              <div
                className={`absolute top-full z-50 mt-1 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl transition-all duration-200 origin-top ${
                  isRtl ? 'right-0' : 'left-0'
                } ${
                  dropdownOpen
                    ? 'scale-100 opacity-100'
                    : 'pointer-events-none scale-95 opacity-0'
                }`}
              >
                {getCategories().map((cat) => (
                  <Link
                    key={cat.slug}
                    href={href(`/categories/${cat.slug}`)}
                    className="block rounded-lg px-3.5 py-2.5 text-sm font-medium text-popover-foreground transition-colors hover:bg-accent-light hover:text-primary"
                  >
                    {categoryName(cat.slug, cat.name)}
                  </Link>
                ))}
              </div>
            </div>
            {[
              { href: '/about', label: t.nav.about },
              { href: '/blog', label: t.nav.blog },
              { href: '/faq', label: t.nav.faq },
              { href: '/contact', label: t.nav.contact },
            ].map((link) => (
              <Link key={link.href} href={href(link.href)} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Language + Quote Basket + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={submitSearch} role="search" className="relative hidden md:block">
              <Search
                className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
                  isRtl ? 'right-3' : 'left-3'
                }`}
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                aria-label={t.nav.searchAriaLabel}
                className={`h-10 w-40 rounded-lg border border-input bg-secondary text-sm outline-none transition-all focus:w-52 focus:border-accent focus:bg-background focus:shadow-sm focus:shadow-accent/10 lg:w-48 lg:focus:w-60 ${
                  isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                }`}
              />
            </form>

            <LanguageSwitcher className="hidden sm:inline-flex" />

            {/* Quote Basket Trigger Button */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-background shadow-sm"
              aria-label={`${t.nav.openQuoteBasket}, ${totalCount} ${t.nav.items}`}
            >
              <ShoppingBagIcon className="size-4 text-accent" aria-hidden="true" />
              <span className="hidden sm:inline">{t.nav.quoteBasket}</span>
              {totalCount > 0 ? (
                /* `key` on the count makes the badge re-mount and pop each time
                   an item is added, so the basket visibly reacts. */
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={totalCount}
                    initial={shouldReduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
                    animate={shouldReduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={springPop}
                    className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-accent-foreground shadow-sm"
                  >
                    {totalCount}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span className="hidden lg:inline text-xs text-muted-foreground">(0)</span>
              )}
            </button>

            <Link
              href={href('/contact')}
              className="hidden h-10 items-center rounded-lg btn-primary px-5 text-sm lg:inline-flex"
            >
              {t.common.getQuote}
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu.
          Height is animated to `auto` rather than toggling a `max-h-screen`
          class. The old approach eased toward a max-height the content never
          reached, so the panel snapped shut and the timing drifted with the
          number of categories. */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={shouldReduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="overflow-hidden border-b border-border bg-background lg:hidden"
          >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:px-8">
          <form onSubmit={submitSearch} role="search" className="relative mb-4 md:hidden">
            <Search
              className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
                isRtl ? 'right-3' : 'left-3'
              }`}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              aria-label={t.nav.searchAriaLabel}
              className={`h-11 w-full rounded-lg border border-input bg-secondary text-sm outline-none focus:border-accent focus:bg-background ${
                isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </form>
          <motion.nav
            className="flex flex-col"
            aria-label={t.nav.mobileNavigation}
            variants={staggerContainer(0.04, 0.06)}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <Link
                href={href('/')}
                className="block border-b border-border py-3.5 text-sm font-semibold"
              >
                {t.nav.home}
              </Link>
            </motion.div>
            <motion.p
              variants={staggerItem}
              className="pb-1 pt-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t.nav.products}
            </motion.p>
            {getCategories().map((cat) => (
              <motion.div key={cat.slug} variants={staggerItem}>
                <Link
                  href={href(`/categories/${cat.slug}`)}
                  className={`block py-2.5 text-sm font-medium text-foreground ${isRtl ? 'pr-3' : 'pl-3'}`}
                >
                  {categoryName(cat.slug, cat.name)}
                </Link>
              </motion.div>
            ))}
            {[
              { to: '/about', label: t.nav.about },
              { to: '/blog', label: t.nav.blog },
              { to: '/faq', label: t.nav.faq },
              { to: '/contact', label: t.nav.contact },
            ].map((link) => (
              <motion.div key={link.to} variants={staggerItem}>
                <Link
                  href={href(link.to)}
                  className="block border-t border-border py-3.5 text-sm font-semibold"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div variants={staggerItem} className="mt-4 sm:hidden">
              <LanguageSwitcher className="w-full justify-center" />
            </motion.div>

            <motion.button
              variants={staggerItem}
              type="button"
              whileTap={shouldReduce ? undefined : { scale: 0.97 }}
              onClick={() => {
                setMobileOpen(false)
                openDrawer()
              }}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-bold text-foreground border border-border"
            >
              <ShoppingBagIcon className="size-4 text-accent" />
              {t.nav.viewQuoteBasket} ({totalCount})
            </motion.button>
            <motion.div variants={staggerItem}>
              <Link
                href={href('/contact')}
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg btn-primary text-sm"
              >
                {t.common.getQuote}
              </Link>
            </motion.div>
          </motion.nav>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
