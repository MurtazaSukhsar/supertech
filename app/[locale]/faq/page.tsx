import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { FaqAccordion } from '@/components/faq-accordion'
import { ScrollReveal } from '@/components/scroll-reveal'
import { siteUrl } from '@/lib/content'
import { getFaqs } from '@/lib/content-i18n'
import { contactInfo } from '@/lib/products'
import { getDictionary } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    title: t.faq.metaTitle,
    description: t.faq.metaDescription,
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { en: '/en/faq', ar: '/ar/faq', 'x-default': '/en/faq' },
    },
  }
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getDictionary(locale)
  const faqs = getFaqs(locale as Locale)
  const href = (path: string) => localePath(locale as Locale, path)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">{t.faq.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t.faq.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            {t.faq.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: t.faq.breadcrumb }]} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <FaqAccordion faqs={faqs} />

          <ScrollReveal delay={200}>
            <aside className="h-fit rounded-2xl border border-border bg-secondary p-8">
              <p className="eyebrow">{t.faq.sideEyebrow}</p>
              <h2 className="mt-4 text-2xl font-800 uppercase tracking-tight text-foreground">
                {t.faq.sideTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.faq.sideDesc}</p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg btn-primary text-sm"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {t.common.whatsappUs}
                </a>
                <Link
                  href={href('/contact')}
                  className="inline-flex h-12 items-center justify-center rounded-lg btn-secondary text-sm"
                >
                  {t.common.requestQuote}
                </Link>
              </div>
              <p className="ltr-embed mt-7 text-xs text-muted-foreground">
                {siteUrl.replace('https://', '')}
              </p>
            </aside>
          </ScrollReveal>
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
