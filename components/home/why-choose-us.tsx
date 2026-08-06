'use client'

import { ShieldCheck, Handshake, Truck, BadgeCheck } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TiltCard } from '@/components/tilt-card'
import { useI18n } from '@/components/i18n-provider'

export function WhyChooseUs() {
  const { t } = useI18n()

  const reasons = [
    { icon: ShieldCheck, title: t.home.whyPremiumTitle, description: t.home.whyPremiumDesc },
    { icon: Handshake, title: t.home.whyReliableTitle, description: t.home.whyReliableDesc },
    { icon: Truck, title: t.home.whyFastTitle, description: t.home.whyFastDesc },
    { icon: BadgeCheck, title: t.home.whyTrustedTitle, description: t.home.whyTrustedDesc },
  ]

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">{t.home.whyEyebrow}</p>
          <h2 className="section-heading">{t.home.whyTitle}</h2>
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
