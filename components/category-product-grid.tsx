'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X, Check } from 'lucide-react'
import { type Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { getCategories } from '@/lib/catalog'
import { useI18n } from '@/components/i18n-provider'
import { gridItemVariants } from '@/lib/motion'
import { localePath } from '@/lib/i18n/config'

const PAGE_SIZE = 12

type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'subcategory'

export function CategoryProductGrid({ products }: { products: Product[] }) {
  const { t, locale, isRtl } = useI18n()
  const shouldReduce = useReducedMotion()
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('featured')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const availableCategories = useMemo(() => getCategories(locale), [locale])

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean) as string[])).sort(),
    [products]
  )

  const filtered = useMemo(() => {
    let result = products
    if (selectedCats.length > 0) {
      result = result.filter((p) => selectedCats.includes(p.category))
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand))
    }
    result = [...result].sort((a, b) => {
      // Arabic needs its own collation or alphabetical sort comes out wrong.
      const collator = new Intl.Collator(locale === 'ar' ? 'ar' : 'en', { numeric: true })
      if (sort === 'name-asc') return collator.compare(a.name, b.name)
      if (sort === 'name-desc') return collator.compare(b.name, a.name)
      if (sort === 'subcategory') return collator.compare(a.subcategory, b.subcategory)
      return 0
    })
    return result
  }, [products, selectedCats, selectedBrands, sort, locale])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const scrollToTop = () => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        if (window.lenis) {
          // @ts-ignore
          window.lenis.scrollTo(0, { immediate: true })
        } else {
          window.scrollTo(0, 0)
        }
      }
    }, 50)
  }

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
    setPage(1)
    scrollToTop()
  }

  function clearFilters() {
    setSelectedCats([])
    setSelectedBrands([])
    setPage(1)
    scrollToTop()
  }

  const hasFilters = selectedCats.length > 0 || selectedBrands.length > 0

  const filterPanel = (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">{t.products.filterCategory}</h3>
        <div className="flex flex-col gap-2.5">
          {availableCategories.map((cat) => {
            const active = selectedCats.includes(cat.slug)
            const count = products.filter((p) => p.category === cat.slug).length
            if (count === 0 && products.length > 10) return null
            return (
              <label
                key={cat.slug}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'border-accent bg-accent/10 text-accent shadow-sm scale-102'
                    : 'border-border bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(selectedCats, cat.slug, setSelectedCats)}
                    className="size-4 rounded accent-[#D91E2A]"
                  />
                  {cat.name}
                </span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      active ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </label>
            )
          })}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">{t.products.filterBrand}</h3>
          <div className="flex flex-col gap-2.5">
            {brands.map((brand) => {
              const active = selectedBrands.includes(brand)
              return (
                <label
                  key={brand}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'border-accent bg-accent/10 text-accent shadow-sm scale-102 animate-chip-snap'
                      : 'border-border bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(selectedBrands, brand, setSelectedBrands)}
                      className="size-4 rounded accent-[#D91E2A]"
                    />
                    {brand}
                  </span>
                  {active && <Check className="size-3.5 shrink-0 text-accent" aria-hidden="true" />}
                </label>
              )
            })}
          </div>
        </div>
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-accent hover:underline"
        >
          <X className="size-3.5" aria-hidden="true" />
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Sidebar filters (desktop) */}
      <aside className="hidden w-60 shrink-0 lg:block" aria-label={t.products.productFilters}>
        <div className="sticky top-36 rounded-2xl border border-border bg-card p-6 shadow-sm">{filterPanel}</div>
      </aside>

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {t.products.showing} <span className="font-bold text-foreground">{filtered.length}</span>{' '}
              {filtered.length === 1 ? t.products.product : t.products.productsCount}
            </p>
            {hasFilters && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                {selectedCats.length + selectedBrands.length} {t.products.activeFilters}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium lg:hidden"
              aria-expanded={mobileFiltersOpen}
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              {t.products.filters}
              {hasFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {selectedCats.length + selectedBrands.length}
                </span>
              )}
            </button>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">{t.products.sort}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-accent"
                aria-label={t.products.sortProducts}
              >
                <option value="featured">{t.products.sortFeatured}</option>
                <option value="name-asc">{t.products.sortNameAsc}</option>
                <option value="name-desc">{t.products.sortNameDesc}</option>
                <option value="subcategory">{t.products.sortSubcategory}</option>
              </select>
            </label>
          </div>
        </div>

        {/* Mobile filter panel */}
        {mobileFiltersOpen && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 lg:hidden">{filterPanel}</div>
        )}

        {/* Product grid.
            The old version flashed six skeleton cards for 220ms on every filter
            change, which read as a page reload for a list that was already in
            memory. Cards now animate between filter states with `layout`, so
            items that survive a filter change slide to their new position
            instead of being torn down and rebuilt. */}
        {paginated.length > 0 ? (
          <motion.div
            layout={!shouldReduce}
            className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {paginated.map((product) => (
                <motion.div
                  key={product.id}
                  layout={!shouldReduce}
                  variants={gridItemVariants}
                  initial={shouldReduce ? 'visible' : 'hidden'}
                  animate="visible"
                  exit={shouldReduce ? 'visible' : 'exit'}
                  transition={{ layout: { duration: 0.32, ease: [0.21, 1, 0.21, 1] } }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-sm font-medium text-foreground">{t.products.noResults}</p>
            <button type="button" onClick={clearFilters} className="text-sm font-bold text-accent hover:underline">
              {t.products.clearFilters}
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label={t.products.pagination} className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1))
                scrollToTop()
              }}
              disabled={currentPage === 1}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border disabled:opacity-40"
              aria-label={t.products.previousPage}
            >
              <ChevronLeft className="rtl-flip size-4" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setPage(n)
                  scrollToTop()
                }}
                aria-current={n === currentPage ? 'page' : undefined}
                className={`inline-flex size-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  n === currentPage
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'border border-border text-foreground hover:bg-secondary'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1))
                scrollToTop()
              }}
              disabled={currentPage === totalPages}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border disabled:opacity-40"
              aria-label={t.products.nextPage}
            >
              <ChevronRight className="rtl-flip size-4" aria-hidden="true" />
            </button>
          </nav>
        )}

        {/*
          Filtering/pagination above is client-side state, not a real URL, so
          only the current page's cards exist as <a> tags in the server-
          rendered HTML — anything past page 1 has no crawlable link pointing
          to it from here. A closed <details> block sidesteps that: its
          content lives in the actual HTML (unlike display:none), so Google
          indexes and follows every link inside it even while collapsed —
          this isn't hidden-for-bots content, it's a real "browse everything"
          fallback for people without JS too. Ensures every product in
          `products` always has at least one real inbound link, regardless of
          what page/filter/sort the visible grid happens to be on.
        */}
        {products.length > 0 && (
          <details className="group mt-12 rounded-2xl border border-border bg-card p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
              {t.products.browseAllProducts}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
              {[...products]
                .sort((a, b) =>
                  new Intl.Collator(locale === 'ar' ? 'ar' : 'en', { numeric: true }).compare(
                    a.name,
                    b.name,
                  ),
                )
                .map((product) => (
                  <li key={product.id} className="truncate text-sm text-muted-foreground">
                    <Link
                      href={localePath(locale, `/products/${product.id}`)}
                      className="hover:text-accent hover:underline"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  )
}
