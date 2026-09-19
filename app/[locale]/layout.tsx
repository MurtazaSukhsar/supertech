import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ChatbotDeferred } from '@/components/chatbot-deferred'
import { MobileQuoteButton } from '@/components/mobile-quote-button'
import { QuoteProvider } from '@/context/quote-context'
import { QuoteDrawerDeferred } from '@/components/quote-drawer-deferred'
import { SmoothScroll } from '@/components/smooth-scroll'
import { LoadingScreen } from '@/components/loading-screen'
import { I18nProvider } from '@/components/i18n-provider'
import { ScrollProgress } from '@/components/scroll-progress'
import { DeferredAnalytics } from '@/components/deferred-analytics'
import { siteUrl } from '@/lib/content'
import {
  localBusinessSchema,
  organizationSchema,
  schemaGraph,
  websiteSchema,
} from '@/lib/seo/schema'
import { getDictionary } from '@/lib/i18n'
import { primeSiteDataSafely } from '@/lib/server/site-data'
import { getDir, isLocale, localeConfig, locales, type Locale } from '@/lib/i18n/config'
import '../globals.css'
import { siteImages } from '@/lib/products'

// Use system font configuration to allow isolated offline build compilation without requesting Google Fonts
const inter = {
  variable: '--font-inter',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  await primeSiteDataSafely()
  const t = getDictionary(locale)
  const config = localeConfig[locale]

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.meta.titleDefault,
      template: t.meta.titleTemplate,
    },
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: config.ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeConfig[l].ogLocale),
      url: `/${locale}`,
      siteName: t.meta.siteName,
      title: t.meta.titleDefault,
      description: t.meta.ogDescription,
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t.meta.titleDefault,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.titleDefault,
      description: t.meta.ogDescription,
      images: ['/images/og-image.jpg'],
    },
    verification: {
      google: 'QVhsIlUtLtnruxTRFBq3wSPRSR1GGItu1WNeG3A16pU',
    },
    generator: 'v0.app',
  }
}

export const viewport: Viewport = {
  themeColor: '#0a2472',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()

  // Load the catalogue, site settings, and page-text overrides once, before
  // anything renders, so the synchronous helpers below see live data.
  const snapshot = await primeSiteDataSafely()

  // Client components resolve their own copy of the catalogue module, so the
  // live data has to cross the boundary explicitly.
  const clientSiteData = snapshot && {
    products: snapshot.products,
    categories: snapshot.categories,
    contact: snapshot.site.contact,
    images: snapshot.site.images,
    translationsAr: snapshot.translationsAr,
  }

  const locale = rawLocale as Locale
  const t = getDictionary(locale)
  const dir = getDir(locale)
  const isRtl = dir === 'rtl'

  /**
   * Emitted on every page as a single @graph so Google merges the shop,
   * company and site into one entity rather than three competing ones.
   */
  const siteSchema = schemaGraph([
    localBusinessSchema(locale, t),
    organizationSchema(t),
    websiteSchema(locale, t),
  ])

  return (
    <html
      lang={localeConfig[locale].htmlLang}
      dir={dir}
      className={`bg-background ${inter.variable} ${isRtl ? 'font-arabic' : ''}`}
    >
      <head>
        {/* Cairo is self-hosted from /public/fonts/cairo (see globals.css) and
            declared with font-display: swap, so it's only fetched when
            html.font-arabic is actually applied — no per-locale <head>
            branching needed, and no external font requests either way. */}

        {/* Preload the hero background so the browser discovers it at HTML
            parse time rather than waiting for the 'use client' Hero component
            to hydrate. This is the primary LCP fix: the image is the largest
            element in the viewport but was previously only requested after
            the JS bundle loaded and React ran. The snapshot may have a live
            Cloudinary URL (mutated into siteImages by primeSiteDataSafely);
            fall back to the seed path if the DB hasn't responded yet. */}
        {snapshot?.site?.images?.heroBackground
          ? <link
              rel="preload"
              as="image"
              href={snapshot.site.images.heroBackground}
              fetchPriority="high"
            />
          : <link
              rel="preload"
              as="image"
              href="/images/hero-warehouse.webp"
              fetchPriority="high"
            />
        }

        {/* Google tag (gtag.js) — GA4 property G-XWX34YME25. Loaded
            eagerly by <DeferredAnalytics/> (rendered in <body>): see that
            component for why it no longer defers to first interaction. */}
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteSchema }}
        />
        <I18nProvider locale={locale} dictionary={t} siteData={clientSiteData}>
          <LoadingScreen />
          <SmoothScroll />
          <ScrollProgress />
          <QuoteProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <WhatsAppButton />
            <ChatbotDeferred />
            <MobileQuoteButton />
            <QuoteDrawerDeferred />
          </QuoteProvider>
        </I18nProvider>
        {/* @vercel/analytics's <Analytics/> was removed here: it tries to
            fetch /_vercel/insights/script.js, which only exists on Vercel's
            own hosting. This app is deployed on Hostinger via a custom
            server.js, so that request always 404s and logs a console error
            on every single page load (Lighthouse's Best Practices audit
            flags exactly this: "Browser errors were logged to the
            console"). If the site ever moves to Vercel, or Web Analytics
            gets enabled for this project, this can come back. */}
        <DeferredAnalytics />
      </body>
    </html>
  )
}
