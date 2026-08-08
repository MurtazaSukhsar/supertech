'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from 'lucide-react'

import type { Faq } from '@/lib/content'
import { api, Button, Card, Field, inputClass, useToast } from './ui'

export function FaqManager({ initial }: { initial: { en: Faq[]; ar: Faq[] } }) {
  const [locale, setLocale] = useState<'en' | 'ar'>('en')
  const [faqs, setFaqs] = useState(initial)
  const [saving, setSaving] = useState(false)
  const { notify } = useToast()

  const list = faqs[locale]
  const setList = (next: Faq[]) => setFaqs({ ...faqs, [locale]: next })

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= list.length) return
    const next = [...list]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setList(next)
  }

  const save = async () => {
    setSaving(true)
    try {
      await api('/api/admin/faqs', {
        method: 'POST',
        body: JSON.stringify({ locale, faqs: list }),
      })
      notify('FAQs saved.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Save failed.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">FAQs</h1>
          <p className="text-sm text-zinc-500">
            Shown on the FAQ page, the homepage sidebar, and as FAQ rich results in Google.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-zinc-300 bg-white p-1">
          {(['en', 'ar'] as const).map((code) => (
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

      <div className="space-y-3" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {list.map((faq, index) => (
          <Card key={index}>
            <div className="flex gap-3">
              <div className="flex flex-col pt-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-zinc-400 transition hover:text-zinc-700 disabled:opacity-25"
                  aria-label="Move up"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === list.length - 1}
                  className="text-zinc-400 transition hover:text-zinc-700 disabled:opacity-25"
                  aria-label="Move down"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                <Field label={locale === 'ar' ? 'السؤال' : 'Question'}>
                  <input
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...list]
                      next[index] = { ...faq, question: e.target.value }
                      setList(next)
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label={locale === 'ar' ? 'الإجابة' : 'Answer'}>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...list]
                      next[index] = { ...faq, answer: e.target.value }
                      setList(next)
                    }}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
              </div>

              <button
                onClick={() => setList(list.filter((_, i) => i !== index))}
                className="h-fit rounded p-2 text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
                title="Remove"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="secondary"
        onClick={() => setList([...list, { question: '', answer: '' }])}
      >
        <Plus className="size-4" />
        Add question
      </Button>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-3xl justify-end">
          <Button onClick={save} loading={saving}>
            <Save className="size-4" />
            Save {locale === 'en' ? 'English' : 'Arabic'} FAQs
          </Button>
        </div>
      </div>
    </div>
  )
}
