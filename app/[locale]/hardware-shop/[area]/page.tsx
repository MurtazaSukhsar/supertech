import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, MapPin, Phone, Truck } from 'lucide-react'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { CategoryIcon } from '@/components/category-icon'
import { ScrollReveal } from '@/components/scroll-reveal'
import { siteUrl } from '@/lib/content'
import { categories, contactInfo } from '@/lib/products'
import { getDictionary } from '@/lib/i18n'
import { localePath, locales, type Locale } from '@/lib/i18n/config'
import { areas, getArea } from '@/lib/seo/locations'
import { geo } from '@/lib/seo/business'
import { breadcrumbSchema, localBusinessId, schemaGraph } from '@/lib/seo/schema'
import { primeSiteDataSafely } from '@/lib/server/site-data'
import { siteImages } from '@/lib/products'

export function generateStaticParams() {
  return locales.flatMap((locale) => areas.map((area) => ({ locale, area: area.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; area: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale, area: slug } = await params
  const t = getDictionary(locale)
  const area = getArea(slug)
  if (!area) return {}

  const content = area.content[locale as Locale] ?? area.content.en
  const title = `${t.locations.titlePrefix} ${content.name}`
  const path = `/hardware-shop/${area.slug}`

  return {
    title,
    description: content.metaDescription,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        ar: `/ar${path}`,
        'x-default': `/en${path}`,
      },
    },
    openGraph: {
      title,
      description: content.metaDescription,
      images: [siteImages.heroBackground],
    },
  }
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ locale: string; area: string }>
}) {
  await primeSiteDataSafely()
  const { locale: rawLocale, area: slug } = await params
  const locale = rawLocale as Locale
  const t = getDictionary(rawLocale)
  const area = getArea(slug)
  if (!area) notFound()

  const content = area.content[locale] ?? area.content.en
  const href = (path: string) => localePath(locale, path)
  const others = areas.filter((a) => a.slug !== area.slug)

  /**
   * The page references the one LocalBusiness node by @id instead of
   * redeclaring the shop. Declaring a separate business per area page would
   * read as location spam; a Service node pointing at the single provider
   * is the pattern Google expects for a one-branch business.
   */
  const areaSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${t.locations.titlePrefix} ${content.name}`,
    description: content.metaDescription,
    serviceType: t.meta.siteName,
    provider: { '@id': localBusinessId },
    areaServed: {
      '@type': 'City',
      name: content.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: area.governorate[locale] ?? area.governorate.en,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    },
    url: `${siteUrl}/${locale}/hardware-shop/${area.slug}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.locations.categoriesTitle,
      itemListElement: categories.map((category, index) => ({
        '@type': 'OfferCatalog',
        position: index + 1,
        name: category.name,
        url: `${siteUrl}/${locale}/categories/${category.slug}`,
      })),
    },
  }

  const crumbs = breadcrumbSchema(locale, t, [
    { name: t.locations.breadcrumb, path: '/hardware-shop' },
    { name: content.name, path: `/hardware-shop/${area.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaGraph([areaSchema, crumbs]) }}
      />

      {/* Hero — the H1 carries the exact query users type. */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">{t.locations.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t.locations.titlePrefix} {content.name}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base">
            {content.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-semibold text-primary-foreground">
              <Truck className="size-4 text-accent" aria-hidden="true" />
              {area.distanceKm === 0
                ? content.name
                : `${t.locations.approx} ${area.distanceKm} ${t.locations.km} ${t.locations.distanceLabel}`}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-semibold text-primary-foreground">
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {area.governorate[locale] ?? area.governorate.en} {t.locations.governorateLabel}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs
          crumbs={[
            { label: t.locations.breadcrumb, href: '/hardware-shop' },
            { label: content.name },
          ]}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <div className="space-y-12">
            <ScrollReveal>
              <section>
                <h2 className="section-heading">{t.locations.whatWeSupply}</h2>
                <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                  {content.demand}
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <section>
                <h2 className="section-heading">{t.locations.deliveryTitle}</h2>
                <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                  {content.delivery}
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <section>
                <h2 className="section-heading">{t.locations.highlightsTitle}</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {content.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <Truck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-sm font-medium leading-snug text-foreground">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={220}>
              <section>
                <h2 className="section-heading">{t.locations.categoriesTitle}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.locations.categoriesSubtitle}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={href(`/categories/${category.slug}`)}
                      className="card-premium group flex items-center gap-3 p-4"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <CategoryIcon icon={category.icon} className="size-5 text-accent" />
                      </span>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* Sidebar — NAP block repeated so the address is crawlable on every area page. */}
          <ScrollReveal delay={120} variant="fade-right">
            <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm lg:sticky lg:top-28">
              <div>
                <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">
                  {t.locations.ctaTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.locations.ctaSubtitle}
                </p>
              </div>

              <div className="space-y-4 border-t border-border pt-6 text-sm">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-muted-foreground">{contactInfo.address}</span>
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <a
                    href={contactInfo.phoneHref}
                    className="font-semibold text-foreground hover:text-accent"
                  >
                    {contactInfo.phone}
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    Sat–Thu 8:00–13:00, 16:00–20:00
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={href('/contact')} className="btn-primary w-full justify-center">
                  {t.common.requestQuote}
                </Link>
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full justify-center"
                >
                  {t.common.whatsappUs}
                </a>
                <a
                  href={contactInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-sm font-semibold text-accent hover:underline"
                >
                  {t.locations.visitShop}
                </a>
              </div>
            </aside>
          </ScrollReveal>
        </div>

        {/* Internal links between area pages spread crawl equity across the set. */}
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="section-heading">{t.locations.otherAreas}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={href(`/hardware-shop/${other.slug}`)}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {(other.content[locale] ?? other.content.en).name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
