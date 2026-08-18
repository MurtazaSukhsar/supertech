import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Chatbot } from '@/components/chatbot'
import { MobileQuoteButton } from '@/components/mobile-quote-button'
import { QuoteProvider } from '@/context/quote-context'
import { QuoteDrawer } from '@/components/quote-drawer'
import { SmoothScroll } from '@/components/smooth-scroll'
import { LoadingScreen } from '@/components/loading-screen'
import { I18nProvider } from '@/components/i18n-provider'
import { ScrollProgress } from '@/components/scroll-progress'
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
      images: [siteImages.heroBackground],
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

        {/* Google tag (gtag.js) — GA4 property G-XWX34YME25. Loaded via
            next/script (strategy="afterInteractive") rather than a raw
            <script> tag: Next.js injects it into <head> and fires it right
            after the page becomes interactive, which is Google's own
            recommended strategy for gtag.js in a Next.js app and avoids
            blocking the initial render. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XWX34YME25"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XWX34YME25');
          `}
        </Script>
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
            <Chatbot />
            <MobileQuoteButton />
            <QuoteDrawer />
          </QuoteProvider>
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
