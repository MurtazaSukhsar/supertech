'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/products'
import { useI18n } from '@/components/i18n-provider'
import { ProductCard } from '@/components/product-card'

export function RelatedProductsRail({ products }: { products: Product[] }) {
  const { t } = useI18n()
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check scroll bounds
  function updateScrollState() {
    if (!railRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [products])

  function scroll(direction: 'left' | 'right') {
    if (!railRef.current) return
    const cardWidth = 280
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5
    railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-6">
      {/* Scroll Navigation Arrows (desktop) */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.products.dragToScroll}
        </p>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:pointer-events-none"
            aria-label={t.quote.scrollLeft}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:pointer-events-none"
            aria-label={t.quote.scrollRight}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Gradient Fade Masks */}
      {canScrollLeft && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent"
          aria-hidden="true"
        />
      )}
      {canScrollRight && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Scroll Rail */}
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[260px] shrink-0 snap-start sm:w-[280px] lg:w-[300px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
