'use client'

import { useMemo, useState } from 'react'
import { RotateCcw, Save, Search } from 'lucide-react'

import { api, Button, inputClass, useToast } from './ui'

type Plain = Record<string, unknown>

/**
 * Editor over the whole i18n dictionary.
 *
 * Fields are generated from the dictionary shape rather than hand-written, so
 * a string added to `lib/i18n/dictionaries/en.ts` becomes editable here with no
 * change to this file. Only edited values are sent back — the API stores the
 * diff, so untouched labels keep tracking the code.
 */

/** Human labels for the top-level dictionary sections. */
const SECTION_LABELS: Record<string, { title: string; blurb: string }> = {
  meta: { title: 'SEO & meta', blurb: 'Page titles, descriptions, and keywords used by Google.' },
  nav: { title: 'Navigation', blurb: 'Header and menu labels.' },
  home: { title: 'Homepage', blurb: 'Hero, trust badges, stats, why-choose-us, testimonials, CTA.' },
  about: { title: 'About page', blurb: 'Headings and body paragraphs.' },
  products: { title: 'Products page', blurb: 'Titles, filter labels, and sorting options.' },
  productDetail: { title: 'Product detail page', blurb: 'Labels on individual product pages.' },
  categories: { title: 'Category pages', blurb: 'Headings and copy on category listings.' },
  contact: { title: 'Contact page', blurb: 'Form labels, headings, and messages.' },
  faq: { title: 'FAQ page', blurb: 'Page heading and intro. Questions live under FAQs.' },
  blog: { title: 'Blog', blurb: 'Listing and article page labels.' },
  search: { title: 'Search page', blurb: 'Search results labels.' },
  footer: { title: 'Footer', blurb: 'Column headings and legal line.' },
  quote: { title: 'Quote drawer', blurb: 'Labels in the request-a-quote panel.' },
  chatbot: { title: 'Chatbot', blurb: 'Greeting and prompts in the chat widget.' },
  common: { title: 'Shared labels', blurb: 'Buttons and words reused across pages.' },
}

/** Split a camelCase key into a readable label: heroCtaProducts -> Hero cta products. */
function humanize(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function setAtPath(source: Plain, path: string[], value: unknown): Plain {
  const [head, ...rest] = path
  const next: Plain = { ...source }
  next[head] = rest.length === 0 ? value : setAtPath((next[head] as Plain) ?? {}, rest, value)
  return next
}

function getAtPath(source: unknown, path: string[]): unknown {
  return path.reduce<unknown>((acc, key) => (isPlainObject(acc) ? acc[key] : undefined), source)
}

function FieldRow({
  path,
  value,
  original,
  onChange,
}: {
  path: string[]
  value: unknown
  original: unknown
  onChange: (path: string[], value: unknown) => void
}) {
  const label = humanize(path[path.length - 1])
  const changed = JSON.stringify(value) !== JSON.stringify(original)

  // Arrays of strings (keyword lists, bullet lists) edit as one-per-line text.
  if (Array.isArray(value)) {
    return (
      <label className="block">
        <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-zinc-600">
          {label}
          <span className="text-[10px] font-normal text-zinc-400">one per line</span>
          {changed && <span className="rounded bg-amber-100 px-1 text-[10px] text-amber-700">edited</span>}
        </span>
        <textarea
          value={(value as string[]).join('\n')}
          onChange={(e) => onChange(path, e.target.value.split('\n'))}
          rows={Math.min(10, Math.max(3, value.length))}
          className={inputClass}
        />
      </label>
    )
  }

  const text = String(value ?? '')
  const long = text.length > 90

  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-zinc-600">
        {label}
        {changed && (
          <button
            type="button"
            onClick={() => onChange(path, original)}
            className="rounded bg-amber-100 px-1 text-[10px] text-amber-700 hover:bg-amber-200"
            title="Reset to the original wording"
          >
            edited · reset
          </button>
        )}
      </span>
      {long ? (
        <textarea
          value={text}
          onChange={(e) => onChange(path, e.target.value)}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input value={text} onChange={(e) => onChange(path, e.target.value)} className={inputClass} />
      )}
    </label>
  )
}

function Group({
  node,
  original,
  path,
  onChange,
  filter,
}: {
  node: Plain
  original: unknown
  path: string[]
  onChange: (path: string[], value: unknown) => void
  filter: string
}) {
  const entries = Object.entries(node).filter(([key, value]) => {
    if (!filter) return true
    const haystack = `${key} ${typeof value === 'string' ? value : ''}`.toLowerCase()
    if (haystack.includes(filter)) return true
    // Keep a nested group if anything inside it matches.
    return isPlainObject(value) && JSON.stringify(value).toLowerCase().includes(filter)
  })

  if (entries.length === 0) return null

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => {
        const childPath = [...path, key]
        if (isPlainObject(value)) {
          return (
            <fieldset key={key} className="rounded-lg border border-zinc-200 p-4">
              <legend className="px-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                {humanize(key)}
              </legend>
              <Group
                node={value}
                original={getAtPath(original, [key])}
                path={childPath}
                onChange={onChange}
                filter={filter}
              />
            </fieldset>
          )
        }
        return (
          <FieldRow
            key={key}
            path={childPath}
            value={value}
            original={getAtPath(original, [key])}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

export function ContentEditor({
  dictionaries,
  defaults,
}: {
  dictionaries: Record<string, Plain>
  defaults: Record<string, Plain>
}) {
  const [locale, setLocale] = useState('en')
  const [drafts, setDrafts] = useState(dictionaries)
  const [section, setSection] = useState('home')
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)
  const { notify } = useToast()

  const draft = drafts[locale]
  const original = defaults[locale]
  const sections = useMemo(() => Object.keys(draft), [draft])

  const change = (path: string[], value: unknown) =>
    setDrafts((prev) => ({ ...prev, [locale]: setAtPath(prev[locale], path, value) }))

  const dirty = JSON.stringify(drafts[locale]) !== JSON.stringify(dictionaries[locale])

  const save = async () => {
    setSaving(true)
    try {
      await api('/api/admin/content', {
        method: 'POST',
        body: JSON.stringify({ locale, dictionary: drafts[locale] }),
      })
      notify('Text saved. Reload the site to see it.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Save failed.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const resetSection = () => {
    setDrafts((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [section]: defaults[locale][section] },
    }))
  }

  const meta = SECTION_LABELS[section] ?? { title: humanize(section), blurb: '' }
  const node = draft[section]

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Page text</h1>
          <p className="text-sm text-zinc-500">
            Every heading, button, and paragraph on the site. Edits show up on reload.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-zinc-300 bg-white p-1">
          {Object.keys(dictionaries).map((code) => (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={`rounded px-3 py-1 text-sm font-semibold transition ${
                locale === code ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {code === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className={`${inputClass} w-auto min-w-48`}
        >
          {sections.map((key) => (
            <option key={key} value={key}>
              {SECTION_LABELS[key]?.title ?? humanize(key)}
            </option>
          ))}
        </select>

        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find text on this section…"
            className={`${inputClass} pl-9`}
          />
        </div>

        <Button variant="secondary" onClick={resetSection} type="button">
          <RotateCcw className="size-4" />
          Reset section
        </Button>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <header className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-bold text-zinc-900">{meta.title}</h2>
          {meta.blurb && <p className="mt-0.5 text-xs text-zinc-500">{meta.blurb}</p>}
        </header>
        <div className="p-5" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {isPlainObject(node) ? (
            <Group
              node={node}
              original={original[section]}
              path={[section]}
              onChange={change}
              filter={filter.trim().toLowerCase()}
            />
          ) : (
            <FieldRow
              path={[section]}
              value={node}
              original={original[section]}
              onChange={change}
            />
          )}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            {dirty ? 'Unsaved changes' : 'All changes saved'}
          </p>
          <Button onClick={save} loading={saving} disabled={!dirty}>
            <Save className="size-4" />
            Save {locale === 'en' ? 'English' : 'Arabic'} text
          </Button>
        </div>
      </div>
    </div>
  )
}
