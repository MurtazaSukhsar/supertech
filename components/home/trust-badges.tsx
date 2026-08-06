'use client'

import { ShieldCheck, Handshake, Truck, BadgeCheck } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'

export function TrustBadges() {
  const { t, isRtl } = useI18n()

  const badges = [
    { icon: ShieldCheck, label: t.home.trustPremium },
    { icon: Handshake, label: t.home.trustReliable },
    { icon: Truck, label: t.home.trustFast },
    { icon: BadgeCheck, label: t.home.trustProfessionals },
  ]

  return (
    <section aria-label={t.home.trustWhyLabel} className="border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {badges.map((badge, i) => (
          <div
            key={badge.label}
            className={`reveal-up flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-5 sm:py-7 md:py-8 ${
              i < badges.length - 1
                ? isRtl
                  ? 'border-l border-border/50'
                  : 'border-r border-border/50'
                : ''
            }`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary shrink-0">
              <badge.icon className="size-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-foreground md:text-sm">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
