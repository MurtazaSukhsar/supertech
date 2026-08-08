import { NextResponse } from 'next/server'

import { getSession } from './auth'

/** Shared plumbing for the /api/admin routes. */

export const jsonError = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: message }, { status })

export const jsonOk = <T,>(data: T) => NextResponse.json({ ok: true, ...data })

/**
 * Wrap an admin handler so every route gets the same auth gate and the same
 * error shape, instead of each one re-implementing both.
 */
export function withAdmin<T extends unknown[]>(
  handler: (request: Request, ...rest: T) => Promise<Response>,
) {
  return async (request: Request, ...rest: T): Promise<Response> => {
    const session = await getSession()
    if (!session) return jsonError('Not signed in.', 401)
    try {
      return await handler(request, ...rest)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected server error.'
      console.error('[admin api]', message)
      return jsonError(message, 500)
    }
  }
}

export async function readBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    throw new Error('Request body was not valid JSON.')
  }
}
