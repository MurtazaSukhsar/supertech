import type { Metadata } from 'next'
import { Image } from '@/components/site-image'
import Link from 'next/link'
import { BadgeCheck, Boxes, Globe2, Truck } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { AnimatedCounter } from '@/components/animated-counter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getDictionary } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/i18n/config'
import { siteImages } from '@/lib/products'
import { primeSiteDataSafely } from '@/lib/server/site-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)

  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', ar: '/ar/about', 'x-default': '/en/about' },
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)
  const href = (path: string) => localePath(locale as Locale, path)

  const stats = [
    { icon: Boxes, value: 5000, suffix: '+', label: t.home.statProducts },
    { icon: BadgeCheck, value: 500, suffix: '+', label: t.home.statClients },
    { icon: Truck, value: 24, suffix: 'h', label: t.home.statDelivery },
    { icon: Globe2, value: 30, suffix: '+', label: t.home.statBrands },
  ]

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">{t.about.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t.about.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: t.about.breadcrumb }]} />

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src={siteImages.aboutFacility}
                alt={t.about.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div>
              <h2 className="text-balance text-2xl font-extrabold uppercase tracking-tight text-foreground md:text-3xl">
                {t.about.sectionTitle}
              </h2>
              <div className="mt-6 flex flex-col gap-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed max-w-prose">
                <p>{t.about.para1}</p>
                <p>{t.about.para2}</p>
                <p>{t.about.para3}</p>
                <p>{t.about.para4}</p>
              </div>
              <Link
                href={href('/contact')}
                className="mt-8 inline-flex h-13 items-center rounded-lg btn-primary px-8 text-sm"
              >
                {t.about.cta}
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 md:mt-32 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} className="h-full">
              <div className="card-premium flex h-full flex-col items-center justify-center gap-3 p-4 sm:p-8 text-center md:p-10">
                <stat.icon className="size-7 text-accent" aria-hidden="true" />
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-primary md:text-4xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
                </p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
