import { NextResponse } from 'next/server'

import { serverClient } from '@/lib/supabase/clients'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Sign in through Supabase Auth.
 *
 * `signInWithPassword` sets the session cookies through the server client, so
 * the response just needs to report success — no token handling here.
 */
export async function POST(request: Request) {
  let email = ''
  let password = ''
  try {
    const body = (await request.json()) as { username?: string; email?: string; password?: string }
    email = (body.email ?? body.username ?? '').trim()
    password = body.password ?? ''
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Enter an email and password.' }, { status: 400 })
  }

  try {
    const supabase = await serverClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Supabase already rate-limits failed attempts and keeps its messages
      // vague about which half was wrong, so pass it through.
      const status = error.status === 400 ? 401 : (error.status ?? 401)
      return NextResponse.json({ ok: false, error: error.message }, { status })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login is not configured.'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
