'use client'

import Link from 'next/link'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { getBlogPosts, getFaqs } from '@/lib/content-i18n'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useI18n } from '@/components/i18n-provider'

export function SeoContent() {
  const { t, locale, href } = useI18n()
  const blogPosts = getBlogPosts(locale)
  const faqs = getFaqs(locale)

  return (
    <section className="bg-surface-alt">
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <ScrollReveal variant="fade-left">
              <div className="mb-10">
                <p className="eyebrow">{t.home.guidesEyebrow}</p>
                <h2 className="section-heading mt-3">{t.home.guidesTitle}</h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
              {blogPosts.slice(0, 3).map((post, i) => (
                <ScrollReveal key={post.slug} delay={i * 90} variant="fade-left">
                  <Link
                    href={href(`/blog/${post.slug}`)}
                    className="card-premium group block p-6"
                  >
                    <p className="eyebrow text-[0.65rem]">{post.category}</p>
                    <h3 className="mt-2 font-sans text-base font-bold leading-snug text-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      {t.common.readGuide}
                      <ArrowRight className="rtl-flip size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal delay={120} variant="fade-right">
            <aside className="h-fit rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
                <HelpCircle className="size-6 text-accent" aria-hidden="true" />
              </div>
              <p className="eyebrow mt-6">{t.home.faqSideEyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-foreground">
                {t.home.faqSideTitle}
              </h2>
              <div className="mt-6 space-y-5">
                {faqs.slice(0, 3).map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-sans text-sm font-bold text-foreground">{faq.question}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <Link
                href={href('/faq')}
                className="mt-8 inline-flex h-11 items-center justify-center rounded-lg btn-primary px-6 text-sm"
              >
                {t.home.faqSideCta}
              </Link>
            </aside>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
