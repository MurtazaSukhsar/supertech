import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.(.*)$/

/**
 * The dedicated admin domain, e.g. "supertechintl.in". Set
 * NEXT_PUBLIC_ADMIN_DOMAIN in the environment once that domain is pointed at
 * this deployment.
 *
 * Normalized to a bare hostname (no protocol, no "www.", no trailing slash,
 * lowercase) so it's safe to paste the value with or without those.
 *
 * When this is unset (e.g. `npm run dev` with no .env.local entry), the
 * whole domain split below is disabled and /admin keeps working exactly as
 * it always has — reachable by path, on whatever host is serving the app.
 */
const ADMIN_DOMAIN = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN ?? '')
  .trim()
  .toLowerCase()
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/+$/, '')

const SPLIT_ENABLED = ADMIN_DOMAIN.length > 0

/**
 * Hostname this request actually arrived on, lowercased and stripped of
 * port. Hostinger's Node.js hosting sits behind a reverse proxy, so
 * `x-forwarded-host` (the original external hostname) is checked first;
 * `host` covers direct requests such as local dev.
 */
function getHostname(request: NextRequest): string {
  const raw = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  return raw.split(',')[0]!.trim().toLowerCase().split(':')[0]!
}

function isAdminHostname(hostname: string): boolean {
  if (!SPLIT_ENABLED) return false
  return hostname === ADMIN_DOMAIN || hostname === `www.${ADMIN_DOMAIN}`
}

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

/** Rewrites to `targetPath` only when it actually differs from what was requested. */
function toTarget(request: NextRequest, pathname: string, targetPath: string) {
  if (pathname === targetPath) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = targetPath
  return NextResponse.rewrite(url)
}

/**
 * Existing admin auth gate, unchanged from before the domain split.
 *
 * This only checks that a Supabase session cookie exists; requireAdmin() in
 * each page verifies the JWT with Supabase, so a forged cookie still gets
 * bounced there. This is just a cheap bounce for visitors with no session
 * cookie at all, so an unauthenticated hit never boots a page render.
 *
 * `targetPath` is the real admin route to serve (defaults to `pathname`
 * itself when nothing needs rewriting, e.g. in legacy path-based mode).
 */
function handleAdminAuth(request: NextRequest, pathname: string, targetPath: string = pathname) {
  if (targetPath === '/admin/login') {
    return toTarget(request, pathname, targetPath)
  }

  const hasSupabaseSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'))

  if (!hasSupabaseSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = `?next=${encodeURIComponent(targetPath)}`
    return NextResponse.redirect(url)
  }

  return toTarget(request, pathname, targetPath)
}

/** Existing locale routing, unchanged from before the domain split. */
function handlePublicRouting(request: NextRequest, pathname: string) {
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = getHostname(request)
  const isAdminHost = isAdminHostname(hostname)
  const requestedAdminPath = pathname.startsWith('/admin')

  // The admin API must never be reachable from any hostname except the
  // admin domain, once one is configured. The generic /api skip below would
  // otherwise wave it through unconditionally.
  if (pathname.startsWith('/api/admin') && SPLIT_ENABLED && !isAdminHost) {
    return new NextResponse(null, { status: 404 })
  }

  // Skip Next internals, the rest of the API, and anything that looks like a
  // static file.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Case 1 — no admin domain configured (local dev, or before the env var
  // is set): behave exactly like the original single-domain proxy. /admin
  // is reachable wherever the app is served, gated only by the session check.
  if (!SPLIT_ENABLED) {
    if (requestedAdminPath) {
      return handleAdminAuth(request, pathname)
    }
    return handlePublicRouting(request, pathname)
  }

  // Case 2 — admin domain configured, and this request IS that domain.
  // Everything here is the admin panel: "/" behaves like "/admin", "/login"
  // like "/admin/login", and so on. Paths that already start with "/admin"
  // (every internal link in the panel uses these — see
  // components/admin/shell.tsx) pass through unchanged, which makes this
  // transform idempotent and unable to loop.
  if (isAdminHost) {
    const targetPath = requestedAdminPath ? pathname : `/admin${pathname === '/' ? '' : pathname}`
    return handleAdminAuth(request, pathname, targetPath)
  }

  // Case 3 — admin domain configured, and this is some other hostname (the
  // public site, its www, or anything else). The admin panel does not exist
  // here at all: send visitors to the public homepage.
  if (requestedAdminPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return handlePublicRouting(request, pathname)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)', '/api/admin/:path*'],
}
