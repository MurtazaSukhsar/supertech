import type { MetadataRoute } from 'next'
import { blogPosts, siteUrl } from '@/lib/content'
import { categories, products } from '@/lib/products'
import { locales } from '@/lib/i18n/config'

/**
 * Every URL is emitted once per locale, and each entry carries `alternates` so
 * Google sees the en/ar pair as one page in two languages rather than as
 * duplicate content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  function languages(path: string) {
    return Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]))
  }

  function entry(
    path: string,
    lastModified: Date,
    changeFrequency: 'weekly' | 'monthly',
    priority: number,
  ) {
    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    }))
  }

  const staticRoutes = ['', '/about', '/contact', '/faq', '/blog', '/products'].flatMap((route) =>
    entry(route, now, 'weekly', route === '' ? 1 : 0.8),
  )

  const categoryRoutes = categories.flatMap((category) =>
    entry(`/categories/${category.slug}`, now, 'weekly', 0.85),
  )

  const productRoutes = products.flatMap((product) =>
    entry(`/products/${product.id}`, now, 'monthly', product.featured ? 0.8 : 0.65),
  )

  const blogRoutes = blogPosts.flatMap((post) =>
    entry(`/blog/${post.slug}`, new Date(post.publishedAt), 'monthly', 0.75),
  )

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes]
}
