'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, Loader2, Search, Trash2, Upload } from 'lucide-react'

import { api, Button, inputClass, useToast } from './ui'

export function MediaManager() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const { notify } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const data = await api<{ images: string[] }>('/api/admin/media')
      setImages(data.images)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not load images.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const upload = async (files: FileList) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append('file', file)
        await api('/api/admin/upload', { method: 'POST', body: form })
      }
      notify(`${files.length} image${files.length === 1 ? '' : 's'} uploaded.`)
      await load()
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Upload failed.', 'error')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const remove = async (src: string) => {
    try {
      await api(`/api/admin/media?path=${encodeURIComponent(src)}`, { method: 'DELETE' })
      setImages((prev) => prev.filter((i) => i !== src))
      notify('Image deleted.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Delete failed.', 'error')
    }
  }

  const filtered = images.filter((src) => src.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Media</h1>
          <p className="text-sm text-zinc-500">
            {images.length} images in the library. Images still used on the site cannot be deleted.
          </p>
        </div>
        <Button loading={uploading} onClick={() => fileInput.current?.click()}>
          <Upload className="size-4" />
          Upload images
        </Button>
      </header>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by filename…"
          className={`${inputClass} pl-9`}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-zinc-400">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {filtered.map((src) => (
            <div
              key={src}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              <div className="flex aspect-square items-center justify-center bg-zinc-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex items-center gap-1 border-t border-zinc-100 px-2 py-1.5">
                <span className="flex-1 truncate text-[10px] text-zinc-500" title={src}>
                  {src.split('/').pop()}
                </span>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(src)
                    notify('Path copied.')
                  }}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                  title="Copy path"
                >
                  <Copy className="size-3.5" />
                </button>
                <button
                  onClick={() => remove(src)}
                  className="rounded p-1 text-zinc-400 hover:bg-accent/10 hover:text-accent"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-16 text-center text-sm text-zinc-500">
              No images match that filter.
            </p>
          )}
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/webp,image/png,image/jpeg,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void upload(e.target.files)
        }}
      />
    </div>
  )
}
