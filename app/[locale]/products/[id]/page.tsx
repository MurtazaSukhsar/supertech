import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import { contactInfo, getProduct, products } from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ProductGallery } from '@/components/product-gallery'
import { ScrollReveal } from '@/components/scroll-reveal'
import { AnimatedSpecTable } from '@/components/animated-spec-table'
import { InStockBadge } from '@/components/in-stock-badge'
import { StickyProductBar } from '@/components/sticky-product-bar'
import { RelatedProductsRail } from '@/components/related-products-rail'
import { ProductDetailActions } from '@/components/product-detail-actions'
import { absoluteImageUrl } from '@/lib/content'
import {
  getCategoryLocalized,
  getProductLocalized,
  getRelatedProductsLocalized,
} from '@/lib/catalog'
import { description as metaDescription, title as metaTitle } from '@/lib/seo/meta'
import { getDictionary } from '@/lib/i18n'
import { localePath, locales, type Locale } from '@/lib/i18n/config'
import { primeSiteDataSafely } from '@/lib/server/site-data'

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, id: p.id })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale, id } = await params
  const t = getDictionary(locale)
  const product = getProductLocalized(id, locale as Locale)
  if (!product) return {}

  const title = metaTitle(`${product.name} ${t.products.inKuwait}`, t.meta.titleTemplate)
  const leadParagraph = product.description.split('\n\n')[0]

  return {
    title,
    description: metaDescription(leadParagraph, t.products.metaSuffix),
    alternates: {
      canonical: `/${locale}/products/${product.id}`,
      languages: {
        en: `/en/products/${product.id}`,
        ar: `/ar/products/${product.id}`,
        'x-default': `/en/products/${product.id}`,
      },
    },
    openGraph: {
      title,
      description: leadParagraph,
      images: product.images,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  await primeSiteDataSafely()
  const { locale: rawLocale, id } = await params
  const locale = rawLocale as Locale
  const t = getDictionary(rawLocale)

  const product = getProductLocalized(id, locale)
  const baseProduct = getProduct(id)
  if (!product || !baseProduct) notFound()

  const category = getCategoryLocalized(product.category, locale)
  const related = getRelatedProductsLocalized(baseProduct, locale)
  const href = (path: string) => localePath(locale, path)

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
    image: product.images.map((image) => absoluteImageUrl(image)),
    inLanguage: locale,
    // No `offers` block: this is a wholesale/quote-based catalogue with no
    // published per-unit price, and Google requires a real `price` inside
    // `offers` for it to validate — Search Console flags a fabricated or
    // missing price as an "invalid item" for Product snippets / Merchant
    // listings either way. Declaring a price we don't actually charge would
    // also just be inaccurate. If real per-product pricing is published
    // later, add `offers: { '@type': 'Offer', price, priceCurrency: 'KWD',
    // availability: 'https://schema.org/InStock', url: ... }` back in.
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Sticky top bar on scroll */}
      <StickyProductBar product={product} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:px-8 md:py-16 lg:px-12">
        <Breadcrumbs
          crumbs={[
            { label: t.products.breadcrumb, href: '/products' },
            {
              label: category?.name ?? product.category,
              href: `/categories/${product.category}`,
            },
            { label: product.name },
          ]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery with Mask Wipe, Magnifier & Active Ring */}
          <ScrollReveal className="min-w-0">
            <ProductGallery images={product.images} name={product.name} />
          </ScrollReveal>

          {/* Product details & specs */}
          <ScrollReveal delay={100} className="min-w-0">
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={href(`/categories/${product.category}`)}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {category?.shortName ?? product.category}
                </Link>
                <span className="rounded-lg bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {product.subcategory}
                </span>
                {product.brand && (
                  <span className="ltr-embed text-xs font-bold uppercase tracking-wider text-accent">
                    {product.brand}
                  </span>
                )}
                <InStockBadge />
              </div>

              <h1 className="mt-5 text-balance text-3xl font-extrabold uppercase tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              <div className="mt-5 flex flex-col gap-4 text-pretty leading-relaxed text-muted-foreground max-w-prose">
                {product.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Interactive Size Selector, Quantity Stepper & Add to Quote Basket */}
              <ProductDetailActions product={product} />

              <a
                href={contactInfo.phoneHref}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                <Phone className="size-4" aria-hidden="true" />
                {t.products.orCallUs} <span className="ltr-embed">{contactInfo.phone}</span>
              </a>

              {/* Specifications Table with Animated Counters */}
              <div className="mt-10">
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-foreground">
                  {t.products.specifications}
                </h2>
                <AnimatedSpecTable specs={product.specsDisplay} />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Related products drag-scroll rail */}
        {related.length > 0 && (
          <section className="mt-14 sm:mt-20 md:mt-32">
            <ScrollReveal>
              <h2 className="section-heading mb-2">{t.products.relatedProducts}</h2>
            </ScrollReveal>
            <RelatedProductsRail products={related} />
          </section>
        )}
      </div>
    </>
  )
}
