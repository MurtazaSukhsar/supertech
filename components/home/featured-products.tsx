import { getFeaturedProducts } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { ScrollReveal } from '@/components/scroll-reveal'

export function FeaturedProducts() {
  const featured = getFeaturedProducts()

  return (
    <section className="bg-surface-alt">
      <div className="section-pad mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <ScrollReveal variant="fade-up">
          <div className="mb-14 flex flex-col items-start gap-3">
            <p className="eyebrow">Best Sellers</p>
            <h2 className="section-heading">Featured Products</h2>
            <p className="section-subheading">
              A selection of our most requested items. Contact us for bulk pricing and availability.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {featured.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 60} variant="scale-up" className="h-full">
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
