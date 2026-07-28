import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Chatbot } from '@/components/chatbot'
import { MobileQuoteButton } from '@/components/mobile-quote-button'
import { QuoteProvider } from '@/context/quote-context'
import { QuoteDrawer } from '@/components/quote-drawer'
import { SmoothScroll } from '@/components/smooth-scroll'
import { siteUrl } from '@/lib/content'
import { contactInfo } from '@/lib/products'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Super Tech Int\u2019l Construction Materials Co. | Kuwait',
    template: '%s | Super Tech Int\u2019l Construction Materials Co.',
  },
  description:
    'Kuwait-based supplier of air-conditioning materials, hardware supplies, hand & power tools, and construction materials. Request a quote today.',
  keywords: [
    'construction materials Kuwait',
    'air conditioning materials Kuwait',
    'hardware supplier Kuwait',
    'power tools Kuwait',
    'industrial equipment Kuwait',
    'HVAC materials supplier',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Super Tech International Construction Materials Co.',
    title: 'Super Tech International Construction Materials Co. | Kuwait',
    description:
      'Kuwait-based supplier of HVAC materials, hardware, tools, and construction materials.',
    images: ['/images/hero-warehouse.png'],
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0a2472',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contactInfo.companyName,
    description:
      'Kuwait-based supplier of air-conditioning materials, hardware supplies, hand and power tools, and construction materials.',
    url: siteUrl,
    telephone: contactInfo.phone,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shuwaikh Industrial Area',
      addressLocality: 'Kuwait City',
      addressCountry: 'KW',
    },
    areaServed: 'Kuwait',
  }

  return (
    <html lang="en" className={`bg-background ${inter.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <SmoothScroll />
        <QuoteProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <WhatsAppButton />
          <Chatbot />
          <MobileQuoteButton />
          <QuoteDrawer />
        </QuoteProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
