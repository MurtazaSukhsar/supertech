'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { Faq } from '@/lib/content'
import { ScrollReveal } from '@/components/scroll-reveal'

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="grid gap-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <ScrollReveal key={faq.question} delay={i * 60}>
            <article className="card-premium overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-start gap-4 p-6 text-start transition-colors hover:bg-surface-alt/50"
                aria-expanded={isOpen}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <HelpCircle className="size-5 text-accent" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="font-sans text-base font-bold text-foreground pe-8">
                    {faq.question}
                  </h2>
                </div>
                <ChevronDown
                  className={`mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 ps-20 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </article>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
