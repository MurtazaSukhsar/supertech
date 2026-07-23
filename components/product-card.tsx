'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Layers, Plus } from 'lucide-react'
import { getCategory, getCategoryColor, type Product } from '@/lib/products'
import { useQuote } from '@/context/quote-context'

import { TiltCard } from '@/components/tilt-card'

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category)
  const color = getCategoryColor(product.category)
  const { addItem } = useQuote()

  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
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

  // Get top 3 specifications for spec peek
  const specEntries = Object.entries(product.specs).slice(0, 3)
  const activeState = isHovered || isFocused

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <TiltCard className="group h-full flex flex-col overflow-hidden outline-none">
      {/* Category color-tag accent line */}
      <div
        className="absolute left-0 top-0 z-20 h-1.5 w-full origin-left transition-transform duration-500 ease-out"
        style={{
          backgroundColor: color.hex,
          transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
        }}
        aria-hidden="true"
      />

      {/* Image container */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-secondary"
        aria-label={`View details for ${product.name}`}
      >
        <div
          className="absolute inset-0 z-10 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Category color indicator pill */}
        <span
          className="absolute right-3 top-3 z-20 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: color.hex }}
        >
          {category?.shortName ?? product.category}
        </span>
      </Link>

      {/* Main card content */}
      <div className="relative flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {product.subcategory}
            </span>
            {product.brand && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                  {product.brand}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-1.5 font-sans text-sm font-bold leading-snug text-card-foreground">
            <Link href={`/products/${product.id}`} className="transition-colors hover:text-accent">
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Spec-peek panel */}
        <div className="relative mt-3 min-h-[54px] overflow-hidden">
          {/* Default view */}
          <div
            className={`transition-all duration-300 ease-out ${
              activeState
                ? 'pointer-events-none translate-y-3 opacity-0'
                : 'translate-y-0 opacity-100'
            }`}
          >
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Spec Peek view */}
          <div
            className={`absolute inset-0 flex flex-col justify-center rounded-lg bg-surface-alt p-2 text-xs transition-all duration-300 ease-out ${
              activeState
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-3 opacity-0'
            }`}
            aria-label="Key specifications preview"
          >
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              <Layers className="size-3" aria-hidden="true" />
              <span>Key Specifications</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
              {specEntries.map(([k, v]) => (
                <div key={k} className="truncate">
                  <span className="font-medium text-muted-foreground">{k}: </span>
                  <span className="font-bold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-col gap-2 pt-2 sm:flex-row">
          <Link
            href={`/products/${product.id}`}
            className="group/btn inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg btn-secondary text-xs font-semibold"
          >
            Details
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg btn-primary text-xs font-semibold"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add to Quote
          </button>
        </div>
      </div>
      </TiltCard>
    </div>
  )
}
