import type { Metadata } from 'next'

import { AdminShell } from '@/components/admin/shell'
import { ToastProvider } from '@/components/admin/ui'
import { getSession } from '@/lib/server/auth'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Super Tech Admin',
  // The panel must never appear in search results.
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts only checks that a session cookie exists; this is where the token
  // is actually verified with Supabase, so a forged cookie gets bounced here.
  const session = await getSession()

  return (
    <html lang="en" className="bg-zinc-100">
      <body className="font-sans antialiased">
        <ToastProvider>
          {/* Signed out, the only reachable page is /admin/login, which renders
              bare. Every protected page calls requireAdmin() and redirects. */}
          {session ? <AdminShell email={session.email}>{children}</AdminShell> : children}
        </ToastProvider>
      </body>
    </html>
  )
}
