'use client'

import { Image } from '@/components/site-image'
import Link from 'next/link'
import { getProducts } from '@/lib/catalog'
import { useI18n } from '@/components/i18n-provider'

export function CategorySlideshow() {
  const { locale, href } = useI18n()
  const activeProducts = getProducts(locale)
  
  // Clean product showcase images from across all categories
  const showcaseProducts = activeProducts.map(p => ({
    name: p.name,
    image: p.images[0] || '/placeholder.svg',
    href: href(`/products/${p.id}`)
  })).slice(0, 25) // limit to 25 to avoid overwhelming the DOM

  // Duplicate array for seamless infinite marquee loop
  const slides = [...showcaseProducts, ...showcaseProducts]

  return (
    <section className="relative overflow-hidden bg-primary py-8 transition-colors duration-300">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)]" />

      {/* Infinite marquee slider */}
      <div className="flex w-max animate-marquee space-x-6 hover:[animation-play-state:paused]">
        {slides.map((prod, idx) => (
          <Link
            key={`${prod.href}-${idx}`}
            href={prod.href}
            className="group relative flex h-48 w-56 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-2xl"
          >
            <div className="relative h-full w-full">
              <Image
                src={prod.image}
                alt={prod.name}
                fill
                sizes="224px"
                cldWidth={256}
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
