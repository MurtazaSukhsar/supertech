import { notFound } from 'next/navigation'

import { BlogForm } from '@/components/admin/blog-form'
import { requireAdmin } from '@/lib/server/auth'
import { getBlogPostTranslation, getBlogPosts } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await requireAdmin()
  const { slug } = await params
  const postSlug = decodeURIComponent(slug)

  const [posts, arabic] = await Promise.all([getBlogPosts(), getBlogPostTranslation(postSlug)])

  const post = posts.find((p) => p.slug === postSlug)
  if (!post) notFound()

  return <BlogForm post={post} arabic={arabic} />
}
