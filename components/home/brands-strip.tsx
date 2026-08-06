'use client'

import { useEffect, useState } from 'react'

const brands = [
  'Mueller',
  'Bosch',
  'Makita',
  'Honeywell',
  'Hilti',
  'Dorma',
  'Stanley',
  'Lincoln Electric',
  'Ingersoll Rand',
  'KCC',
  'Armaflex',
  'Unistrut',
]

export function BrandsStrip() {
  const doubled = [...brands, ...brands]
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-primary/98 py-10 md:py-14" aria-label="Trusted brands">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <p className="eyebrow mb-8 text-center !text-primary-foreground/40">
          Trusted Brands We Carry
        </p>
      </div>

      {/* 3D Curved Perspective Container */}
      <div 
        className="relative w-full overflow-hidden py-4"
        style={reducedMotion ? undefined : { perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Soft Left & Right Ambient Shadows */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-primary via-primary/60 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-primary via-primary/60 to-transparent" aria-hidden="true" />

        {/* Marquee Track wrapped in a subtle cylindrical tilt path */}
        <div 
          className="marquee-track flex gap-6"
          style={reducedMotion ? undefined : { transform: 'rotateX(8deg)', transformStyle: 'preserve-3d' }}
        >
          {doubled.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 px-6 py-3 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-primary-foreground/10 hover:-translate-y-1 hover:text-white"
              style={reducedMotion ? undefined : { transform: 'translateZ(10px)' }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
