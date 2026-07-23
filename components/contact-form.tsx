'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send } from 'lucide-react'
import { contactInfo } from '@/lib/products'
import { useQuote } from '@/context/quote-context'

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

export function ContactForm({ initialProduct = '' }: { initialProduct?: string }) {
  const searchParams = useSearchParams()
  const isBasketQuote = searchParams.get('quote') === 'basket'
  const { getFormattedQuoteText, items } = useQuote()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (isBasketQuote && items.length > 0) {
      setSubject(`Bulk Quote Request (${items.length} items)`)
      setMessage(getFormattedQuoteText())
    } else if (initialProduct) {
      setSubject(`Quote request: ${initialProduct}`)
      setMessage(`Hello, I would like to request a quote for: ${initialProduct}\n\nQuantity needed: `)
    }
  }, [isBasketQuote, initialProduct, items, getFormattedQuoteText])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=${encodeURIComponent(
        subject || 'Bulk Quote Request'
      )}&body=${encodeURIComponent(body)}`,
      '_blank'
    )
    setSent(true)
  }

  const inputClass =
    'h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-sm'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {isBasketQuote && items.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 text-xs font-semibold text-foreground">
          <ShoppingBagIcon className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-bold text-accent">Bulk Quote Basket Attached</p>
            <p className="text-muted-foreground">
              {items.length} items from your quote basket have been pre-filled into the message field below.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="+965 ..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-foreground">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
            placeholder="Quote request, bulk order..."
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground">
          Message / Materials List
        </label>
        <textarea
          id="message"
          required
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-sm font-mono text-xs"
          placeholder="Tell us what you need — products, quantities, and delivery location."
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-13 items-center justify-center gap-2.5 rounded-lg btn-primary px-8 text-sm font-bold sm:self-start"
      >
        <Send className="size-4" aria-hidden="true" />
        Send Full Inquiry
      </button>
      {sent && (
        <p role="status" className="text-sm font-medium text-accent">
          Your email client has been opened with your inquiry. You can also reach us directly on WhatsApp at{' '}
          {contactInfo.phone}.
        </p>
      )}
    </form>
  )
}
