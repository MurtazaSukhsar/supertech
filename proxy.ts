import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.(.*)$/

function detectLocale(request: NextRequest): string {
  // 1. Explicit choice saved from the language switcher wins.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale
  }

  // 2. Otherwise fall back to the browser's Accept-Language header.
  const header = request.headers.get('accept-language')
  if (header) {
    const preferred = header
      .split(',')
      .map((part) => {
        const [tag, q] = part.trim().split(';q=')
        return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
      })
      .sort((a, b) => b.q - a.q)

    for (const { tag } of preferred) {
      const base = tag.split('-')[0]
      if ((locales as readonly string[]).includes(base)) {
        return base
      }
    }
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next internals, API routes, and anything that looks like a static file.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
