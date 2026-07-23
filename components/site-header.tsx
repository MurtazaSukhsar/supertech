'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { categories } from '@/lib/products'
import { useQuote } from '@/context/quote-context'

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
      router.push(`/search?q=${encodeURIComponent(q)}`)
      setMobileOpen(false)
    }
  }

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-8 lg:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Super Tech home">
            <Image
              src="/images/logo.jpg"
              alt="Super Tech International Construction Materials Co. logo"
              width={360}
              height={188}
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? 'h-12 sm:h-16 md:h-18 lg:h-20' : 'h-16 sm:h-24 md:h-28 lg:h-32'
              }`}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <Link
              href="/"
              className="relative text-sm font-semibold text-foreground transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="relative flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Products
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`absolute left-0 top-full z-50 mt-3 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl transition-all duration-200 origin-top ${
                  dropdownOpen
                    ? 'scale-100 opacity-100'
                    : 'pointer-events-none scale-95 opacity-0'
                }`}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="block rounded-lg px-3.5 py-2.5 text-sm font-medium text-popover-foreground transition-colors hover:bg-accent-light hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            {[
              { href: '/about', label: 'About Us' },
              { href: '/blog', label: 'Blog' },
              { href: '/faq', label: 'FAQ' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-semibold text-foreground transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Quote Basket + CTA */}
          <div className="flex items-center gap-3">
            <form onSubmit={submitSearch} role="search" className="relative hidden md:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-10 w-40 rounded-lg border border-input bg-secondary pl-9 pr-3 text-sm outline-none transition-all focus:w-52 focus:border-accent focus:bg-background focus:shadow-sm focus:shadow-accent/10 lg:w-48 lg:focus:w-60"
              />
            </form>

            {/* Quote Basket Trigger Button */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-background shadow-sm"
              aria-label={`Open Quote Basket, ${totalCount} items`}
            >
              <ShoppingBagIcon className="size-4 text-accent" aria-hidden="true" />
              <span className="hidden sm:inline">Quote Basket</span>
              {totalCount > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-accent-foreground shadow-sm">
                  {totalCount}
                </span>
              ) : (
                <span className="hidden lg:inline text-xs text-muted-foreground">(0)</span>
              )}
            </button>

            <Link
              href="/contact"
              className="hidden h-10 items-center rounded-lg btn-primary px-5 text-sm lg:inline-flex"
            >
              Get a Quote
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`border-b border-border bg-background lg:hidden transition-all duration-300 origin-top ${
          mobileOpen
            ? 'max-h-[80vh] opacity-100 overflow-y-auto'
            : 'max-h-0 opacity-0 overflow-hidden border-b-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
          <form onSubmit={submitSearch} role="search" className="relative mb-4 md:hidden">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-11 w-full rounded-lg border border-input bg-secondary pl-9 pr-3 text-sm outline-none focus:border-accent focus:bg-background"
            />
          </form>
          <nav className="flex flex-col" aria-label="Mobile navigation">
            <Link href="/" className="border-b border-border py-3.5 text-sm font-semibold">
              Home
            </Link>
            <p className="pb-1 pt-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Products
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="py-2.5 pl-3 text-sm font-medium text-foreground"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/about" className="border-t border-border py-3.5 text-sm font-semibold">
              About Us
            </Link>
            <Link href="/blog" className="border-t border-border py-3.5 text-sm font-semibold">
              Blog
            </Link>
            <Link href="/faq" className="border-t border-border py-3.5 text-sm font-semibold">
              FAQ
            </Link>
            <Link href="/contact" className="border-t border-border py-3.5 text-sm font-semibold">
              Contact
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                openDrawer()
              }}
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-bold text-foreground border border-border"
            >
              <ShoppingBagIcon className="size-4 text-accent" />
              View Quote Basket ({totalCount})
            </button>
            <Link
              href="/contact"
              className="mt-2 inline-flex h-12 items-center justify-center rounded-lg btn-primary text-sm"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
