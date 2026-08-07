import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getDictionary } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/i18n/config'
import { areas } from '@/lib/seo/locations'
import { breadcrumbSchema, schemaGraph } from '@/lib/seo/schema'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    title: t.locations.indexMetaTitle,
    description: t.locations.indexMetaDescription,
    alternates: {
      canonical: `/${locale}/hardware-shop`,
      languages: {
        en: '/en/hardware-shop',
        ar: '/ar/hardware-shop',
        'x-default': '/en/hardware-shop',
      },
    },
  }
}

export default async function LocationsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const t = getDictionary(rawLocale)
  const href = (path: string) => localePath(locale, path)

  const crumbs = breadcrumbSchema(locale, t, [
    { name: t.locations.breadcrumb, path: '/hardware-shop' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaGraph([crumbs]) }}
      />

      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">{t.locations.indexEyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t.locations.indexTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base">
            {t.locations.indexSubtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: t.locations.breadcrumb }]} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => {
            const content = area.content[locale] ?? area.content.en
            return (
              <ScrollReveal key={area.slug} delay={i * 60}>
                <Link
                  href={href(`/hardware-shop/${area.slug}`)}
                  className="card-premium group flex h-full flex-col p-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10">
                    <MapPin className="size-5 text-accent" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-lg font-extrabold uppercase tracking-tight text-foreground group-hover:text-primary">
                    {t.locations.titlePrefix} {content.name}
                  </h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {area.distanceKm === 0
                      ? content.name
                      : `${t.locations.approx} ${area.distanceKm} ${t.locations.km} ${t.locations.distanceLabel}`}
                  </p>
                  <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {content.metaDescription}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    {t.common.viewAll}
                    <ArrowRight
                      className="rtl-flip size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
