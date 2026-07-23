import { Wind, Wrench, PenTool, Building2, Factory } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<any>> = {
  wind: Wind,
  wrench: Wrench,
  drill: PenTool,
  building: Building2,
  factory: Factory,
}

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon] ?? Wrench
  return <Icon className={className} strokeWidth={1.5} />
}
