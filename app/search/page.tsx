import type { Metadata } from 'next'
import { searchProducts } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ScrollReveal } from '@/components/scroll-reveal'

export const metadata: Metadata = {
  title: 'Search Products',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const results = searchProducts(q)

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24 lg:px-12">
          <p className="eyebrow !text-accent">Search</p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
            Search Results
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16 lg:px-12">
        <Breadcrumbs crumbs={[{ label: 'Search' }]} />
        <p className="mt-6 text-sm text-muted-foreground">
          {q
            ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${q}"`
            : 'Enter a search term in the header to find products.'}
        </p>

        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {results.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 60}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          q && (
            <div className="mt-12 rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-sm text-muted-foreground">
                No products found. Try a different keyword or browse our categories.
              </p>
            </div>
          )
        )}
      </div>
    </>
  )
}
