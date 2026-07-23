'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/products'
import { CategoryIcon } from '@/components/category-icon'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TiltCard } from '@/components/tilt-card'

function CardMedia({ cat }: { cat: (typeof categories)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (cat.slug !== 'tools') return
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay might be blocked by the browser, ignore
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [cat.slug])

  if (cat.slug === 'tools') {
    return (
      <video
        ref={videoRef}
        src="/videos/hand-power-tools.mp4"
        poster={cat.image || '/placeholder.svg'}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        aria-label={cat.name}
      />
    )
  }

  return (
    <Image
      src={cat.image || '/placeholder.svg'}
      alt={cat.name}
      fill
      sizes="(max-width: 1024px) 100vw, 33vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  )
}

export function CategoryGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section className="section-pad mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 flex flex-col items-start gap-3">
          <p className="eyebrow">Our Range</p>
          <h2 className="section-heading">Product Categories</h2>
          <p className="section-subheading">
            Five specialist divisions covering everything your project needs, all under one roof.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const isSiblingHovered = hoveredIdx !== null && hoveredIdx !== i

          return (
            <ScrollReveal
              key={cat.slug}
              delay={i * 80}
              variant="scale-up"
              className={`h-full transition-all duration-300 ${
                i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''
              } ${isSiblingHovered ? 'scale-[0.97] opacity-60 blur-[0.3px]' : ''}`}
            >
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="h-full"
              >
                <TiltCard className="group h-full border border-border overflow-hidden">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="relative flex h-full flex-col overflow-hidden"
                  >
                    <div
                      className={`relative w-full overflow-hidden bg-secondary ${
                        i === 0
                          ? 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[440px]'
                          : 'aspect-[16/9] h-full min-h-[220px]'
                      }`}
                    >
                      <CardMedia cat={cat} />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent transition-opacity duration-300 group-hover:opacity-95"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                        <div>
                          <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                            <CategoryIcon icon={cat.icon} className="size-5 text-white" />
                          </div>
                          <h3 className="text-sm md:text-[15px] font-black uppercase tracking-tight text-white leading-tight">
                            {cat.name}
                          </h3>
                        </div>
                        <ArrowRight className="mb-0.5 size-5 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
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
