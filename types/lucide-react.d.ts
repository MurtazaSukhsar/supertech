declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react'

  export type LucideProps = SVGProps<SVGSVGElement> & {
    color?: string
    size?: string | number
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = ComponentType<LucideProps>

  // Wildcard fallback index signature for all Lucide icons
  const icons: { [key: string]: LucideIcon }
  export default icons

  export const AlertTriangle: LucideIcon
  export const Copy: LucideIcon
  export const Fan: LucideIcon
  export const FolderTree: LucideIcon
  export const Images: LucideIcon
  export const ImageIcon: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const Loader2: LucideIcon
  export const LogOut: LucideIcon
  export const Package: LucideIcon
  export const Save: LucideIcon
  export const Settings: LucideIcon
  export const Star: LucideIcon
  export const Type: LucideIcon
  export const ChevronUp: LucideIcon
  export const Droplets: LucideIcon
  export const PenTool: LucideIcon
  export const Zap: LucideIcon
  export const Waves: LucideIcon
  export const Box: LucideIcon
  export const Paperclip: LucideIcon
  export const Building: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const BadgeCheck: LucideIcon
  export const Boxes: LucideIcon
  export const Building2: LucideIcon
  export const CalendarDays: LucideIcon
  export const Check: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const Clock: LucideIcon
  export const Download: LucideIcon
  export const Drill: LucideIcon
  export const ExternalLink: LucideIcon
  export const Eye: LucideIcon
  export const Factory: LucideIcon
  export const Filter: LucideIcon
  export const Globe2: LucideIcon
  export const Handshake: LucideIcon
  export const HelpCircle: LucideIcon
  export const Image: LucideIcon
  export const Layers: LucideIcon
  export const Mail: LucideIcon
  export const MapPin: LucideIcon
  export const Maximize2: LucideIcon
  export const Menu: LucideIcon
  export const MessageCircle: LucideIcon
  export const Minus: LucideIcon
  export const Pencil: LucideIcon
  export const Phone: LucideIcon
  export const Plus: LucideIcon
  export const Quote: LucideIcon
  export const RotateCcw: LucideIcon
  export const Search: LucideIcon
  export const Send: LucideIcon
  export const ShieldCheck: LucideIcon
  export const ShoppingBag: LucideIcon
  export const SlidersHorizontal: LucideIcon
  export const Sparkles: LucideIcon
  export const Trash: LucideIcon
  export const Trash2: LucideIcon
  export const Truck: LucideIcon
  export const Upload: LucideIcon
  export const Wind: LucideIcon
  export const Wrench: LucideIcon
  export const X: LucideIcon
}
