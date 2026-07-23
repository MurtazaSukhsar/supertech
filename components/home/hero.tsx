'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ParallaxLayer } from '@/components/parallax-layer'



export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <Image
        src="/images/hero-warehouse.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="ken-burns object-cover opacity-15 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30" aria-hidden="true" />
      <div className="absolute inset-0 surface-grid opacity-[0.04]" aria-hidden="true" />

      {/* Parallax Blueprint Shapes (Right side background) */}
      <div className="absolute right-0 top-0 bottom-0 z-0 hidden w-1/2 overflow-hidden lg:block select-none pointer-events-none opacity-20" aria-hidden="true">
        <ParallaxLayer speed={0.15} className="absolute right-10 top-24">
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1">
            <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="40" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
          </svg>
        </ParallaxLayer>
        <ParallaxLayer speed={0.28} className="absolute right-36 top-96">
          <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="#D91E2A" strokeWidth="1.5" strokeOpacity="0.45">
            <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
            <circle cx="50" cy="50" r="20" />
          </svg>
        </ParallaxLayer>
      </div>

      <div className="absolute -bottom-24 left-0 h-40 w-full bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col items-start justify-center px-6 py-24 md:min-h-[780px] md:px-8 lg:px-12 z-10">
        <p className="reveal-up mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/8 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-sm">
          <span className="relative flex size-2 rounded-full bg-accent" aria-hidden="true">
            <span className="soft-pulse absolute inset-0 rounded-full bg-accent" />
          </span>
          Kuwait&apos;s Trusted  Supplier
        </p>
        <h1
          className="reveal-up max-w-3xl text-balance text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-primary-foreground md:text-6xl lg:text-7xl"
          style={{ animationDelay: '90ms' }}
        >
          Suppliers of All Air-Conditioning Materials, Hardware &amp; Tools
        </h1>
        <p
          className="reveal-up mt-6 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/75 md:text-lg md:leading-relaxed"
          style={{ animationDelay: '180ms' }}
        >
          From copper pipes to industrial equipment, premium materials, competitive bulk pricing, and fast delivery
          across Kuwait for contractors and businesses.
        </p>
        <div className="reveal-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: '270ms' }}>
          <Link
            href="/categories/air-conditioning"
            className="inline-flex h-13 items-center rounded-lg btn-primary px-8 text-sm"
          >
            Browse Products
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-13 items-center rounded-lg border border-primary-foreground/30 bg-primary-foreground/5 px-8 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-all duration-280 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary hover:shadow-lg"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
