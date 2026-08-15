import faqsData from '@/data/faqs.json'
import blogData from '@/data/blog.json'

export type Faq = {
  question: string
  answer: string
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: string
  readTime: string
  image: string
  body: string[]
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supertechint.com.kw'

/**
 * Seeded from the committed JSON, then refilled in place once Supabase data
 * arrives. Mutating rather than reassigning matters: every module that
 * imported this array holds the original reference.
 */
export const faqs: Faq[] = [...(faqsData as unknown as Faq[])]

/** Seeded from the committed JSON, then refilled in place once Supabase data arrives. */
export const blogPosts: BlogPost[] = [...(blogData as unknown as BlogPost[])]

export function replaceFaqs(next: Faq[]): void {
  if (next.length > 0) faqs.splice(0, faqs.length, ...next)
}

export function replaceBlogPosts(next: BlogPost[]): void {
  if (next.length > 0) blogPosts.splice(0, blogPosts.length, ...next)
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
