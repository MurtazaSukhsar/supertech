import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CatalogueDownload } from '@/components/catalogue-download'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { getProducts } from '@/lib/catalog'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { primeSiteDataSafely } from '@/lib/server/site-data'
import { siteImages } from '@/lib/products'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    title: t.products.metaTitle,
    description: t.products.metaDescription,
    alternates: {
      canonical: `/${locale}/products`,
      languages: { en: '/en/products', ar: '/ar/products', 'x-default': '/en/products' },
    },
    openGraph: {
      title: t.products.metaTitle,
      description: t.products.metaDescription,
      images: [siteImages.heroBackground],
    },
  }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)
  const products = getProducts(locale as Locale)

  return (
    <>
      {/* Products hero banner */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:px-8 md:py-24 lg:px-12">
          {/*
            Centred against the heading block rather than bottom-aligned: the
            text column is two lines taller than the button, so `items-end`
            left it stranded away from anything it relates to.
          */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
                {t.products.title}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base md:leading-relaxed">
                {t.products.subtitle}
              </p>
            </div>
            {/* Buyers who want the whole range offline are already here. */}
            <CatalogueDownload className="shrink-0 self-start lg:self-auto" />
          </div>
        </div>
      </section>

      {/* Main product list section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mb-10">
          <Breadcrumbs crumbs={[{ label: t.products.breadcrumb }]} />
        </div>
        <CategoryProductGrid products={products} />
      </div>
    </>
  )
}
