import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The three Supabase clients this app needs, and when to use each.
 *
 *  browserClient — anon key, runs in the browser. Read-only in practice: RLS
 *    grants SELECT and defines no write policies.
 *
 *  serverClient  — anon key + the request's cookies. Used for auth (who is
 *    signed in) and for reads in server components.
 *
 *  adminClient   — service_role key, server only. Bypasses RLS, so it is the
 *    only way writes happen. Never import this into a client component; the
 *    key would end up in the browser bundle.
 */

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `${name} is missing. Add it to .env.local — see docs/SUPABASE-SETUP.md.`,
    )
  }
  return value
}

export const supabaseUrl = () => required('NEXT_PUBLIC_SUPABASE_URL')
export const supabaseAnonKey = () => required('NEXT_PUBLIC_SUPABASE_ANON_KEY')

export function browserClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey())
}

/**
 * Server client bound to the incoming request's cookies so Supabase Auth can
 * read and refresh the session.
 *
 * `cookies()` is imported lazily because this module is also reachable from
 * the browser bundle through `browserClient`.
 */
export async function serverClient(): Promise<SupabaseClient> {
  const { cookies } = await import('next/headers')
  const store = await cookies()

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) {
            store.set(name, value, options)
          }
        } catch {
          // Called from a server component, where cookies are read-only.
          // The proxy refreshes the session instead, so this is safe to ignore.
        }
      },
    },
  })
}

let cachedAdmin: SupabaseClient | null = null

export function adminClient(): SupabaseClient {
  if (cachedAdmin) return cachedAdmin
  const url = supabaseUrl()
  cachedAdmin = createClient(url, required('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cachedAdmin
}
