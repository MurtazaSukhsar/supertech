'use client'

import { Quote } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useI18n } from '@/components/i18n-provider'

export function Testimonials() {
  const { t } = useI18n()

  const testimonials = [
    {
      quote: t.home.testimonial1,
      name: t.home.testimonial1Name,
      role: t.home.testimonial1Role,
      company: t.home.testimonial1Company,
    },
    {
      quote: t.home.testimonial2,
      name: t.home.testimonial2Name,
      role: t.home.testimonial2Role,
      company: t.home.testimonial2Company,
    },
    {
      quote: t.home.testimonial3,
      name: t.home.testimonial3Name,
      role: t.home.testimonial3Role,
      company: t.home.testimonial3Company,
    },
  ]

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 text-center">
          <p className="eyebrow">{t.home.testimonialsEyebrow}</p>
          <h2 className="section-heading mt-3">{t.home.testimonialsTitle}</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 120} variant="rotate-in-3d" className="h-full">
            <blockquote className="card-premium flex h-full flex-col p-8">
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <Quote className="size-5 text-accent" aria-hidden="true" />
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.role}, {t.company}
                </p>
              </div>
            </blockquote>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
