'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ImageIcon, Pencil, Plus, Trash2, X } from 'lucide-react'

import type { Category } from '@/lib/products'
import { ImagePicker } from './image-picker'
import { api, Button, Card, Field, inputClass, useToast } from './ui'

type ArabicCategory = { name: string; shortName: string; description: string }

const BLANK: Category = {
  slug: '',
  name: '',
  shortName: '',
  description: '',
  icon: 'package',
  image: '',
  subcategories: [],
}

/** Icons the public category grid knows how to render. */
const ICONS = [
  'paperclip',
  'wind',
  'wrench',
  'drill',
  'building',
  'droplets',
  'zap',
  'fan',
  'package',
]

export function CategoriesManager({
  initialCategories,
  counts,
  arabic,
}: {
  initialCategories: Category[]
  counts: Record<string, number>
  arabic: Record<string, ArabicCategory>
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [editing, setEditing] = useState<{
    category: Category
    arabic: ArabicCategory
    originalSlug?: string
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const { notify } = useToast()

  const blankArabic: ArabicCategory = { name: '', shortName: '', description: '' }

  const startEdit = (category: Category) =>
    setEditing({
      category: { ...category },
      arabic: arabic[category.slug] ?? blankArabic,
      originalSlug: category.slug,
    })

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      const data = await api<{ categories: Category[] }>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({
          ...editing.category,
          originalSlug: editing.originalSlug,
          arabic: editing.arabic,
        }),
      })
      setCategories(data.categories)
      notify('Category saved.')
      setEditing(null)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Save failed.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category: Category) => {
    try {
      const data = await api<{ categories: Category[] }>(
        `/api/admin/categories?slug=${encodeURIComponent(category.slug)}`,
        { method: 'DELETE' },
      )
      setCategories(data.categories)
      notify('Category deleted.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Delete failed.', 'error')
    }
  }

  const reorder = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= categories.length) return
    const next = [...categories]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setCategories(next)
    try {
      await api('/api/admin/categories', {
        method: 'PATCH',
        body: JSON.stringify({ order: next.map((c) => c.slug) }),
      })
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Reorder failed.', 'error')
    }
  }

  const update = (patch: Partial<Category>) =>
    setEditing((prev) => (prev ? { ...prev, category: { ...prev.category, ...patch } } : prev))

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Categories</h1>
          <p className="text-sm text-zinc-500">
            Order here controls the order on the homepage grid and in the menu.
          </p>
        </div>
        <Button onClick={() => setEditing({ category: { ...BLANK }, arabic: { ...blankArabic } })}>
          <Plus className="size-4" />
          Add category
        </Button>
      </header>

      <div className="space-y-2">
        {categories.map((category, index) => (
          <div
            key={category.slug}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-col">
              <button
                onClick={() => reorder(index, -1)}
                disabled={index === 0}
                className="text-zinc-400 transition hover:text-zinc-700 disabled:opacity-25"
                aria-label="Move up"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                onClick={() => reorder(index, 1)}
                disabled={index === categories.length - 1}
                className="text-zinc-400 transition hover:text-zinc-700 disabled:opacity-25"
                aria-label="Move down"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>

            <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
              {category.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={category.image} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <ImageIcon className="size-4 text-zinc-300" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-zinc-900">{category.name}</p>
              <p className="truncate text-xs text-zinc-500">
                /{category.slug} · {counts[category.slug] ?? 0} products ·{' '}
                {category.subcategories.length} subcategories
              </p>
            </div>

            <button
              onClick={() => startEdit(category)}
              className="rounded p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-primary"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={() => remove(category)}
              className="rounded p-2 text-zinc-500 transition hover:bg-accent/10 hover:text-accent"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form
            onSubmit={save}
            className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <h2 className="text-sm font-bold text-zinc-900">
                {editing.originalSlug ? 'Edit category' : 'New category'}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                  <input
                    value={editing.category.name}
                    onChange={(e) => update({ name: e.target.value })}
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Short name" hint="Used in the header menu where space is tight.">
                  <input
                    value={editing.category.shortName}
                    onChange={(e) => update({ shortName: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="URL slug"
                  hint={
                    editing.originalSlug
                      ? 'Changing this updates every product in the category.'
                      : 'Left blank, it is generated from the name.'
                  }
                >
                  <input
                    value={editing.category.slug}
                    onChange={(e) => update({ slug: e.target.value })}
                    className={inputClass}
                    placeholder="air-conditioning"
                  />
                </Field>
                <Field label="Icon">
                  <select
                    value={editing.category.icon}
                    onChange={(e) => update({ icon: e.target.value })}
                    className={inputClass}
                  >
                    {ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  value={editing.category.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </Field>

              <ImagePicker
                label="Category image"
                value={editing.category.image}
                onChange={(image) => update({ image })}
              />

              <Field
                label="Subcategories"
                hint="One per line. These become the filter options on the products page."
              >
                <textarea
                  value={editing.category.subcategories.join('\n')}
                  onChange={(e) => update({ subcategories: e.target.value.split('\n') })}
                  rows={4}
                  className={inputClass}
                />
              </Field>

              <details className="rounded-lg border border-zinc-200 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-700">
                  Arabic translation
                </summary>
                <div className="mt-3 space-y-3" dir="rtl">
                  <Field label="الاسم">
                    <input
                      value={editing.arabic.name}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, arabic: { ...prev.arabic, name: e.target.value } } : prev,
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="الاسم المختصر">
                    <input
                      value={editing.arabic.shortName}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev
                            ? { ...prev, arabic: { ...prev.arabic, shortName: e.target.value } }
                            : prev,
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="الوصف">
                    <textarea
                      value={editing.arabic.description}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev
                            ? { ...prev, arabic: { ...prev.arabic, description: e.target.value } }
                            : prev,
                        )
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </details>
            </div>

            <footer className="flex justify-end gap-2 border-t border-zinc-200 px-5 py-4">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save category
              </Button>
            </footer>
          </form>
        </div>
      )}
    </div>
  )
}
