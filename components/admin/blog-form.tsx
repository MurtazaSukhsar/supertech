'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import type { BlogPost } from '@/lib/content'
import { ImagePicker } from './image-picker'
import { api, Button, Card, Field, inputClass, useToast } from './ui'

export type ArabicBlogPost = {
  title?: string
  description?: string
  category?: string
  readTime?: string
  body?: string[]
}

/** Paragraphs are edited as one textarea, split/joined on blank lines. */
const toText = (body: string[]) => body.join('\n\n')
const fromText = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

const todayIso = () => new Date().toISOString().slice(0, 10)

export function BlogForm({
  post,
  arabic,
}: {
  post?: BlogPost
  arabic?: ArabicBlogPost
}) {
  const router = useRouter()
  const { notify } = useToast()
  const isEdit = Boolean(post)

  const [title, setTitle] = useState(post?.title ?? '')
  const [category, setCategory] = useState(post?.category ?? '')
  const [description, setDescription] = useState(post?.description ?? '')
  const [image, setImage] = useState(post?.image ?? '')
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt ?? todayIso())
  const [readTime, setReadTime] = useState(post?.readTime ?? '')
  const [bodyText, setBodyText] = useState(post ? toText(post.body) : '')
  const [arTitle, setArTitle] = useState(arabic?.title ?? '')
  const [arDescription, setArDescription] = useState(arabic?.description ?? '')
  const [arCategory, setArCategory] = useState(arabic?.category ?? '')
  const [arReadTime, setArReadTime] = useState(arabic?.readTime ?? '')
  const [arBodyText, setArBodyText] = useState(arabic?.body ? toText(arabic.body) : '')
  const [saving, setSaving] = useState(false)

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api('/api/admin/blog', {
        method: 'POST',
        body: JSON.stringify({
          slug: post?.slug,
          originalSlug: post?.slug,
          title,
          category,
          description,
          image,
          publishedAt,
          readTime,
          body: fromText(bodyText),
          arabic: {
            title: arTitle,
            description: arDescription,
            category: arCategory,
            readTime: arReadTime,
            body: fromText(arBodyText),
          },
        }),
      })
      notify(isEdit ? 'Post saved.' : 'Post published.')
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Save failed.', 'error')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-5 pb-24">
      <header className="flex items-center gap-3">
        <Link href="/admin/blog" className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            {isEdit ? 'Edit post' : 'Write a post'}
          </h1>
          {isEdit && <p className="text-xs text-zinc-500">Slug: {post?.slug}</p>}
        </div>
      </header>

      <Card title="Details">
        <div className="space-y-4">
          <Field label="Title" required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="HVAC Materials Checklist for Contractors in Kuwait"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" hint="Shown as the topic label above the title.">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
                placeholder="Air-Conditioning Materials"
              />
            </Field>
            <Field label="Read time">
              <input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className={inputClass}
                placeholder="4 min read"
              />
            </Field>
          </div>

          <Field label="Published date">
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={`${inputClass} sm:w-56`}
            />
          </Field>

          <Field
            label="Short description"
            required
            hint="Used on the blog listing page and as the search-engine meta description."
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </Card>

      <Card title="Cover image">
        <ImagePicker value={image} onChange={setImage} />
      </Card>

      <Card title="Body" description="Separate paragraphs with a blank line.">
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={14}
          className={inputClass}
          placeholder={'First paragraph…\n\nSecond paragraph…'}
          required
        />
      </Card>

      <Card
        title="Arabic translation"
        description="Optional. Left blank, the Arabic site shows the English text."
      >
        <div className="space-y-4" dir="rtl">
          <Field label="العنوان">
            <input value={arTitle} onChange={(e) => setArTitle(e.target.value)} className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="التصنيف">
              <input
                value={arCategory}
                onChange={(e) => setArCategory(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="مدة القراءة">
              <input
                value={arReadTime}
                onChange={(e) => setArReadTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="الوصف">
            <textarea
              value={arDescription}
              onChange={(e) => setArDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="المحتوى">
            <textarea
              value={arBodyText}
              onChange={(e) => setArBodyText(e.target.value)}
              rows={10}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-3xl justify-end gap-2">
          <Link href="/admin/blog">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={saving}>
            {isEdit ? 'Save changes' : 'Publish post'}
          </Button>
        </div>
      </div>
    </form>
  )
}
