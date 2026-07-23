import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ScrollReveal } from '@/components/scroll-reveal'
import { blogPosts } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Buying guides and practical advice for air-conditioning materials, hardware supplies, construction materials, tools, and industrial equipment in Kuwait.',
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="eyebrow !text-accent">Resource Center</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Buying Guides for Kuwait Contractors
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            Practical product advice for HVAC, construction, maintenance, and industrial purchasing teams.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: 'Blog' }]} />

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 100}>
              <article className="card-premium group flex h-full flex-col overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
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
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="mt-3 font-sans text-lg font-bold leading-snug text-foreground">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
                  >
                    Read Guide
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
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
