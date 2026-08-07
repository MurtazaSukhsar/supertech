import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

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
import { getDir, isLocale, localeConfig, locales, type Locale } from '@/lib/i18n/config'
import '../globals.css'

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
      images: ['/images/hero-warehouse.webp'],
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
        {/* Arabic webfont is only requested on the Arabic pages, so the English
            build stays free of external font requests. */}
        {isRtl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
              href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteSchema }}
        />
        <I18nProvider locale={locale} dictionary={t}>
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
