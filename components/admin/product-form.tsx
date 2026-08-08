'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

import type { Category, Product } from '@/lib/products'
import { ImageListPicker } from './image-picker'
import { api, Button, Card, Field, inputClass, useToast } from './ui'

export type ArabicProduct = { name?: string; description?: string; specs?: Record<string, string> }

type SpecRow = { key: string; value: string }

const toRows = (specs: Record<string, string>): SpecRow[] =>
  Object.entries(specs).map(([key, value]) => ({ key, value }))

const fromRows = (rows: SpecRow[]): Record<string, string> =>
  Object.fromEntries(rows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]))

export function ProductForm({
  product,
  arabic,
  categories,
}: {
  product?: Product
  arabic?: ArabicProduct
  categories: Category[]
}) {
  const router = useRouter()
  const { notify } = useToast()
  const isEdit = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [categorySlug, setCategorySlug] = useState(product?.category ?? categories[0]?.slug ?? '')
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? '')
  const [brand, setBrand] = useState(product?.brand ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [featured, setFeatured] = useState(Boolean(product?.featured))
  const [specs, setSpecs] = useState<SpecRow[]>(toRows(product?.specs ?? {}))
  const [arName, setArName] = useState(arabic?.name ?? '')
  const [arDescription, setArDescription] = useState(arabic?.description ?? '')
  const [saving, setSaving] = useState(false)

  // Subcategory options come from the selected category, but a free-text entry
  // is still allowed so a new one doesn't require editing the category first.
  const subcategoryOptions = useMemo(
    () => categories.find((c) => c.slug === categorySlug)?.subcategories ?? [],
    [categories, categorySlug],
  )

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          id: product?.id,
          originalId: product?.id,
          name,
          category: categorySlug,
          subcategory,
          brand,
          description,
          images,
          featured,
          specs: fromRows(specs),
          arabic: { name: arName, description: arDescription },
        }),
      })
      notify(isEdit ? 'Product saved.' : 'Product added.')
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Save failed.', 'error')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-5 pb-24">
      <header className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            {isEdit ? 'Edit product' : 'Add product'}
          </h1>
          {isEdit && <p className="text-xs text-zinc-500">ID: {product?.id}</p>}
        </div>
      </header>

      <Card title="Details">
        <div className="space-y-4">
          <Field label="Product name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Copper Pipe Pancake Coil"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Subcategory" hint="Shown as the filter label on the products page.">
              <input
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                list="subcategory-options"
                className={inputClass}
                placeholder="Copper Pipes & Coils"
              />
              <datalist id="subcategory-options">
                {subcategoryOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand">
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={inputClass}
                placeholder="Fischer"
              />
            </Field>

            <label className="flex items-end gap-2.5 pb-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="size-4 rounded border-zinc-300"
                style={{ accentColor: 'var(--primary)' }}
              />
              <span className="text-sm font-medium text-zinc-700">
                Show in Featured Products on the homepage
              </span>
            </label>
          </div>

          <Field label="Description" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </Card>

      <Card title="Images" description="The first image is used as the catalogue thumbnail.">
        <ImageListPicker values={images} onChange={setImages} />
      </Card>

      <Card
        title="Specifications"
        description="Rendered as the spec table on the product page."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSpecs([...specs, { key: '', value: '' }])}
          >
            <Plus className="size-4" />
            Add row
          </Button>
        }
      >
        <div className="space-y-2">
          {specs.map((row, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={row.key}
                onChange={(e) => {
                  const next = [...specs]
                  next[index] = { ...row, key: e.target.value }
                  setSpecs(next)
                }}
                placeholder="Material"
                className={`${inputClass} w-1/3`}
              />
              <input
                value={row.value}
                onChange={(e) => {
                  const next = [...specs]
                  next[index] = { ...row, value: e.target.value }
                  setSpecs(next)
                }}
                placeholder="Forged Brass C37700"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                className="rounded-lg px-2 text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {specs.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">
              No specifications yet. Add a row to start.
            </p>
          )}
        </div>
      </Card>

      <Card
        title="Arabic translation"
        description="Optional. Left blank, the Arabic site shows the English text."
      >
        <div className="space-y-4" dir="rtl">
          <Field label="اسم المنتج">
            <input value={arName} onChange={(e) => setArName(e.target.value)} className={inputClass} />
          </Field>
          <Field label="الوصف">
            <textarea
              value={arDescription}
              onChange={(e) => setArDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-3xl justify-end gap-2">
          <Link href="/admin/products">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={saving}>
            {isEdit ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
