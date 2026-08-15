import { BlogForm } from '@/components/admin/blog-form'
import { requireAdmin } from '@/lib/server/auth'

export const dynamic = 'force-dynamic'

export default async function NewBlogPostPage() {
  await requireAdmin()
  return <BlogForm />
}
