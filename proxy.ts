import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.(.*)$/
const MAIN_SITE_URL = 'https://supertechint.com.kw'
const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_DOMAIN?.toLowerCase() || ''

function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale
  }

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
  const hostname = request.nextUrl.hostname.toLowerCase()

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminHost = Boolean(ADMIN_HOST) && hostname === ADMIN_HOST

  // Admin is only available on the dedicated admin domain.
  // On the public site, /admin and every nested admin URL redirect home.
  if (isAdminPath && !isAdminHost) {
    return NextResponse.redirect(new URL('/', MAIN_SITE_URL))
  }

  // On the dedicated admin domain, keep the admin routes working normally.
  if (isAdminPath && isAdminHost) {
    if (pathname === '/admin/login') return NextResponse.next()

    const hasSupabaseSession = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'))

    if (!hasSupabaseSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = `?next=${encodeURIComponent(pathname)}`
      return NextResponse.redirect(url)
    }

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
