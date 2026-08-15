import Link from 'next/link'
import {
  FolderTree,
  HelpCircle,
  Images,
  Newspaper,
  Package,
  Plus,
  Settings,
  Type,
} from 'lucide-react'

import { requireAdmin } from '@/lib/server/auth'
import { getBlogPosts, getCategories, getFaqs, getProducts, getSite } from '@/lib/server/store'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await requireAdmin()

  // Blog posts are fetched best-effort: until the blog_posts table exists
  // (see supabase/schema.sql) this would throw and take the whole dashboard
  // down with it, when only the blog stat/shortcut should be affected.
  const [products, categories, faqs, site, blogPosts] = await Promise.all([
    getProducts(),
    getCategories(),
    getFaqs('en'),
    getSite(),
    getBlogPosts().catch(() => []),
  ])

  const featured = products.filter((p) => p.featured).length
  const missingImages = products.filter((p) => p.images.length === 0).length

  const stats = [
    { label: 'Products', value: products.length, href: '/admin/products', icon: Package },
    { label: 'Categories', value: categories.length, href: '/admin/categories', icon: FolderTree },
    { label: 'Featured', value: featured, href: '/admin/products?featured=1', icon: Package },
    { label: 'FAQs', value: faqs.length, href: '/admin/faqs', icon: HelpCircle },
    { label: 'Blog posts', value: blogPosts.length, href: '/admin/blog', icon: Newspaper },
  ]

  const shortcuts = [
    { href: '/admin/products/new', label: 'Add a product', icon: Plus },
    { href: '/admin/blog/new', label: 'Write a blog post', icon: Newspaper },
    { href: '/admin/content', label: 'Edit hero & page text', icon: Type },
    { href: '/admin/site', label: 'Contact details & images', icon: Settings },
    { href: '/admin/media', label: 'Manage images', icon: Images },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Everything on {site.contact.companyName.split(' ').slice(0, 2).join(' ')}&rsquo;s site is
          editable from here.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-primary hover:shadow"
          >
            <Icon className="size-4 text-zinc-400" />
            <p className="mt-2 text-2xl font-black text-zinc-900">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
          </Link>
        ))}
      </div>

      {missingImages > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {missingImages} product{missingImages === 1 ? ' has' : 's have'} no image yet.{' '}
          <Link href="/admin/products" className="font-bold underline">
            Review them
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {shortcuts.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-primary hover:shadow"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-zinc-900">How saving works</h2>
        <p>
          Edits are written to the JSON files in the <code className="rounded bg-zinc-100 px-1">data/</code>{' '}
          folder and uploaded images go to{' '}
          <code className="rounded bg-zinc-100 px-1">public/images/products/</code>. While{' '}
          <code className="rounded bg-zinc-100 px-1">npm run dev</code> is running, changes appear on
          the site immediately. Commit the <code className="rounded bg-zinc-100 px-1">data/</code>{' '}
          folder to git to keep a history of your edits.
        </p>
      </div>
    </div>
  )
}
