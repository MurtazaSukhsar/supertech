'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/products'
import { CategoryIcon } from '@/components/category-icon'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TiltCard } from '@/components/tilt-card'

const catImagePool: Record<string, string[]> = {
  'air-conditioning': [
    '/images/products/copper-coil.jpeg',
    '/images/products/copper-pipe.jpeg',
    '/images/products/copper-fitting.jpeg',
    '/images/products/filter-dryer.jpeg',
  ],
  'duct-accessories': [
    '/images/products/insulated-flexible-duct.jpeg',
    '/images/products/aeroduct-flexible-connector.jpeg',
    '/images/products/duct-sealant.jpeg',
    '/images/products/hvac-damper-fittings.jpeg',
  ],
  hardware: [
    '/images/products/galvanized-fasteners.jpeg',
    '/images/products/fischer-drop-in-anchor-box.jpeg',
    '/images/products/brass-flare-nut.jpeg',
    '/images/products/aluminium-rivet.jpeg',
  ],
  clamps: [
    '/images/products/gi-universal-clamp.jpeg',
    '/images/products/rubber-lined-clamp.jpeg',
    '/images/products/gi-u-clamp-saddle.jpeg',
    '/images/products/gi-beam-clamp.jpeg',
  ],
  tools: [
    '/images/products/cordless-drill.png',
    '/images/products/angle-grinder.png',
    '/images/products/wrench-set.png',
  ],
  construction: [
    '/images/products/slotted-channel.jpeg',
    '/images/products/fischer-drop-in-anchor-box.jpeg',
    '/images/products/gi-unistrut-channel-bracket.jpeg',
    '/images/products/pvc-pipe-wrapping-tape.jpeg',
  ],
  industrial: [
    '/images/products/air-compressor.png',
    '/images/products/welding-machine.png',
    '/images/products/spring-mount-isolator.jpeg',
  ],
  plumbing: [
    '/images/products/upvc-fitting.jpeg',
    '/images/products/weldfix-upvc-cement.jpeg',
    '/images/products/brass-gate-valve.jpeg',
    '/images/products/jute-kutkut.jpeg',
  ],
  electric: [
    '/images/products/industrial-socket.jpeg',
    '/images/products/pvc-coated-flexible-conduit.jpeg',
    '/images/products/electric-brass-adaptor.jpeg',
    '/images/products/galvanized-conduit-coupling.jpeg',
  ],
}

function CardMedia({ cat }: { cat: (typeof categories)[number] }) {
  const images = catImagePool[cat.slug] || [cat.image || '/placeholder.svg']
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative h-full w-full">
      {images.map((src, idx) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={src}
            alt={cat.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority={idx === 0}
            className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}

export function CategoryGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 flex flex-col items-start gap-3">
          <p className="eyebrow">Our Range</p>
          <h2 className="section-heading">Product Categories</h2>
          <p className="section-subheading">
            Eight specialist divisions covering everything your project needs, all under one roof.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => {
          const isSiblingHovered = hoveredIdx !== null && hoveredIdx !== i

          return (
            <ScrollReveal
              key={cat.slug}
              delay={i * 60}
              variant="rotate-in-3d"
              className={`h-full transition-all duration-300 ${
                isSiblingHovered ? 'scale-[0.97] opacity-60 blur-[0.3px]' : ''
              }`}
            >
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="h-full"
              >
                <TiltCard className="group h-full overflow-hidden border border-border shadow-md transition-all duration-300 hover:shadow-2xl">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="relative flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                      <CardMedia cat={cat} />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent transition-opacity duration-300 group-hover:opacity-95"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6 md:p-7">
                        <div>
                          <div className="mb-3.5 inline-flex size-11 items-center justify-center rounded-xl bg-accent shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                            <CategoryIcon icon={cat.icon} className="size-6 text-white" />
                          </div>
                          <h3 className="text-base font-black uppercase tracking-tight text-white leading-tight md:text-lg">
                            {cat.name}
                          </h3>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <p className="mt-1.5 line-clamp-1 text-xs font-medium text-white/80">
                              {cat.subcategories.slice(0, 3).join(' • ')}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          className="mb-1 size-6 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
