'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { api, Button, Field, inputClass } from './ui'

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      router.push(next && next.startsWith('/admin') ? next : '/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          autoFocus
          className={inputClass}
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      {error && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
    </form>
  )
}
