import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { categories } from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CategoryIcon } from '@/components/category-icon'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { getCategoryLocalized, getProductsByCategoryLocalized } from '@/lib/catalog'
import { getBlogPosts } from '@/lib/content-i18n'
import { description as metaDescription, title as metaTitle } from '@/lib/seo/meta'
import { getDictionary } from '@/lib/i18n'
import { localePath, locales, type Locale } from '@/lib/i18n/config'
import { primeSiteDataSafely } from '@/lib/server/site-data'

export function generateStaticParams() {
  return locales.flatMap((locale) => categories.map((cat) => ({ locale, slug: cat.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const category = getCategoryLocalized(slug, locale as Locale)
  if (!category) return {}

  // "Copper Pipes in Kuwait" outranks "Copper Pipes — Supplier in Kuwait":
  // shorter, and it survives Google's title truncation with the brand intact.
  const title = metaTitle(
    `${category.name} ${t.categories.titleSuffix}`,
    t.meta.titleTemplate,
  )
  const leadParagraph = category.description.split('\n\n')[0]

  return {
    title,
    description: metaDescription(leadParagraph, t.categories.requestBulkPricing),
    alternates: {
      canonical: `/${locale}/categories/${category.slug}`,
      languages: {
        en: `/en/categories/${category.slug}`,
        ar: `/ar/categories/${category.slug}`,
        'x-default': `/en/categories/${category.slug}`,
      },
    },
    openGraph: {
      title,
      description: leadParagraph,
      images: [category.image],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  await primeSiteDataSafely()
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const category = getCategoryLocalized(slug, locale as Locale)
  if (!category) notFound()

  const products = getProductsByCategoryLocalized(slug, locale as Locale)
  const href = (path: string) => localePath(locale as Locale, path)
  const guides = getBlogPosts(locale as Locale).filter((post) =>
    (post.relatedCategories ?? []).includes(category.slug),
  )

  return (
    <>
      {/* Category hero band */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:px-8 md:py-24 lg:px-12">
          <div className="flex items-start gap-6">
            <div className="hidden size-16 shrink-0 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20 sm:flex">
              <CategoryIcon icon={category.icon} className="size-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
                {category.name}
              </h1>
              <div className="mt-4 flex max-w-2xl flex-col gap-3 text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
                {category.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mb-10">
          <Breadcrumbs
            crumbs={[{ label: t.products.breadcrumb, href: '/products' }, { label: category.name }]}
          />
        </div>
        <CategoryProductGrid products={products} />

        {/* Cross-links the catalogue into the blog rather than leaving the
            two sections isolated from each other — every guide below was
            tagged with this category slug on the blog side. */}
        {guides.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="section-heading">{t.categories.guidesTitle}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={href(`/blog/${guide.slug}`)}
                  className="card-premium flex flex-col gap-2 p-5"
                >
                  <span className="text-sm font-bold text-foreground hover:text-primary">
                    {guide.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
