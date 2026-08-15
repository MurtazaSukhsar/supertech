import type { BlogPost } from '@/lib/content'
import { jsonError, jsonOk, readBody, withAdmin } from '@/lib/server/api'
import {
  deleteBlogPost,
  getBlogPosts,
  slugify,
  uniqueId,
  upsertBlogPost,
  type BlogPostArabic,
} from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type BlogPostPayload = BlogPost & {
  originalSlug?: string
  arabic?: BlogPostArabic
}

function validate(post: Partial<BlogPost>): string | null {
  if (!post.title?.trim()) return 'Title is required.'
  if (!post.description?.trim()) return 'A short description is required.'
  if (!post.image?.trim()) return 'Add a cover image.'
  if (!Array.isArray(post.body) || post.body.filter((p) => p.trim()).length === 0)
    return 'Add at least one paragraph of body text.'
  return null
}

export const GET = withAdmin(async () => jsonOk({ posts: await getBlogPosts() }))

export const POST = withAdmin(async (request) => {
  const body = await readBody<BlogPostPayload>(request)
  const problem = validate(body)
  if (problem) return jsonError(problem)

  const existing = await getBlogPosts()
  const originalSlug = body.originalSlug
  const isEdit = Boolean(originalSlug && existing.some((p) => p.slug === originalSlug))

  // A blank slug means "derive one from the title"; on edit the slug is kept
  // so existing links keep pointing at the same post.
  let slug = body.slug?.trim() || slugify(body.title)
  if (!isEdit || slug !== originalSlug) {
    slug = uniqueId(
      slugify(slug),
      existing.filter((p) => p.slug !== originalSlug).map((p) => p.slug),
    )
  }

  const post: BlogPost = {
    slug,
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category?.trim() || '',
    publishedAt: body.publishedAt?.trim() || new Date().toISOString().slice(0, 10),
    readTime: body.readTime?.trim() || '',
    image: body.image.trim(),
    body: body.body.map((p) => p.trim()).filter(Boolean),
  }

  // Arabic copy is optional — an empty submission clears the override.
  const arabic = body.arabic
  const hasArabicText = Boolean(
    arabic?.title?.trim() ||
      arabic?.description?.trim() ||
      arabic?.category?.trim() ||
      arabic?.readTime?.trim() ||
      arabic?.body?.some((p) => p.trim()),
  )

  const posts = await upsertBlogPost(post, originalSlug, hasArabicText ? arabic : null)

  return jsonOk({ post, posts })
})

export const DELETE = withAdmin(async (request) => {
  const slug = new URL(request.url).searchParams.get('slug')
  if (!slug) return jsonError('Missing post slug.')
  return jsonOk({ posts: await deleteBlogPost(slug) })
})
