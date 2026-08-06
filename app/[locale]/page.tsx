import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { CategorySlideshow } from '@/components/home/category-slideshow'
import { TrustBadges } from '@/components/home/trust-badges'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { StatsCounter } from '@/components/home/stats-counter'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { Testimonials } from '@/components/home/testimonials'
import { SeoContent } from '@/components/home/seo-content'
import { CtaBanner } from '@/components/home/cta-banner'
import { getDictionary } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    title: t.products.metaTitle,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', ar: '/ar', 'x-default': '/en' },
    },
  }
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySlideshow />
      <TrustBadges />
      <CategoryGrid />
      <FeaturedProducts />
      <StatsCounter />
      <WhyChooseUs />
      <Testimonials />
      <SeoContent />
      <CtaBanner />
    </>
  )
}
