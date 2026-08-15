import { DatabaseZap } from 'lucide-react'

import { BlogManager } from '@/components/admin/blog-manager'
import { requireAdmin } from '@/lib/server/auth'
import { getBlogPosts } from '@/lib/server/store'
import type { BlogPost } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  await requireAdmin()

  let posts: BlogPost[] = []
  let setupError: string | null = null
  try {
    posts = await getBlogPosts()
  } catch (error) {
    setupError = error instanceof Error ? error.message : 'Could not reach the blog_posts table.'
  }

  if (setupError) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
          <div className="flex items-center gap-2 text-amber-900">
            <DatabaseZap className="size-5" />
            <h1 className="text-lg font-bold">Blog isn&rsquo;t set up in Supabase yet</h1>
          </div>
          <p className="mt-3 text-sm text-amber-900">
            The <code className="rounded bg-amber-100 px-1">blog_posts</code> table doesn&rsquo;t exist
            yet, so this page can&rsquo;t load. Two one-time steps fix it:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-amber-900">
            <li>
              Open the Supabase dashboard → SQL Editor → New query, paste the contents of{' '}
              <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>, and run it. It&rsquo;s
              safe to run in full even though most of it already exists.
            </li>
            <li>
              Run <code className="rounded bg-amber-100 px-1">node scripts/migrate-to-supabase.mjs</code>{' '}
              locally to bring your existing 3 blog posts into the new table.
            </li>
          </ol>
          <p className="mt-3 text-xs text-amber-800">Reload this page once both steps are done.</p>
          <p className="mt-4 text-xs text-amber-700/80">
            Database error: <code className="rounded bg-amber-100 px-1">{setupError}</code>
          </p>
        </div>
      </div>
    )
  }

  return <BlogManager initialPosts={posts} />
}
