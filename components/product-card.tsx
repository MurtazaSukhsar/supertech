'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Image } from '@/components/site-image'
import { ArrowRight, Layers, Plus } from 'lucide-react'
import { getCategoryColor, type Product } from '@/lib/products'
import { getCategoryLocalized } from '@/lib/catalog'
import { useQuote } from '@/context/quote-context'
import { useI18n } from '@/components/i18n-provider'

import { TiltCard } from '@/components/tilt-card'

export function ProductCard({ product }: { product: Product }) {
  const { t, locale, href, isRtl } = useI18n()
  const category = getCategoryLocalized(product.category, locale)
  const color = getCategoryColor(product.category)
  const { addItem } = useQuote()

  const [drawn, setDrawn] = useState(false)

  // Trigger draw-in accent animation when card mounts
  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), 100)
    return () => clearTimeout(timer)
  }, [])

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    // Default size option if available
    const defaultSize = product.specs.Size || product.specs['Available Size'] || product.specs['Available Sizes'] || undefined

    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      image: product.images[0],
      selectedSize: defaultSize,
      quantity: 1,
    })
  }

  return (
    <div className="h-full">
      <TiltCard className="group h-full flex flex-col overflow-hidden outline-none">
        <Link
          href={href(`/products/${product.id}`)}
          /**
           * Product cards render in grids — 12 per page on the catalogue and
           * category pages, plus the featured rail on the homepage. With
           * next/link's default viewport prefetching, every card visible on
           * screen triggers its own server render, so scrolling a grid
           * hammered the origin with `?_rsc=` requests until it returned 503s.
           * Fetch on click instead.
           */
          prefetch={false}
          className="relative flex flex-1 flex-col justify-between"
          aria-label={`${t.products.viewProduct}: ${product.name}`}
        >
          {/* Category color-tag accent line */}
          <div
            className={`absolute top-0 z-20 h-1.5 w-full transition-transform duration-500 ease-out ${
              isRtl ? 'right-0 origin-right' : 'left-0 origin-left'
            }`}
            style={{
              backgroundColor: color.hex,
              transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
            }}
            aria-hidden="true"
          />

          {/* Image container */}
          <div className="relative block aspect-square overflow-hidden bg-white p-3 border-b border-border/40">
            <div
              className="absolute inset-0 z-10 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              cldWidth={640}
              className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-108"
            />

          </div>

          {/* Main card content */}
          <div className="relative flex flex-1 flex-col justify-between p-5">
            <div>
              <h3 className="mt-1.5 font-sans text-sm font-bold leading-snug text-card-foreground transition-colors group-hover:text-accent">
                {product.name}
              </h3>

              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/40">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent group-hover:underline">
                {t.products.viewProduct} <ArrowRight className="rtl-flip size-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>

              <button
                type="button"
                onClick={handleQuickAdd}
                className="inline-flex h-7 sm:h-8 items-center gap-1 rounded-lg bg-accent/10 px-2 sm:px-3 text-[10px] sm:text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white shrink-0"
                title={t.quote.addToQuote}
              >
                <Plus className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t.quote.addToQuote}</span>
              </button>
            </div>
          </div>
        </Link>
      </TiltCard>
    </div>
  )
}
