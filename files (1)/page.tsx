import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { BrandsStrip } from '@/components/home/brands-strip'
import { TrustBadges } from '@/components/home/trust-badges'
import { CategoryGrid } from '@/components/home/category-grid'
import { ScrollShowcase } from '@/components/home/scroll-showcase'
import { FeaturedProducts } from '@/components/home/featured-products'
import { StatsCounter } from '@/components/home/stats-counter'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { Testimonials } from '@/components/home/testimonials'
import { SeoContent } from '@/components/home/seo-content'
import { CtaBanner } from '@/components/home/cta-banner'

export const metadata: Metadata = {
  title: 'Air-Conditioning Materials, Hardware, Tools & Construction Supplies in Kuwait',
  description:
    'Super Tech supplies HVAC materials, hardware, hand and power tools, construction materials, and industrial equipment for contractors and businesses across Kuwait.',
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <TrustBadges />
      <CategoryGrid />
      <ScrollShowcase />
      <FeaturedProducts />
      <StatsCounter />
      <WhyChooseUs />
      <Testimonials />
      <SeoContent />
      <CtaBanner />
    </>
  )
}
