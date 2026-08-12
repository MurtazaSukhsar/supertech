'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import emailjs from '@emailjs/browser'
import { Send, MessageCircle, Loader2 } from 'lucide-react'
import { contactInfo } from '@/lib/products'
import { useQuote } from '@/context/quote-context'
import { useI18n } from '@/components/i18n-provider'

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? ''
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
const EMAILJS_AUTOREPLY_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID ?? ''
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''

export function ContactForm({ initialProduct = '' }: { initialProduct?: string }) {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const isBasketQuote = searchParams.get('quote') === 'basket'
  const { getFormattedQuoteText, items } = useQuote()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [submitType, setSubmitType] = useState<'email' | 'whatsapp'>('email')

  useEffect(() => {
    if (isBasketQuote && items.length > 0) {
      setSubject(`${t.form.bulkQuoteRequest} (${items.length})`)
      setMessage(getFormattedQuoteText())
    } else if (initialProduct) {
      setSubject(`${t.form.quoteRequestFor} ${initialProduct}`)
      setMessage(
        `${t.form.greetingQuote} ${initialProduct}\n\n${t.form.quantityNeeded}: `,
      )
    }
  }, [isBasketQuote, initialProduct, items, getFormattedQuoteText, t])

  function resetForm() {
    setName('')
    setEmail('')
    setPhone('')
    setSubject('')
    setMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return

    const resolvedSubject = subject || t.form.bulkQuoteRequest

    if (submitType === 'whatsapp') {
      const waBody = `*${resolvedSubject}*\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
      window.open(`${contactInfo.whatsappHref}?text=${encodeURIComponent(waBody)}`, '_blank')
      setStatus('sent')
      return
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS environment variables are not configured.')
      setStatus('error')
      return
    }

    const params = {
      from_name: name,
      from_email: email,
      reply_to: email,
      phone: phone || '—',
      subject: resolvedSubject,
      message,
      to_email: contactInfo.email,
      sent_at: new Date().toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kuwait',
      }),
    }

    setStatus('sending')
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      setStatus('sent')
      resetForm()

      // Confirmation to the customer. Deliberately not awaited into the success
      // path: if it fails, the enquiry still reached us, so the visitor should
      // not be shown an error.
      if (EMAILJS_AUTOREPLY_TEMPLATE_ID) {
        emailjs
          .send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, params, {
            publicKey: EMAILJS_PUBLIC_KEY,
          })
          .catch((err) => console.error('EmailJS auto-reply failed:', err))
      }
    } catch (err) {
      console.error('EmailJS send failed:', err)
      setStatus('error')
    }
  }

  const inputClass =
    'h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-sm'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {isBasketQuote && items.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 text-xs font-semibold text-foreground">
          <ShoppingBagIcon className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-bold text-accent">{t.quote.drawerTitle}</p>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? t.quote.itemCount : t.quote.itemCountPlural}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t.form.name}
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={t.form.namePlaceholder}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t.form.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder={t.form.emailPlaceholder}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t.form.phone}
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder={t.form.phonePlaceholder}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t.form.subject}
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
            placeholder={t.form.subjectPlaceholder}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground">
          {t.form.message}
        </label>
        <textarea
          id="message"
          required
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-sm font-mono text-xs"
          placeholder={t.form.messagePlaceholder}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button
          type="submit"
          onClick={() => setSubmitType('email')}
          disabled={status === 'sending'}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2.5 rounded-lg btn-primary px-6 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {status === 'sending' ? t.form.sending : t.form.sendEmail}
        </button>
        <button
          type="submit"
          onClick={() => setSubmitType('whatsapp')}
          disabled={status === 'sending'}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2.5 rounded-lg bg-[#25D366] text-white hover:bg-[#128C7E] px-6 text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {t.form.sendWhatsApp}
        </button>
      </div>
      {status === 'sent' && (
        <p role="status" className="text-sm font-medium text-accent">
          {t.form.sentTitle}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {t.form.errorTitle}{' '}
          <a href={contactInfo.whatsappHref} target="_blank" rel="noopener noreferrer" className="underline">
            {t.form.sendWhatsApp}
          </a>
        </p>
      )}
    </form>
  )
}
