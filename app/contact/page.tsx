import type { Metadata } from 'next'
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { contactInfo } from '@/lib/products'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ContactForm } from '@/components/contact-form'
import { ScrollReveal } from '@/components/scroll-reveal'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Super Tech International Construction Materials Co. in Kuwait for quotes, bulk orders, and product inquiries.',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const { product = '' } = await searchParams

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">Get In Touch</p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Contact Super Tech
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            Request a quote, ask about stock, or arrange bulk delivery — our team responds fast.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: 'Contact' }]} />

        <div className="mt-12 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Form */}
          <ScrollReveal className="lg:col-span-3">
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Send Us an Inquiry</h2>
              <p className="mt-3 mb-8 text-sm leading-relaxed text-muted-foreground max-w-prose">
                Fill in the form and we&apos;ll get back to you with pricing and availability.
              </p>
              <ContactForm initialProduct={product} />
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal delay={150} className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-secondary p-8">
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">Contact Details</h2>
              <ul className="mt-6 flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Phone className="size-4 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile</p>
                    <a href={contactInfo.phoneHref} className="text-sm font-semibold text-foreground hover:text-accent">
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Mail className="size-4 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm font-semibold text-foreground hover:text-accent"
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
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                    <a
                      href={contactInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      {contactInfo.address}
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
                Chat on WhatsApp
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
                Super Tech Location Map (Shuwaikh Industrial Area)
              </div>
              <a
                href={contactInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg btn-primary px-4 py-2 text-xs font-bold shadow-sm"
              >
                Open in Google Maps
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <iframe
              title="Super Tech location map — Kuwait City"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4153.25909928476!2d47.94651090000001!3d29.3289452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9ac5d8af9d1b%3A0x898aca45651cdd7f!2sSUPER%20TECH%20INT%E2%80%99L%20CONSTRUCTION%20MATERIALS%20CO!5e1!3m2!1sen!2sin!4v1784449605250!5m2!1sen!2sin"
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
