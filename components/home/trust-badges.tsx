import { ShieldCheck, Handshake, Truck, BadgeCheck } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, label: 'Premium Quality' },
  { icon: Handshake, label: 'Reliable Service' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: BadgeCheck, label: 'Trusted by Professionals' },
]

export function TrustBadges() {
  return (
    <section aria-label="Why customers trust us" className="border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {badges.map((badge, i) => (
          <div
            key={badge.label}
            className={`reveal-up flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-5 sm:py-7 md:py-8 ${
              i < badges.length - 1 ? 'border-r border-border/50' : ''
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
