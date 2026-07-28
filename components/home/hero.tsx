'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Building2, Truck, Wrench } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary py-20 md:py-28 lg:py-32">
      {/* Full-Bleed Jobsite & Warehouse Background Image */}
      <Image
        src="/images/hero-warehouse.png"
        alt="HVAC materials supplier warehouse in Kuwait"
        fill
        priority
        sizes="100vw"
        className="ken-burns object-cover opacity-30 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/70" aria-hidden="true" />
      <div className="absolute inset-0 surface-grid opacity-[0.04]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12 z-10">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-md">
            <span className="relative flex size-2 rounded-full bg-accent" aria-hidden="true">
              <span className="soft-pulse absolute inset-0 rounded-full bg-accent" />
            </span>
            <span>Kuwait&apos;s Premier MEP &amp; HVAC Material Supplier</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Suppliers of All Air-Conditioning Materials, Hardware &amp; Tools
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/80 md:text-xl">
            From copper pipes, insulation rolls, and flexible duct connectors to industrial power tools, unistrut channels, and plumbing valves. Certified quality and competitive wholesale rates across Kuwait.
          </p>

          {/* Trust Feature Badges */}
          <div className="mt-8 flex flex-wrap gap-4 text-xs font-bold text-white/90">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <CheckCircle2 className="size-4 text-accent" />
              <span>Ready Warehouse Stock</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <ShieldCheck className="size-4 text-accent" />
              <span>100% Certified Originals</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <Truck className="size-4 text-accent" />
              <span>Fast Kuwait Delivery</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex h-14 items-center gap-3 rounded-xl btn-primary px-9 text-sm font-bold uppercase tracking-wider shadow-2xl transition-transform hover:scale-105"
            >
              <span>Explore All Products</span>
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-xl border border-white/30 bg-white/10 px-9 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-primary"
            >
              Request Bulk RFQ Quote
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
