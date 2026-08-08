'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

import type { SiteData } from '@/lib/server/store'
import { ImagePicker } from './image-picker'
import { api, Button, Card, Field, inputClass, useToast } from './ui'

const CONTACT_FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: 'companyName', label: 'Company name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'email', label: 'Email address' },
  { key: 'phone', label: 'Phone number', hint: 'The call and WhatsApp links update automatically.' },
  { key: 'address', label: 'Address' },
  { key: 'googleMapsUrl', label: 'Google Maps link' },
  { key: 'instagramHref', label: 'Instagram link' },
]

const IMAGE_FIELDS: { key: string; label: string; hint: string }[] = [
  { key: 'heroBackground', label: 'Hero background', hint: 'Full-width image behind the homepage headline.' },
  { key: 'logo', label: 'Logo', hint: 'Header and footer.' },
  { key: 'aboutFacility', label: 'About page photo', hint: 'Shown beside the About copy.' },
  { key: 'ctaBackground', label: 'CTA banner background', hint: 'Bottom-of-homepage call to action.' },
]

export function SiteSettings({ site }: { site: SiteData }) {
  const [contact, setContact] = useState(site.contact)
  const [images, setImages] = useState(site.images)
  const [saving, setSaving] = useState(false)
  const { notify } = useToast()

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api('/api/admin/site', {
        method: 'POST',
        body: JSON.stringify({ contact, images }),
      })
      notify('Site settings saved.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Save failed.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-5 pb-24">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Site &amp; contact</h1>
        <p className="text-sm text-zinc-500">
          Used across the header, footer, contact page, WhatsApp button, and search listings.
        </p>
      </header>

      <Card title="Contact details">
        <div className="grid gap-4 sm:grid-cols-2">
          {CONTACT_FIELDS.map(({ key, label, hint }) => (
            <Field key={key} label={label} hint={hint}>
              <input
                value={String(contact[key] ?? '')}
                onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
          Call link: <code>{contact.phoneHref}</code> · WhatsApp: <code>{contact.whatsappHref}</code>
        </p>
      </Card>

      <Card title="Site images" description="Swap the main photography without touching code.">
        <div className="space-y-5">
          {IMAGE_FIELDS.map(({ key, label, hint }) => (
            <div key={key}>
              <ImagePicker
                label={label}
                value={String(images[key] ?? '')}
                onChange={(path) => setImages({ ...images, [key]: path })}
              />
              <p className="mt-1 text-xs text-zinc-500">{hint}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-3xl justify-end">
          <Button type="submit" loading={saving}>
            <Save className="size-4" />
            Save settings
          </Button>
        </div>
      </div>
    </form>
  )
}
