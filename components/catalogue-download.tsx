'use client'

import { Download } from 'lucide-react'

import { useI18n } from '@/components/i18n-provider'

/**
 * Public path of the generated catalogue.
 *
 * The file lives in /public so Next serves it directly — no route handler
 * needed. Regenerate it with `scripts/build-catalogue-pdf.py` (see
 * scripts/README-catalogue.md) and overwrite this path; the filename is
 * deliberately stable so existing links and any printed QR codes keep working.
 */
export const CATALOGUE_PATH = '/catalogue/super-tech-product-catalogue.pdf'

/** Appended to the label so buyers know what they are about to download. */
const FILE_META = 'PDF · 2.7 MB'

type Props = {
  /** `solid` for dark backgrounds, `outline` for light ones. */
  variant?: 'solid' | 'outline'
  className?: string
}

export function CatalogueDownload({ variant = 'solid', className = '' }: Props) {
  const { t } = useI18n()

  const base =
    'inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300'
  const skin =
    variant === 'solid'
      ? 'bg-accent text-accent-foreground hover:brightness-110 shadow-md shadow-accent/20'
      : 'border border-border bg-card text-foreground hover:border-accent hover:text-accent'

  return (
    <a
      href={CATALOGUE_PATH}
      /*
       * `download` asks the browser to save rather than open in a viewer,
       * which is what someone clicking "download catalogue" expects. The
       * explicit filename keeps it recognisable in their Downloads folder
       * instead of inheriting the URL slug.
       */
      download="Super-Tech-Product-Catalogue.pdf"
      className={`${base} ${skin} ${className}`}
    >
      <Download className="size-4 shrink-0" aria-hidden="true" />
      <span>{t.catalogue.download}</span>
      {/*
       * File type and weight sit inline rather than on a second line: the
       * two-line layout forced the button tall enough to dominate the page
       * header. Hidden on the narrowest screens where the label alone is
       * already close to the available width.
       */}
      <span className="hidden text-xs font-medium opacity-70 sm:inline">{FILE_META}</span>
    </a>
  )
}
