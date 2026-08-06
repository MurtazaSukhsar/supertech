'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { getCategoryColor } from '@/lib/products'
import { getFeaturedProductsLocalized } from '@/lib/catalog'
import { useI18n } from '@/components/i18n-provider'
import { StackRevealCard } from '@/components/home/stack-reveal-card'

const FEATURED_EN = getFeaturedProductsLocalized('en').slice(0, 6)
const FEATURED_AR = getFeaturedProductsLocalized('ar').slice(0, 6)
const SEGMENTS = FEATURED_EN.length - 1

// Each card holds on top for this share of its segment, then slides away.
// The source design used 0.62 for a timed video; scrolling feels better with
// a shorter hold, otherwise the deck sits still for most of the section.
const PAUSE = 0.45

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function FeaturedProducts() {
  const { t, locale, href } = useI18n()
  const FEATURED = locale === 'ar' ? FEATURED_AR : FEATURED_EN
  const container = useRef<HTMLDivElement>(null)
  const [flyDistance, setFlyDistance] = useState(1100)

  useEffect(() => {
    const measure = () => setFlyDistance(window.innerWidth < 768 ? window.innerWidth * 1.1 : 1100)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  // Convert raw scroll into deck position, with a hold before each card slides off
  const advance = useTransform(scrollYProgress, (p) => {
    const raw = clamp(p, 0, 1) * SEGMENTS
    const seg = Math.min(SEGMENTS - 1, Math.floor(raw))
    const segT = raw - seg
    const slide = clamp((segT - PAUSE) / (1 - PAUSE), 0, 1)
    return seg + slide
  })

  const headerY = useTransform(scrollYProgress, [0, 0.08], [26, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])

  return (
    // Tall track gives each card its own slice of scroll (~55vh per card)
    <section ref={container} className="relative h-[500vh] bg-surface-alt">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-5 overflow-hidden px-4 py-10 sm:gap-7 sm:py-14">
        {/* Heading */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex shrink-0 flex-col items-center text-center"
        >
          <p className="eyebrow">{t.home.featuredEyebrow}</p>
          <h2 className="mt-2.5 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[42px]">
            {t.home.featuredTitle}
          </h2>
        </motion.div>

        {/* The deck — top card slides off to reveal the next */}
        <div className="relative min-h-0 w-full max-w-[540px] flex-1">
          {FEATURED.map((product, i) => (
            <StackRevealCard
              key={product.id}
              index={i}
              product={product}
              advance={advance}
              flyDistance={flyDistance}
              priority={i < 2}
            />
          ))}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-5">
          {/* Progress dots, one per product */}
          <div className="flex items-center justify-center gap-3.5">
            {FEATURED.map((product, i) => (
              <Dot key={product.id} index={i} advance={advance} hex={getCategoryColor(product.category).hex} />
            ))}
          </div>

          <Link
            href={href('/products')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t.home.featuredCta}
            <ArrowRight className="rtl-flip size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Dot({ index, advance, hex }: { index: number; advance: MotionValue<number>; hex: string }) {
  const opacity = useTransform(advance, (adv) => (index <= adv + 0.5 ? 1 : 0.25))
  const scale = useTransform(advance, (adv) => (Math.abs(index - adv) < 0.5 ? 1.35 : 1))

  return (
    <motion.span
      style={{ opacity, scale, backgroundColor: hex }}
      className="size-3 rounded-full"
      aria-hidden="true"
    />
  )
}
