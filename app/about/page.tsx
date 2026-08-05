import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Boxes, Globe2, Truck } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { AnimatedCounter } from '@/components/animated-counter'
import { ScrollReveal } from '@/components/scroll-reveal'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Super Tech International Construction Materials Co., a Kuwait-based supplier of air-conditioning materials, hardware, tools, and construction materials.',
}

const stats = [
  { icon: Boxes, value: 5000, suffix: '+', label: 'Products in Stock' },
  { icon: BadgeCheck, value: 500, suffix: '+', label: 'Business Clients' },
  { icon: Truck, value: 24, suffix: 'h', label: 'Delivery Across Kuwait' },
  { icon: Globe2, value: 30, suffix: '+', label: 'Global Brand Partners' },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">Who We Are</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Built to Supply Kuwait&apos;s Builders
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: 'About Us' }]} />

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/about-facility.webp"
                alt="Super Tech warehouse and showroom facility in Kuwait"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div>
              <h2 className="text-balance text-2xl font-extrabold uppercase tracking-tight text-foreground md:text-3xl">
                A Trusted Supply Partner Since Day One
              </h2>
              <div className="mt-6 flex flex-col gap-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed max-w-prose">
                <p>
                  Super Tech International Construction Materials Co. is a Kuwait-based supplier serving contractors,
                  MEP companies, facility managers, and industrial operations across the country. We specialize in
                  air-conditioning materials, hardware supplies, hand and power tools, construction materials, and
                  industrial equipment.
                </p>
                <p>
                  Our approach is simple: stock genuine products from certified manufacturers, price them competitively
                  for bulk buyers, and deliver them fast. From a single coil of copper pipe to full-project material
                  packages, we handle orders of every scale with the same attention to detail.
                </p>
                <p>
                  With deep relationships across global brands and a logistics network covering all of Kuwait, Super
                  Tech is the supply partner professionals rely on to keep their projects moving.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex h-13 items-center rounded-lg btn-primary px-8 text-sm"
              >
                Work With Us
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 md:mt-32 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} className="h-full">
              <div className="card-premium flex h-full flex-col items-center justify-center gap-3 p-4 sm:p-8 text-center md:p-10">
                <stat.icon className="size-7 text-accent" aria-hidden="true" />
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-primary md:text-4xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
                </p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
