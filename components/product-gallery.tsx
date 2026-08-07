'use client'

import { useState, useEffect } from 'react'
import { Image } from '@/components/site-image'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [isCrossFading, setIsCrossFading] = useState(false)
  const [wiped, setWiped] = useState(false)

  // Trigger mask-wipe unveil on page load
  useEffect(() => {
    const timer = setTimeout(() => setWiped(true), 80)
    return () => clearTimeout(timer)
  }, [])

  // Smooth cross-fade on thumbnail selection
  function handleSelectThumbnail(index: number) {
    if (index === active) return
    setIsCrossFading(true)
    setActive(index)
    const timer = setTimeout(() => setIsCrossFading(false), 250)
  }

  const currentImage = images[active] || '/placeholder.svg'

  return (
    <div className="flex flex-col gap-4">
      {/* Main image container */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm cursor-default"
        style={{
          clipPath: wiped
            ? 'polygon(-20% -20%, 140% -20%, 140% 140%, -20% 140%)'
            : 'polygon(-20% -20%, -20% -20%, -20% 140%, -20% 140%)',
          transition: 'clip-path 550ms cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <Image
          src={currentImage}
          alt={`${name} — main image`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain p-4 transition-transform duration-500 ease-out scale-100 ${
            isCrossFading ? 'opacity-30' : 'opacity-100'
          }`}
        />
      </div>

      {/* Thumbnails with animated active ring */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((img, i) => {
            const isSelected = i === active
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectThumbnail(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={isSelected}
                className="relative aspect-square overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Image
                  src={img || '/placeholder.svg'}
                  alt={`${name} thumbnail ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />

                <div
                  className={`absolute inset-0 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-accent shadow-md shadow-accent/25 scale-100 opacity-100'
                      : 'border-transparent opacity-0 hover:border-accent/40 hover:opacity-100'
                  }`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
