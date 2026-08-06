import { blogPosts, faqs, type BlogPost, type Faq } from '@/lib/content'
import { blogPostsAr, faqsAr } from '@/lib/content-ar'
import type { Locale } from '@/lib/i18n/config'

/**
 * Slugs are shared across locales on purpose, so `/en/blog/x` and `/ar/blog/x`
 * are the same article — which is what keeps the hreflang pairing valid.
 */
export function getFaqs(locale: Locale): Faq[] {
  return locale === 'ar' ? faqsAr : faqs
}

export function getBlogPosts(locale: Locale): BlogPost[] {
  return locale === 'ar' ? blogPostsAr : blogPosts
}

export function getBlogPostLocalized(slug: string, locale: Locale): BlogPost | undefined {
  return getBlogPosts(locale).find((post) => post.slug === slug)
}
