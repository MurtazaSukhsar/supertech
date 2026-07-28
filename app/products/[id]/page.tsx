import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import {
  contactInfo,
  getCategory,
  getProduct,
  getRelatedProducts,
  products,
} from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ProductGallery } from '@/components/product-gallery'
import { ScrollReveal } from '@/components/scroll-reveal'
import { AnimatedSpecTable } from '@/components/animated-spec-table'
import { InStockBadge } from '@/components/in-stock-badge'
import { StickyProductBar } from '@/components/sticky-product-bar'
import { RelatedProductsRail } from '@/components/related-products-rail'
import { ProductDetailActions } from '@/components/product-detail-actions'
import { siteUrl } from '@/lib/content'

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = getProduct(id)
  if (!product) return {}
  return {
    title: `${product.name} in Kuwait`,
    description: `${product.description} Request pricing, availability, and delivery from Super Tech Kuwait.`,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: `${product.name} in Kuwait`,
      description: product.description,
      images: product.images,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()

  const category = getCategory(product.category)
  const related = getRelatedProducts(product)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    category: category?.name ?? product.category,
    image: product.images.map((image) => `${siteUrl}${image}`),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'KWD',
      url: `${siteUrl}/products/${product.id}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Sticky top bar on scroll */}
      <StickyProductBar product={product} />

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16 lg:px-12">
        <Breadcrumbs
          crumbs={[
            { label: 'Products', href: '/products' },
            { label: category?.name ?? product.category, href: `/categories/${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery with Mask Wipe, Magnifier & Active Ring */}
          <ScrollReveal>
            <ProductGallery images={product.images} name={product.name} />
          </ScrollReveal>

          {/* Product details & specs */}
          <ScrollReveal delay={100}>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/categories/${product.category}`}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {category?.shortName ?? product.category}
                </Link>
                <span className="rounded-lg bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {product.subcategory}
                </span>
                {product.brand && (
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">{product.brand}</span>
                )}
                <InStockBadge />
              </div>

              <h1 className="mt-5 text-balance text-3xl font-extrabold uppercase tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-5 text-pretty leading-relaxed text-muted-foreground max-w-prose">{product.description}</p>

              {/* Interactive Size Selector, Quantity Stepper & Add to Quote Basket */}
              <ProductDetailActions product={product} />

              <a
                href={contactInfo.phoneHref}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                <Phone className="size-4" aria-hidden="true" />
                Or call us directly: {contactInfo.phone}
              </a>

              {/* Specifications Table with Animated Counters */}
              <div className="mt-10">
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-foreground">Specifications</h2>
                <AnimatedSpecTable specs={product.specs} />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Related products drag-scroll rail */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-32">
            <ScrollReveal>
              <h2 className="section-heading mb-2">Related Products</h2>
            </ScrollReveal>
            <RelatedProductsRail products={related} />
          </section>
        )}
      </div>
    </>
  )
}
