import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CtaBanner } from '@/components/home/cta-banner'
import { ScrollReveal } from '@/components/scroll-reveal'
import { blogPosts, getBlogPost, siteUrl } from '@/lib/content'
import { contactInfo } from '@/lib/products'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
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
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: contactInfo.companyName,
    },
    publisher: {
      '@type': 'Organization',
      name: contactInfo.companyName,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article>
        <section className="bg-primary">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28 lg:px-12">
            <p className="eyebrow !text-accent">{post.category}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-primary-foreground/70">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden="true" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 lg:px-12">
          <Breadcrumbs crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

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
                href="/blog"
                className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to Blog
              </Link>
            </div>

            <ScrollReveal delay={200}>
              <aside className="h-fit rounded-2xl border border-border bg-secondary p-8">
                <p className="eyebrow">Need Pricing?</p>
                <h2 className="mt-4 text-xl font-800 uppercase tracking-tight text-foreground">
                  Request a Material Quote
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Send product names, specs, quantities, and delivery location for a fast quote.
                </p>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg btn-primary text-sm"
                >
                  Contact Sales
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
