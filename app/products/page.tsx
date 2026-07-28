import type { Metadata } from 'next'
import { products } from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CategoryProductGrid } from '@/components/category-product-grid'

export const metadata: Metadata = {
  title: 'All Air-Conditioning Materials, Hardware, Tools & Construction Supplies | Kuwait',
  description:
    'Browse our full collection of copper pipe pancake coils, rubber insulation, Honeywell refrigerants, hand & power tools, cement, steel, and industrial equipment at Super Tech Kuwait.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'All Air-Conditioning Materials, Hardware, Tools & Construction Supplies | Kuwait',
    description:
      'Browse our full collection of copper pipe pancake coils, rubber insulation, Honeywell refrigerants, hand & power tools, cement, steel, and industrial equipment at Super Tech Kuwait.',
    images: ['/images/hero-warehouse.png'],
  },
}

export default function ProductsPage() {
  return (
    <>
      {/* Products hero banner */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24 lg:px-12">
          <div>
            <h1 className="text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
              All Products
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base md:leading-relaxed">
              Browse our complete catalog of industrial materials, tools, A/C supplies, and construction hardware. Use the filters to find specific specifications and brands.
            </p>
          </div>
        </div>
      </section>

      {/* Main product list section */}
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mb-10">
          <Breadcrumbs crumbs={[{ label: 'Products' }]} />
        </div>
        <CategoryProductGrid products={products} />
      </div>
    </>
  )
}
