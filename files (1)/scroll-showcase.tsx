'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { categories } from '@/lib/products'
import { CategoryIcon } from '@/components/category-icon'

const ScrollShowcase3d = dynamic(() => import('./scroll-showcase-3d'), { ssr: false })

export function ScrollShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      // Progress across the section's own scroll span: 0 when section enters, 1 when it leaves
      const total = rect.height + vh
      const traveled = vh - rect.top
      const progress = Math.min(1, Math.max(0, traveled / total))

      progressRef.current = progress
      setActiveIdx(Math.min(categories.length - 1, Math.floor(progress * categories.length)))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary"
      style={{ minHeight: '140vh' }}
      aria-label="Five specialist divisions"
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 surface-grid opacity-[0.05]" aria-hidden="true" />
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

        {/* 3D canvas, positioned right on desktop */}
        <div className="pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[60%] md:block">
          <ScrollShowcase3d progressRef={progressRef} />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <p className="eyebrow !text-accent">Our Range</p>
          <h2 className="mt-3 max-w-xl section-heading !text-primary-foreground">
            Five Divisions.
            <br />
            One Supplier.
          </h2>
          <p className="section-subheading mt-4 !text-primary-foreground/70">
            Every product category your project needs, sourced, stocked, and delivered from a single account team.
          </p>

          <div className="mt-10 flex flex-col gap-1 md:max-w-sm">
            {categories.map((cat, i) => (
              <div
                key={cat.slug}
                className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-500 ${
                  activeIdx === i
                    ? 'bg-primary-foreground/10 opacity-100'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 ${
                    activeIdx === i ? 'bg-accent' : 'bg-primary-foreground/10'
                  }`}
                >
                  <CategoryIcon icon={cat.icon} className="size-5 text-white" />
                </div>
                <span className="text-sm font-bold uppercase tracking-tight text-primary-foreground">
                  {cat.shortName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
