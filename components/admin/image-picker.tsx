'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageIcon, Loader2, Plus, Search, Upload, X } from 'lucide-react'

import { api, Button, inputClass, useToast } from './ui'

/**
 * Image control used everywhere in the panel.
 *
 * Two ways in: upload a new file, or pick one already in /public/images. The
 * browse list is fetched lazily on first open so the product form doesn't pay
 * for it on every render.
 */

function useLibrary() {
  const [images, setImages] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (images || loading) return
    setLoading(true)
    try {
      const data = await api<{ images: string[] }>('/api/admin/media')
      setImages(data.images)
    } finally {
      setLoading(false)
    }
  }

  return { images, loading, load, invalidate: () => setImages(null) }
}

function LibraryModal({
  onPick,
  onClose,
}: {
  onPick: (path: string) => void
  onClose: () => void
}) {
  const { images, loading, load } = useLibrary()
  const [query, setQuery] = useState('')

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = (images ?? []).filter((src) =>
    src.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
          <h3 className="text-sm font-bold text-zinc-900">Choose an image</h3>
          <div className="relative ms-auto w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name…"
              className={`${inputClass} pl-8`}
            />
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100">
            <X className="size-5" />
          </button>
        </header>

        <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-5 sm:grid-cols-4 md:grid-cols-6">
          {loading && (
            <div className="col-span-full flex items-center justify-center py-12 text-zinc-500">
              <Loader2 className="size-6 animate-spin" />
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-zinc-500">
              No images match that filter.
            </p>
          )}
          {filtered.map((src) => (
            <button
              key={src}
              onClick={() => {
                onPick(src)
                onClose()
              }}
              className="group overflow-hidden rounded-lg border border-zinc-200 transition hover:border-primary hover:shadow-md"
              title={src}
            >
              <span className="flex aspect-square items-center justify-center bg-zinc-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="block truncate border-t border-zinc-100 px-2 py-1 text-[10px] text-zinc-500">
                {src.split('/').pop()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ImagePicker({
  value,
  onChange,
  label = 'Image',
}: {
  value: string
  onChange: (path: string) => void
  label?: string
}) {
  const [browsing, setBrowsing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const { notify } = useToast()

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const data = await api<{ path: string }>('/api/admin/upload', { method: 'POST', body: form })
      onChange(data.path)
      notify('Image uploaded.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Upload failed.', 'error')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
        {label}
      </span>
      <div className="flex items-start gap-3">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <ImageIcon className="size-7 text-zinc-300" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              loading={uploading}
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="size-4" />
              Upload
            </Button>
            <Button type="button" variant="secondary" onClick={() => setBrowsing(true)}>
              <ImageIcon className="size-4" />
              Browse
            </Button>
            {value && (
              <Button type="button" variant="ghost" onClick={() => onChange('')}>
                Clear
              </Button>
            )}
          </div>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/products/example.webp"
            className={inputClass}
          />
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void upload(file)
        }}
      />

      {browsing && <LibraryModal onPick={onChange} onClose={() => setBrowsing(false)} />}
    </div>
  )
}

/** Multi-image variant for product galleries: first image is the thumbnail. */
export function ImageListPicker({
  values,
  onChange,
}: {
  values: string[]
  onChange: (next: string[]) => void
}) {
  const [browsing, setBrowsing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const { notify } = useToast()

  const add = (path: string) => {
    if (!path || values.includes(path)) return
    onChange([...values, path])
  }

  const uploadMany = async (files: FileList) => {
    setUploading(true)
    const added: string[] = []
    try {
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append('file', file)
        const data = await api<{ path: string }>('/api/admin/upload', { method: 'POST', body: form })
        added.push(data.path)
      }
      onChange([...values, ...added.filter((p) => !values.includes(p))])
      notify(`${added.length} image${added.length === 1 ? '' : 's'} uploaded.`)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Upload failed.', 'error')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return
    const next = [...values]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
        Images <span className="text-accent">*</span>
      </span>

      <div className="flex flex-wrap gap-3">
        {values.map((src, index) => (
          <div
            key={src}
            className="group relative size-28 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="size-full object-contain p-1.5" />
            {index === 0 && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                MAIN
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/60 p-1 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                className="rounded px-1.5 text-xs text-white hover:bg-white/20"
                title="Move left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="rounded px-1.5 text-xs text-white hover:bg-white/20"
                title="Remove"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                className="rounded px-1.5 text-xs text-white hover:bg-white/20"
                title="Move right"
              >
                →
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex size-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-300 text-zinc-500 transition hover:border-primary hover:text-primary"
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
          <span className="text-xs font-semibold">Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setBrowsing(true)}
          className="flex size-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-300 text-zinc-500 transition hover:border-primary hover:text-primary"
        >
          <ImageIcon className="size-5" />
          <span className="text-xs font-semibold">Browse</span>
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/webp,image/png,image/jpeg,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void uploadMany(e.target.files)
        }}
      />

      {browsing && <LibraryModal onPick={add} onClose={() => setBrowsing(false)} />}
    </div>
  )
}
