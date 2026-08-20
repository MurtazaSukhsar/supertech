import type { Metadata } from 'next'
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { contactInfo } from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ContactForm } from '@/components/contact-form'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getDictionary } from '@/lib/i18n'
import { primeSiteDataSafely } from '@/lib/server/site-data'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ product?: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale } = await params
  const { product } = await searchParams
  const t = getDictionary(locale)

  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: '/en/contact', ar: '/ar/contact', 'x-default': '/en/contact' },
    },
    // Every product page links here as /contact?product=<name> to prefill the
    // form. The canonical tag above already points every such variant back
    // at the plain /contact URL, but that only tells Google which version to
    // *show* — it can still crawl and index each ?product= URL as its own
    // thin/duplicate page in the meantime (which is exactly what showed up
    // as ~167 duplicate-title/duplicate-content pages in the SEO audit).
    // noindex is the direct instruction: don't index this variant at all.
    // `follow` is kept so link equity still flows through to whatever the
    // page links to.
    ...(product ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ product?: string }>
}) {
  await primeSiteDataSafely()
  const { locale } = await params
  const { product = '' } = await searchParams
  const t = getDictionary(locale)

  // The embedded map UI follows the page language.
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4153.25909928476!2d47.94651090000001!3d29.3289452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9ac5d8af9d1b%3A0x898aca45651cdd7f!2sSUPER%20TECH%20INT%E2%80%99L%20CONSTRUCTION%20MATERIALS%20CO!5e1!3m2!1s' +
    (locale === 'ar' ? 'ar' : 'en') +
    '!2skw!4v1784449605250'

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">{t.contact.eyebrow}</p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t.contact.title}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: t.contact.breadcrumb }]} />

        <div className="mt-12 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Form */}
          <ScrollReveal className="lg:col-span-3">
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">
                {t.contact.formTitle}
              </h2>
              <p className="mt-3 mb-8 text-sm leading-relaxed text-muted-foreground max-w-prose">
                {t.contact.formSubtitle}
              </p>
              <ContactForm initialProduct={product} />
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal delay={150} className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-secondary p-8">
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">
                {t.contact.detailsTitle}
              </h2>
              <ul className="mt-6 flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Phone className="size-4 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t.contact.labelMobile}
                    </p>
                    <a
                      href={contactInfo.phoneHref}
                      className="ltr-embed block text-sm font-semibold text-foreground hover:text-accent"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Mail className="size-4 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t.contact.labelEmail}
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="ltr-embed block text-sm font-semibold text-foreground hover:text-accent"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <MapPin className="size-4 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t.contact.labelLocation}
                    </p>
                    <a
                      href={contactInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      {t.common.address}
                      <ExternalLink className="size-3.5 text-accent shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              </ul>
              <a
                href={contactInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#25D366]/20"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {t.common.chatOnWhatsApp}
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Map */}
        <ScrollReveal>
          <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 bg-secondary">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {t.contact.mapTitle}
              </div>
              <a
                href={contactInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg btn-primary px-4 py-2 text-xs font-bold shadow-sm"
              >
                {t.contact.openInMaps}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <iframe
              title={t.contact.mapIframeTitle}
              src={mapSrc}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0 h-[250px] sm:h-[350px] md:h-[450px]"
            />
          </div>
        </ScrollReveal>
      </div>
    </>
  )
}
