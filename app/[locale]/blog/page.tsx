import type { Metadata } from 'next'
import { Image } from '@/components/site-image'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getBlogPosts } from '@/lib/content-i18n'
import { getDictionary } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/i18n/config'
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
    title: t.blog.metaTitle,
    description: t.blog.metaDescription,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { en: '/en/blog', ar: '/ar/blog', 'x-default': '/en/blog' },
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await primeSiteDataSafely()
  const { locale } = await params
  const t = getDictionary(locale)
  const blogPosts = getBlogPosts(locale as Locale)
  const href = (path: string) => localePath(locale as Locale, path)

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">{t.blog.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t.blog.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            {t.blog.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: t.blog.breadcrumb }]} />

        <div className="mt-10 sm:mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 100}>
              <article className="card-premium group flex h-full flex-col overflow-hidden">
                <Link href={href(`/blog/${post.slug}`)} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <div className="flex min-h-[270px] flex-col p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span className="text-accent">{post.category}</span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="mt-3 font-sans text-lg font-bold leading-snug text-foreground">
                    <Link href={href(`/blog/${post.slug}`)} className="transition-colors hover:text-accent">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                  <Link
                    href={href(`/blog/${post.slug}`)}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
                  >
                    {t.common.readGuide}
                    <ArrowRight className="rtl-flip size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  )
}
