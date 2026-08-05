'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, type MotionValue, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { getCategory, getCategoryColor, type Product } from '@/lib/products'

interface StackRevealCardProps {
  /** This card's index in the deck (0 = front) */
  index: number
  product: Product
  /** Deck advance position: 0 → front card on top, n-1 → last card on top */
  advance: MotionValue<number>
  /** How far the top card travels as it flies off, in px */
  flyDistance: number
  /** Priority-load the first couple of images */
  priority?: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const easeInCubic = (t: number) => t * t * t

export function StackRevealCard({ index, product, advance, flyDistance, priority }: StackRevealCardProps) {
  const category = getCategory(product.category)
  const color = getCategoryColor(product.category)

  // d > 0  → sitting back in the stack, offset by depth
  // d <= 0 → this card is on top and sliding away
  const transform = useTransform(advance, (adv) => {
    const d = index - adv

    if (d <= 0) {
      const p = clamp(-d, 0, 1)
      const e = easeInCubic(p)
      return `translate(${e * flyDistance}px, ${-e * 60 - p * 10}px) rotate(${e * 20}deg)`
    }

    return `translate(${d * 15}px, ${d * 17}px) rotate(${-d * 2.4}deg) scale(${1 - d * 0.032})`
  })

  const opacity = useTransform(advance, (adv) => {
    const d = index - adv

    if (d <= 0) {
      const p = clamp(-d, 0, 1)
      const fadeStart = 0.65
      return p <= fadeStart ? 1 : Math.max(0, 1 - (p - fadeStart) / (1 - fadeStart))
    }

    return Math.max(0, 1 - d * 0.14)
  })

  return (
    <motion.div
      style={{ transform, opacity, zIndex: 20 - index }}
      className="absolute left-0 top-0 h-full w-full will-change-transform"
    >
      <Link
        href={`/products/${product.id}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-border bg-card"
        style={{ boxShadow: '0 30px 60px -20px rgba(16, 24, 40, 0.28)' }}
        aria-label={`View ${product.name}`}
      >
        {/* Category accent strip */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color.hex }} aria-hidden="true" />

        {/* Large product image */}
        <div className="relative min-h-0 flex-1 bg-white">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, 540px"
            priority={priority}
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute left-5 top-5 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm sm:text-[11px]"
            style={{ backgroundColor: `${color.hex}1F`, color: color.hex }}
          >
            {category?.shortName ?? product.category}
          </span>
        </div>

        {/* Text block */}
        <div className="shrink-0 border-t border-border/70 px-6 py-5 sm:px-8 sm:py-6">
          <div className="line-clamp-2 text-lg font-semibold leading-tight tracking-tight text-card-foreground sm:text-xl md:text-2xl">
            {product.name}
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate text-xs text-muted-foreground sm:text-sm">
              {product.brand ? `${product.brand} · ` : ''}
              {category?.name ?? product.category}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent sm:text-xs">
              View
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
