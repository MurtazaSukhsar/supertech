'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'

export function MobileQuoteButton() {
  const { t, href, isRtl } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Link
      href={href('/contact')}
      className={`fixed bottom-4 z-40 inline-flex h-11 items-center gap-2 rounded-full btn-primary px-4 text-sm shadow-lg md:hidden transition-all duration-300 ${
        isRtl ? 'right-4' : 'left-4'
      } ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
      aria-label={t.common.requestQuote}
    >
      <Mail className="size-4" aria-hidden="true" />
      {t.common.getQuote}
    </Link>
  )
}
