import { NextResponse } from 'next/server'

import { serverClient } from '@/lib/supabase/clients'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = await serverClient()
    await supabase.auth.signOut()
  } catch {
    // Already signed out, or the env vars are missing — either way the caller
    // ends up on the login page, which is the intent.
  }
  return NextResponse.json({ ok: true })
}
