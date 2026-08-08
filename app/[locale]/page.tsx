import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { CategorySlideshow } from '@/components/home/category-slideshow'
import { TrustBadges } from '@/components/home/trust-badges'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProductsClient } from '@/components/home/featured-products-client'
import { StatsCounter } from '@/components/home/stats-counter'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { Testimonials } from '@/components/home/testimonials'
import { SeoContent } from '@/components/home/seo-content'
import { CtaBanner } from '@/components/home/cta-banner'
import { getDictionary } from '@/lib/i18n'
import { primeSiteDataSafely } from '@/lib/server/site-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    // `absolute` stops the layout template from appending the brand twice —
    // the homepage title already carries it.
    title: { absolute: t.meta.titleDefault },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', ar: '/ar', 'x-default': '/en' },
    },
  }
}

export default async function HomePage() {
  // The homepage renders client components that read the catalogue
  // synchronously, so the data has to be in place before this returns.
  await primeSiteDataSafely()

  return (
    <>
      <Hero />
      <CategorySlideshow />
      <TrustBadges />
      <CategoryGrid />
      <FeaturedProductsClient />
      <StatsCounter />
      <WhyChooseUs />
      <Testimonials />
      <SeoContent />
      <CtaBanner />
    </>
  )
}
