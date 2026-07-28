'use client'

import { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, Check } from 'lucide-react'
import { categories, type Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

const PAGE_SIZE = 12

type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'subcategory'

export function CategoryProductGrid({ products }: { products: Product[] }) {
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('featured')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [pulseGrid, setPulseGrid] = useState(false)

  const availableCategories = useMemo(() => categories, [])

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
      if (sort === 'name-asc') return a.name.localeCompare(b.name)
      if (sort === 'name-desc') return b.name.localeCompare(a.name)
      if (sort === 'subcategory') return a.subcategory.localeCompare(b.subcategory)
      return 0
    })
    return result
  }, [products, selectedCats, selectedBrands, sort])

  // Trigger skeleton loading cross-fade & card pulse when filters change
  useEffect(() => {
    setIsFiltering(true)
    setPulseGrid(true)
    const filterTimer = setTimeout(() => setIsFiltering(false), 220)
    const pulseTimer = setTimeout(() => setPulseGrid(false), 650)
    return () => {
      clearTimeout(filterTimer)
      clearTimeout(pulseTimer)
    }
  }, [selectedCats, selectedBrands, sort, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
    setPage(1)
  }

  function clearFilters() {
    setSelectedCats([])
    setSelectedBrands([])
    setPage(1)
  }

  const hasFilters = selectedCats.length > 0 || selectedBrands.length > 0

  const filterPanel = (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Category</h3>
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
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Brand</h3>
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
      <aside className="hidden w-60 shrink-0 lg:block" aria-label="Product filters">
        <div className="sticky top-36 rounded-2xl border border-border bg-card p-6 shadow-sm">{filterPanel}</div>
      </aside>

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> {filtered.length === 1 ? 'product' : 'products'}
            </p>
            {hasFilters && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                {selectedCats.length + selectedBrands.length} active filters
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
              Filters
              {hasFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {selectedCats.length + selectedBrands.length}
                </span>
              )}
            </button>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-accent"
                aria-label="Sort products"
              >
                <option value="featured">Featured / Mixed</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="subcategory">Subcategory</option>
              </select>
            </label>
          </div>
        </div>

        {/* Mobile filter panel */}
        {mobileFiltersOpen && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 lg:hidden">{filterPanel}</div>
        )}

        {/* Grid Container with Skeleton Cross-fade */}
        {isFiltering ? (
          /* Skeleton Grid */
          <div className="grid grid-cols-2 gap-5 transition-opacity duration-200 md:grid-cols-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[360px] animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="aspect-square w-full rounded-xl bg-secondary" />
                <div className="mt-4 h-4 w-1/3 rounded bg-secondary" />
                <div className="mt-2 h-5 w-3/4 rounded bg-secondary" />
                <div className="mt-auto flex gap-2 pt-4">
                  <div className="h-9 flex-1 rounded-lg bg-secondary" />
                  <div className="h-9 flex-1 rounded-lg bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          /* Real Product Grid with Pulse Flash */
          <div
            className={`grid grid-cols-2 gap-5 transition-all duration-300 md:grid-cols-3 md:gap-6 ${
              pulseGrid ? 'ring-2 ring-accent/30 rounded-2xl p-1 bg-accent/5' : ''
            }`}
          >
            {paginated.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-sm font-medium text-foreground">No products match your filters.</p>
            <button type="button" onClick={clearFilters} className="text-sm font-bold text-accent hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
