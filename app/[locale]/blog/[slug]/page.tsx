import type { Metadata } from 'next'
import { Image } from '@/components/site-image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { ScrollReveal } from '@/components/scroll-reveal'
import { blogPosts, siteUrl } from '@/lib/content'
import { getBlogPostLocalized } from '@/lib/content-i18n'
import { getDictionary } from '@/lib/i18n'
import { localePath, locales, type Locale } from '@/lib/i18n/config'
import { primeSiteDataSafely } from '@/lib/server/site-data'

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPosts.map((post) => ({ locale, slug: post.slug })))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  await primeSiteDataSafely()
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const post = getBlogPostLocalized(slug, locale as Locale)

  if (!post) {
    return {
      title: t.blog.notFound,
    }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        ar: `/ar/blog/${post.slug}`,
        'x-default': `/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await primeSiteDataSafely()
  const { locale: rawLocale, slug } = await params
  const locale = rawLocale as Locale
  const t = getDictionary(rawLocale)
  const post = getBlogPostLocalized(slug, locale)

  if (!post) notFound()

  const href = (path: string) => localePath(locale, path)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: t.meta.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: t.meta.siteName,
    },
    mainEntityOfPage: `${siteUrl}/${locale}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article>
        <section className="bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:px-8 md:py-28 lg:px-12">
            <p className="eyebrow !text-accent">{post.category}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-primary-foreground/70">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden="true" />
                {new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:px-8 md:py-20 lg:px-12">
          <Breadcrumbs crumbs={[{ label: t.blog.breadcrumb, href: '/blog' }, { label: post.title }]} />

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div>
              <ScrollReveal>
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-secondary">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="mt-10 max-w-prose space-y-6 text-base leading-8 text-muted-foreground">
                  {post.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </ScrollReveal>

              <Link
                href={href('/blog')}
                className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                <ArrowLeft className="rtl-flip size-4" aria-hidden="true" />
                {t.blog.backToBlog}
              </Link>
            </div>

            <ScrollReveal delay={200}>
              <aside className="h-fit rounded-2xl border border-border bg-secondary p-8">
                <p className="eyebrow">{t.blog.sideEyebrow}</p>
                <h2 className="mt-4 text-xl font-800 uppercase tracking-tight text-foreground">
                  {t.blog.sideTitle}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t.blog.sideDesc}
                </p>
                <Link
                  href={href('/contact')}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg btn-primary text-sm"
                >
                  {t.blog.sideCta}
                </Link>
              </aside>
            </ScrollReveal>
          </div>
        </div>
      </article>
      <CtaBanner />
    </>
  )
}
