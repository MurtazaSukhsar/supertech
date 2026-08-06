import { Quote } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'

const testimonials = [
  {
    quote:
      'Super Tech has been our go-to supplier for three years. Their stock levels and delivery speed keep our HVAC installations on schedule across multiple sites in Kuwait.',
    name: 'Ahmed Al-Rashidi',
    role: 'Operations Manager',
    company: 'Gulf Cooling Systems',
  },
  {
    quote:
      'We order copper pipes, insulation, and hardware in bulk every month. The pricing is competitive, and the team always confirms availability before we commit.',
    name: 'Faisal Hamed',
    role: 'Procurement Lead',
    company: 'Al Salam Contracting',
  },
  {
    quote:
      'What sets Super Tech apart is the one-stop range — tools, construction materials, and A/C supplies all from a single supplier. Saves us time coordinating with multiple vendors.',
    name: 'Nasser Al-Mutairi',
    role: 'Site Supervisor',
    company: 'KME Engineering',
  },
]

export function Testimonials() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
      <ScrollReveal variant="fade-up">
        <div className="mb-14 text-center">
          <p className="eyebrow">What Our Clients Say</p>
          <h2 className="section-heading mt-3">Trusted by Contractors Across Kuwait</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 120} variant="rotate-in-3d" className="h-full">
            <blockquote className="card-premium flex h-full flex-col p-8">
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <Quote className="size-5 text-accent" aria-hidden="true" />
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.role}, {t.company}
                </p>
              </div>
            </blockquote>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
