import { CheckCircle2, CalendarDays, Layers, Globe2 } from 'lucide-react'
import { AnimatedCounter } from '@/components/animated-counter'
import { ScrollReveal } from '@/components/scroll-reveal'

const stats = [
  { icon: CheckCircle2, value: 500, suffix: '+', label: 'Projects Delivered' },
  { icon: CalendarDays, value: 8, suffix: '+', label: 'Years in Kuwait' },
  { icon: Layers, value: 5000, suffix: '+', label: 'Products in Stock' },
  { icon: Globe2, value: 30, suffix: '+', label: 'Global Brand Partners' },
]

export function StatsCounter() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 surface-grid opacity-[0.06]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28 lg:px-12">
        <ScrollReveal variant="fade-up">
          <div className="mb-14 text-center">
            <p className="eyebrow !text-accent">By the Numbers</p>
            <h2 className="mt-3 section-heading !text-primary-foreground">
              Scale You Can Count On
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} variant="rotate-in-3d" className="h-full">
              <div className="group flex h-full flex-col items-center justify-center gap-3.5 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-7 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:bg-primary-foreground/10 hover:shadow-2xl hover:shadow-accent/10 md:p-9">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25">
                  <stat.icon className="size-7 text-white" strokeWidth={1.5} />
                </div>
                <p className="font-display text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={2200}
                  />
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/75 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
