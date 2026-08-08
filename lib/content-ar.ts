import type { BlogPost, Faq } from '@/lib/content'
import faqsArData from '@/data/faqs-ar.json'
import blogArData from '@/data/blog-ar.json'

/** See the note in `lib/content.ts` — refilled in place, never reassigned. */
export const faqsAr: Faq[] = [...(faqsArData as unknown as Faq[])]

export const blogPostsAr: BlogPost[] = blogArData as unknown as BlogPost[]

export function replaceFaqsAr(next: Faq[]): void {
  if (next.length > 0) faqsAr.splice(0, faqsAr.length, ...next)
}
