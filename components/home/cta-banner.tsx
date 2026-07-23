import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { contactInfo } from '@/lib/products'
import { ScrollReveal } from '@/components/scroll-reveal'

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 surface-grid opacity-[0.06]" aria-hidden="true" />
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <ScrollReveal variant="fade-up" duration={700}>
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between md:px-8 md:py-24 lg:px-12">
        <div>
          <h2 className="text-balance text-2xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl">
            Need Bulk Supply? Contact Us Today
          </h2>
          <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base">
            Competitive project pricing, dedicated support, and delivery anywhere in Kuwait.
          </p>
        </div>
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <a
            href={contactInfo.phoneHref}
            className="inline-flex h-13 shrink-0 items-center justify-center gap-2.5 rounded-lg btn-primary px-7 text-sm whitespace-nowrap"
          >
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap font-bold">{contactInfo.phone}</span>
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 shrink-0 items-center justify-center gap-2.5 rounded-lg border border-primary-foreground/30 px-7 text-sm font-semibold text-primary-foreground whitespace-nowrap transition-all duration-280 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary hover:shadow-lg"
          >
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">{contactInfo.email}</span>
          </a>
        </div>
      </div>
      </ScrollReveal>
    </section>
  )
}
