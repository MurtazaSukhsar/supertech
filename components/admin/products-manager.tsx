'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ImageIcon, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'

import type { Category, Product } from '@/lib/products'
import { api, Button, inputClass, useToast } from './ui'

export function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [busy, setBusy] = useState(false)
  const { notify } = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (!q) return true
      return (
        product.name.toLowerCase().includes(q) ||
        product.id.toLowerCase().includes(q) ||
        (product.brand ?? '').toLowerCase().includes(q) ||
        product.subcategory.toLowerCase().includes(q)
      )
    })
  }, [products, query, category])

  const remove = async (product: Product) => {
    setBusy(true)
    try {
      const data = await api<{ products: Product[] }>(
        `/api/admin/products?id=${encodeURIComponent(product.id)}`,
        { method: 'DELETE' },
      )
      setProducts(data.products)
      notify(`"${product.name}" deleted.`)
      setPendingDelete(null)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Delete failed.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const toggleFeatured = async (product: Product) => {
    try {
      const data = await api<{ products: Product[] }>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({ ...product, originalId: product.id, featured: !product.featured }),
      })
      setProducts(data.products)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Update failed.', 'error')
    }
  }

  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.shortName ?? slug

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Products</h1>
          <p className="text-sm text-zinc-500">
            {products.length} in the catalogue
            {filtered.length !== products.length && ` · ${filtered.length} shown`}
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" />
            Add product
          </Button>
        </Link>
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, brand, or id…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="w-16 px-4 py-3">Image</th>
              <th className="px-4 py-3">Product</th>
              <th className="hidden px-4 py-3 md:table-cell">Category</th>
              <th className="hidden px-4 py-3 lg:table-cell">Brand</th>
              <th className="w-20 px-4 py-3 text-center">Featured</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((product) => (
              <tr key={product.id} className="transition hover:bg-zinc-50">
                <td className="px-4 py-2">
                  <span className="flex size-11 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="size-4 text-zinc-300" />
                    )}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/products/${encodeURIComponent(product.id)}`}
                    className="font-semibold text-zinc-900 hover:text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-zinc-400">{product.subcategory || product.id}</p>
                </td>
                <td className="hidden px-4 py-2 text-zinc-600 md:table-cell">
                  {categoryName(product.category)}
                </td>
                <td className="hidden px-4 py-2 text-zinc-600 lg:table-cell">
                  {product.brand ?? '—'}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => toggleFeatured(product)}
                    title={product.featured ? 'Remove from homepage' : 'Show on homepage'}
                    className="rounded p-1.5 transition hover:bg-zinc-100"
                  >
                    <Star
                      className={`size-4 ${product.featured ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`}
                    />
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${encodeURIComponent(product.id)}`}
                      className="rounded p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-primary"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      onClick={() => setPendingDelete(product)}
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
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                  No products match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-900">Delete this product?</h3>
            <p className="mt-2 text-sm text-zinc-600">
              &ldquo;{pendingDelete.name}&rdquo; will be removed from the site. Its image files stay
              in the media library.
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
