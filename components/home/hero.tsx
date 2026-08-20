'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Image } from '@/components/site-image'
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react'

import { useI18n } from '@/components/i18n-provider'
import { siteImages } from '@/lib/products'

// Render the animated carousel (and its images) client-only to avoid
// server/client srcSet hydration mismatches from the animated layout.
const HeroProductCarousel = dynamic(
  () => import('@/components/home/hero-product-carousel').then((m) => m.HeroProductCarousel),
  { ssr: false },
)

export function Hero() {
  const { t, href, isRtl } = useI18n()

  return (
    <section className="relative isolate overflow-hidden bg-primary py-16 sm:py-20 md:py-28 lg:py-32">
      {/* Full-Bleed Jobsite & Warehouse Background Image */}
      {/*
        cldWidth was 1920. Because `images.unoptimized` is on, Next emits no
        srcSet — so that single width was the one every device downloaded,
        including a 360px-wide phone, and on mobile this full-bleed image is
        usually the LCP element. Dropping to 1280 cuts a large chunk of the
        bytes on the critical path.

        There is no visible cost: this image renders at `opacity-30` with
        `mix-blend-overlay` underneath a near-opaque brand gradient, so it is
        heavily obscured decoration rather than detail anyone reads.
      */}
      <Image
        src={siteImages.heroBackground}
        alt={t.home.heroImageAlt}
        fill
        priority
        sizes="100vw"
        cldWidth={1280}
        className="ken-burns object-cover opacity-30 mix-blend-overlay"
        suppressHydrationWarning
      />
      <div className={`absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/70 ${isRtl ? 'bg-gradient-to-l' : ''}`}
        aria-hidden="true" />
      <div className="absolute inset-0 surface-grid opacity-[0.04]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)] lg:gap-10">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-md">
            <span className="relative flex size-2 rounded-full bg-accent" aria-hidden="true">
              <span className="soft-pulse absolute inset-0 rounded-full bg-accent" />
            </span>
            <span>{t.home.heroBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-balance text-3xl font-black uppercase leading-[1.05] tracking-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            {t.home.heroTitle}
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/80 md:text-xl">
            {t.home.heroSubtitle}
          </p>

          {/* Trust Feature Badges */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 text-xs font-bold text-white/90">
            <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md">
              <ShieldCheck className="size-4 text-accent shrink-0" />
              <span>{t.home.heroBadgeCertified}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md">
              <Truck className="size-4 text-accent shrink-0" />
              <span>{t.home.heroBadgeDelivery}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href={href('/products')}
              className="inline-flex h-12 sm:h-14 items-center justify-center gap-2 sm:gap-3 rounded-xl btn-primary px-6 sm:px-9 text-sm font-bold uppercase tracking-wider shadow-2xl transition-transform hover:scale-105"
            >
              <span>{t.home.heroCtaProducts}</span>
              <ArrowRight className="rtl-flip size-4 sm:size-5 shrink-0" />
            </Link>
            <Link
              href={href('/contact')}
              className="inline-flex h-12 sm:h-14 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 sm:px-9 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-primary"
            >
              {t.home.heroCtaQuote}
            </Link>
          </div>

        </div>

          {/* Rotate-to-reveal product carousel. Shown on every size; on small
              screens it sits above the copy so it isn't buried below the CTAs.

              The inner wrapper reserves the carousel's exact box on the server.
              HeroProductCarousel is `ssr: false`, so the server emits nothing
              for it — and because it sits `order-first` on mobile, it used to
              drop a ~420px-tall element in ABOVE the headline once hydration
              finished, shoving the entire hero down the page. That is a large
              Cumulative Layout Shift on exactly the viewport Lighthouse scores
              hardest. These classes mirror the carousel's own root element
              (aspect + max-width at every breakpoint), so the space is already
              held before the client component ever mounts and nothing moves. */}
          <div className="order-first w-full lg:order-none">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] sm:aspect-square sm:max-w-[500px] lg:ms-auto lg:me-0 lg:max-w-[760px]">
              <HeroProductCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
