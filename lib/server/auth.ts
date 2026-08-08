import { redirect } from 'next/navigation'

import { serverClient } from '@/lib/supabase/clients'

/**
 * Admin authentication, backed by Supabase Auth.
 *
 * Sessions live in cookies managed by `@supabase/ssr`, so there is no custom
 * token signing here any more. Admins are created in the Supabase dashboard
 * (Authentication → Users); anyone with a confirmed account can reach the
 * panel, which is why sign-ups are expected to stay disabled in the project's
 * auth settings.
 */

export type AdminSession = {
  id: string
  email: string
}

/** The cookie prefix Supabase uses, for the cheap presence check in proxy.ts. */
export const SUPABASE_COOKIE_PREFIX = 'sb-'

export async function getSession(): Promise<AdminSession | null> {
  try {
    const supabase = await serverClient()
    // getUser() verifies the JWT against Supabase rather than trusting the
    // cookie's contents, which is what makes this safe to gate the panel on.
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return { id: data.user.id, email: data.user.email ?? '' }
  } catch {
    return null
  }
}

/** Server-component guard: bounce to the login page instead of throwing. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

/** True when the Supabase env vars are present, so the login page can explain. */
export function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}
