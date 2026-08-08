'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ExternalLink,
  FolderTree,
  HelpCircle,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Type,
  X,
} from 'lucide-react'

import { api } from './ui'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/content', label: 'Page text', icon: Type },
  { href: '/admin/site', label: 'Site & contact', icon: Settings },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/media', label: 'Media', icon: Images },
]

export function AdminShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => null)
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile bar */}
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-primary px-4 py-3 text-white lg:hidden">
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <span className="text-sm font-bold">Super Tech Admin</span>
      </div>

      <aside
        className={`${open ? 'block' : 'hidden'} w-full shrink-0 bg-primary text-white lg:block lg:min-h-screen lg:w-60`}
      >
        <div className="hidden px-5 py-5 lg:block">
          <p className="text-sm font-black uppercase tracking-wide">Super Tech</p>
          <p className="text-xs text-white/60">Admin panel</p>
        </div>

        <nav className="space-y-0.5 p-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-4 space-y-1 border-t border-white/10 p-3 lg:mt-auto">
          <Link
            href="/en"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4" />
            View site
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
          <p className="px-3 pt-2 text-xs text-white/40">Signed in as {email}</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
