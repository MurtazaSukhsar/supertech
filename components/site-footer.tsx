import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { categories, contactInfo } from '@/lib/products'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:px-8 md:py-20 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand col */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block" aria-label="Super Tech home">
              <div className="inline-flex rounded-xl bg-white p-3 sm:p-3.5 shadow-md">
                <Image
                  src="/images/logo.jpg"
                  alt="Super Tech logo"
                  width={320}
                  height={167}
                  className="h-18 sm:h-22 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/75">
              Kuwait&apos;s reliable supplier for air-conditioning materials, hardware, hand and power tools,
              construction materials, and industrial equipment.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Product Categories</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-5 flex flex-col gap-4">
              <li>
                <a
                  href={contactInfo.phoneHref}
                  className="flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={contactInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {contactInfo.address}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href={contactInfo.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/8 transition-all hover:bg-accent hover:scale-105"
              >
                <InstagramIcon className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} {contactInfo.companyName} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
