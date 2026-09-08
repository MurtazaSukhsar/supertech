'use client'

import { MessageCircle, BadgeCheck, Truck } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TiltCard } from '@/components/tilt-card'
import { useI18n } from '@/components/i18n-provider'

/**
 * ASHRAE (American Society of Heating, Refrigerating and Air-Conditioning
 * Engineers) publishes the HVAC industry's reference standards -- cited here
 * as the authoritative source behind the plain-language "what is an AC
 * material" definition below, not as a claim about this shop's own
 * certifications.
 */
const ASHRAE_URL = 'https://www.ashrae.org/'

/**
 * Short, plain-language "at a glance" summary rendered right after the
 * hero: what the business is, what it sells, and who it's for, in the
 * first couple of sentences a reader (or an AI assistant skimming the
 * page) reaches -- plus a compact "how to order" checklist, which gives
 * both audiences a structured answer instead of only marketing copy.
 */
export function Overview() {
  const { t } = useI18n()

  const steps = [
    { icon: MessageCircle, title: t.home.overviewStep1Title, description: t.home.overviewStep1Desc },
    { icon: BadgeCheck, title: t.home.overviewStep2Title, description: t.home.overviewStep2Desc },
    { icon: Truck, title: t.home.overviewStep3Title, description: t.home.overviewStep3Desc },
  ]

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="max-w-3xl">
          <p className="eyebrow">{t.home.overviewEyebrow}</p>
          <h2 className="section-heading mt-3">{t.home.overviewTitle}</h2>
          <p className="section-subheading mt-4">{t.home.overviewSummary}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.home.overviewStandardsIntro}{' '}
            <a
              href={ASHRAE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline underline-offset-2 hover:text-primary"
            >
              {t.home.overviewStandardsLinkText}
            </a>
            .
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" delay={80}>
        <p className="eyebrow mt-10">{t.home.overviewStepsTitle}</p>
      </ScrollReveal>

      <div className="mt-5 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <ScrollReveal key={step.title} delay={80 + i * 100} variant="fade-up" className="h-full">
            <TiltCard className="group flex h-full flex-col items-start gap-4 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/10">
                <step.icon className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
                <span className="me-2 text-accent">{i + 1}.</span>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
