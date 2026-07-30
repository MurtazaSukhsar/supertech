'use client'

import { ShieldCheck, Handshake, Truck, BadgeCheck } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TiltCard } from '@/components/tilt-card'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    description:
      'Every product is sourced from certified manufacturers and inspected before it reaches your site.',
  },
  {
    icon: Handshake,
    title: 'Reliable Service',
    description:
      'A dedicated account team that understands your project timelines and never leaves you waiting.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description:
      'Same-day and next-day delivery across Kuwait, with bulk logistics handled end to end.',
  },
  {
    icon: BadgeCheck,
    title: 'Trusted by Professionals',
    description:
      'Contractors, MEP firms, and facility managers across Kuwait rely on Super Tech every day.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">Our Promise</p>
          <h2 className="section-heading">Why Choose Super Tech</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {reasons.map((reason, i) => (
          <ScrollReveal key={reason.title} delay={i * 100} variant="rotate-in-3d" className="h-full">
            <TiltCard className="group flex h-full flex-col items-start gap-5 p-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary transition-all duration-300 group-hover:bg-primary/80 group-hover:shadow-lg group-hover:shadow-primary/25">
                <reason.icon className="size-7 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">{reason.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
