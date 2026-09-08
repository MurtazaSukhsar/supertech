/**
 * JSON-LD builders. Everything Google reads about the shop as a *place* lives
 * here, so the local-business facts stay identical on every page.
 */

import { siteUrl } from '@/lib/content'
import { categories, contactInfo, siteImages } from '@/lib/products'
import type { Dictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import {
  businessTypes,
  closedDays,
  currenciesAccepted,
  geo,
  openingHours,
  paymentAccepted,
  priceRange,
  sameAs,
} from './business'

/**
 * Schema.org requires absolute URLs. Cloudinary URLs already are; a local
 * `/images/...` path (pre-migration, or the seed fallback) still needs the
 * site origin prefixed.
 */
function absoluteImage(path: string): string {
  return path.startsWith('http') ? path : `${siteUrl}${path}`
}


/**
 * A stable @id for the shop. Every other schema block references this node
 * instead of redeclaring the business, which is what lets Google merge the
 * signals from all pages into one entity.
 */
export const localBusinessId = `${siteUrl}/#localbusiness`
export const organizationId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`

function openingHoursSpecification() {
  const open = openingHours.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
    opens: slot.opens,
    closes: slot.closes,
  }))

  const closed = closedDays.map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${day}`,
    opens: '00:00',
    closes: '00:00',
  }))

  return [...open, ...closed]
}

/**
 * The catalogue expressed as an OfferCatalog. This is the strongest on-site
 * signal for *what* the shop sells, which drives the "relevance" half of local
 * ranking (proximity being the other half, which no code can change).
 */
function offerCatalog(t: Dictionary) {
  return {
    '@type': 'OfferCatalog',
    name: t.products.title,
    itemListElement: categories.map((category, index) => ({
      '@type': 'OfferCatalog',
      position: index + 1,
      name: category.name,
      url: `${siteUrl}/en/categories/${category.slug}`,
      description: category.description,
    })),
  }
}

/**
 * The primary LocalBusiness node, typed as a HardwareStore.
 *
 * @param locale     current locale, used for inLanguage and localized copy
 * @param t          dictionary for the current locale
 * @param pageUrl    canonical URL of the page embedding this node
 */
export function localBusinessSchema(locale: Locale, t: Dictionary, pageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': [...businessTypes],
    '@id': localBusinessId,
    name: t.meta.siteName,
    alternateName: ['Super Tech', 'Super Tech Kuwait', 'سوبر تك'],
    legalName: contactInfo.companyName,
    description: t.meta.schemaDescription,
    slogan: t.common.tagline,
    url: pageUrl ?? `${siteUrl}/${locale}`,
    logo: absoluteImage(siteImages.logo),
    image: [
      absoluteImage(siteImages.heroBackground),
      absoluteImage(siteImages.aboutFacility),
      absoluteImage(siteImages.ctaBackground),
    ],
    telephone: contactInfo.phone,
    email: contactInfo.email,
    priceRange,
    currenciesAccepted,
    paymentAccepted: paymentAccepted.join(', '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: t.meta.streetAddress,
      addressLocality: t.meta.addressLocality,
      addressRegion: t.meta.addressLocality,
      addressCountry: 'KW',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    hasMap: contactInfo.googleMapsUrl,
    /**
     * A 40 km radius from Shuwaikh covers the whole of Kuwait, which tells
     * Google the shop legitimately serves searchers outside Shuwaikh.
     */
    areaServed: [
      {
        '@type': 'Country',
        name: t.meta.areaServed,
      },
      ...t.meta.areasServed.map((area) => ({
        '@type': 'City',
        name: area,
      })),
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
      geoRadius: '40000',
    },
    openingHoursSpecification: openingHoursSpecification(),
    sameAs,
    hasOfferCatalog: offerCatalog(t),
    knowsLanguage: ['en', 'ar'],
    inLanguage: locale,
    parentOrganization: { '@id': organizationId },
  }
}

/** Company-level node, separate from the physical shop. */
export function organizationSchema(t: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: contactInfo.companyName,
    alternateName: t.common.companyShort,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteImage(siteImages.logo),
    },
    description: t.meta.schemaDescription,
    sameAs,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contactInfo.phone,
        email: contactInfo.email,
        contactType: 'sales',
        areaServed: 'KW',
        availableLanguage: ['English', 'Arabic'],
      },
    ],
  }
}

/** Enables the sitelinks search box and names the site as an entity. */
export function websiteSchema(locale: Locale, t: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: t.meta.siteName,
    url: siteUrl,
    inLanguage: locale,
    publisher: { '@id': organizationId },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Breadcrumb trail. Google uses this to replace the raw URL in search results
 * with a readable path, which measurably improves click-through.
 */
export function breadcrumbSchema(
  locale: Locale,
  t: Dictionary,
  crumbs: { name: string; path: string }[],
) {
  const items = [{ name: t.common.home, path: '' }, ...crumbs]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}/${locale}${crumb.path}`,
    })),
  }
}

/** Convenience wrapper so pages can emit several nodes in one script tag. */
export function schemaGraph(nodes: object[]) {
  return JSON.stringify(nodes.length === 1 ? nodes[0] : nodes)
}

/**
 * Per-page WebPage node. Anchors on-page "page schema" and "freshness"
 * signals to the shop and organization nodes rather than existing as an
 * orphan entity, and gives on-page SEO scanners the WebPage entity type
 * they look for on top of the site-wide LocalBusiness/Organization/WebSite
 * graph emitted in the locale layout.
 */
export function webPageSchema(
  locale: Locale,
  opts: { url: string; name: string; description: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: locale,
    isPartOf: { '@id': websiteId },
    about: { '@id': localBusinessId },
    publisher: { '@id': organizationId },
  }
}

/**
 * FAQPage node. Pass exactly the Q&A pairs rendered as visible text on the
 * page -- Google's structured-data guidelines require FAQPage markup to
 * match what a visitor actually sees, so callers should slice their FAQ
 * source the same way the visible component does rather than passing the
 * full list.
 */
export function faqPageSchema(locale: Locale, faqs: { question: string; answer: string }[]) {
  return {
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
}

/**
 * HowTo node for a short ordered process shown on a page (e.g. the
 * homepage's "how to order" steps). Same rule as faqPageSchema: the steps
 * passed in must match the visible step cards exactly.
 */
export function howToSchema(locale: Locale, name: string, steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    inLanguage: locale,
    name,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
