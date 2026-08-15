'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ImageIcon, Pencil, Plus, Search, Trash2 } from 'lucide-react'

import type { BlogPost } from '@/lib/content'
import { api, Button, inputClass, useToast } from './ui'

export function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null)
  const [busy, setBusy] = useState(false)
  const { notify } = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q),
    )
  }, [posts, query])

  const remove = async (post: BlogPost) => {
    setBusy(true)
    try {
      const data = await api<{ posts: BlogPost[] }>(
        `/api/admin/blog?slug=${encodeURIComponent(post.slug)}`,
        { method: 'DELETE' },
      )
      setPosts(data.posts)
      notify(`"${post.title}" deleted.`)
      setPendingDelete(null)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Delete failed.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Blog</h1>
          <p className="text-sm text-zinc-500">
            {posts.length} post{posts.length === 1 ? '' : 's'} published
            {filtered.length !== posts.length && ` · ${filtered.length} shown`}
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="size-4" />
            Write a post
          </Button>
        </Link>
      </header>

      <div className="relative min-w-56 flex-1">
        <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, slug, or category…"
          className={`${inputClass} pl-9`}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="w-16 px-4 py-3">Image</th>
              <th className="px-4 py-3">Post</th>
              <th className="hidden px-4 py-3 md:table-cell">Category</th>
              <th className="hidden px-4 py-3 lg:table-cell">Published</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((post) => (
              <tr key={post.slug} className="transition hover:bg-zinc-50">
                <td className="px-4 py-2">
                  <span className="flex size-11 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="size-4 text-zinc-300" />
                    )}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/blog/${encodeURIComponent(post.slug)}`}
                    className="font-semibold text-zinc-900 hover:text-primary hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-zinc-400">{post.slug}</p>
                </td>
                <td className="hidden px-4 py-2 text-zinc-600 md:table-cell">{post.category || '—'}</td>
                <td className="hidden px-4 py-2 text-zinc-600 lg:table-cell">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/blog/${encodeURIComponent(post.slug)}`}
                      className="rounded p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-primary"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      onClick={() => setPendingDelete(post)}
                      className="rounded p-1.5 text-zinc-500 transition hover:bg-accent/10 hover:text-accent"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                  No posts match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-900">Delete this post?</h3>
            <p className="mt-2 text-sm text-zinc-600">
              &ldquo;{pendingDelete.title}&rdquo; will be removed from the blog and sitemap.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" loading={busy} onClick={() => remove(pendingDelete)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
