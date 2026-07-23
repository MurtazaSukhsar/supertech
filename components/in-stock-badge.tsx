'use client'

export function InStockBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
      <span className="relative flex size-2.5 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-teal-500 opacity-75 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-teal-500" />
      </span>
      <span>{compact ? 'In Stock' : 'In Stock • Ready for Delivery in Kuwait'}</span>
    </div>
  )
}
