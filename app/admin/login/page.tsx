import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/admin/login-form'
import { getSession, isConfigured } from '@/lib/server/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const session = await getSession()
  if (session) redirect('/admin')

  const { next } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-black uppercase tracking-tight text-primary">Super Tech</h1>
          <p className="text-sm text-zinc-500">Admin panel</p>
        </div>

        {isConfigured() ? (
          <LoginForm next={next} />
        ) : (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
            <p className="font-bold">Supabase is not connected yet.</p>
            <p className="mt-2">
              Add these to <code className="rounded bg-amber-100 px-1">.env.local</code> from your
              Supabase project&rsquo;s API settings:
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-amber-100 p-2 text-xs">
              {`NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=`}
            </pre>
            <p className="mt-2">
              Then restart the dev server. Full steps are in{' '}
              <code className="rounded bg-amber-100 px-1">docs/SUPABASE-SETUP.md</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
