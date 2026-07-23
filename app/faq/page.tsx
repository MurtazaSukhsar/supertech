import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { FaqAccordion } from '@/components/faq-accordion'
import { ScrollReveal } from '@/components/scroll-reveal'
import { faqs, siteUrl } from '@/lib/content'
import { contactInfo } from '@/lib/products'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Super Tech Kuwait, product supply, bulk quotes, air-conditioning materials, hardware, tools, delivery, and project orders.',
  alternates: {
    canonical: '/faq',
  },
}

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">FAQ</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Questions Contractors Ask Before Ordering
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            Clear answers about bulk supply, product categories, quotes, and delivery across Kuwait.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: 'FAQ' }]} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <FaqAccordion faqs={faqs} />

          <ScrollReveal delay={200}>
            <aside className="h-fit rounded-2xl border border-border bg-secondary p-8">
              <p className="eyebrow">Still Need Help?</p>
              <h2 className="mt-4 text-2xl font-800 uppercase tracking-tight text-foreground">
                Send Your Material List
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Share quantities, product specs, and location. We will help you confirm availability and pricing.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg btn-primary text-sm"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp Us
                </a>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-lg btn-secondary text-sm"
                >
                  Request a Quote
                </Link>
              </div>
              <p className="mt-7 text-xs text-muted-foreground">{siteUrl.replace('https://', '')}</p>
            </aside>
          </ScrollReveal>
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
