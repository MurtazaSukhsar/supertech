'use client'

import Image from 'next/image'
import Link from 'next/link'

// Clean product showcase images from across all categories
const showcaseProducts = [
  { name: 'Seamless Soft Copper Pipe Coil', image: '/images/products/copper-coil.jpeg', href: '/products/copper-coil' },
  { name: 'Thermally Insulated Flexible Duct', image: '/images/products/insulated-flexible-duct.jpeg', href: '/products/insulated-flexible-duct' },
  { name: 'GI Universal Pipe Clamp', image: '/images/products/gi-universal-clamp.jpeg', href: '/products/gi-universal-clamp' },
  { name: '20V Cordless Brushless Drill Driver', image: '/images/products/cordless-drill.png', href: '/products/cordless-drill-20v' },
  { name: 'Slotted Metal Strut Channel', image: '/images/products/slotted-channel.jpeg', href: '/products/slotted-channel' },
  { name: '100L Industrial Air Compressor', image: '/images/products/air-compressor.png', href: '/products/air-compressor-100l' },
  { name: 'UPVC Pipe Fittings', image: '/images/products/upvc-fitting.jpeg', href: '/products/upvc-fitting' },
  { name: 'Industrial Plug & Socket Connector', image: '/images/products/industrial-socket.jpeg', href: '/products/industrial-socket' },
  { name: 'Hard Drawn Copper Pipe', image: '/images/products/copper-pipe.jpeg', href: '/products/copper-pipe' },
  { name: 'Aeroduct Flexible Duct Connector', image: '/images/products/aeroduct-flexible-connector.jpeg', href: '/products/aeroduct-flexible-connector' },
  { name: 'Rubber Lined Pipe Clamp', image: '/images/products/rubber-lined-clamp.jpeg', href: '/products/rubber-lined-clamp' },
  { name: '5" Industrial Angle Grinder', image: '/images/products/angle-grinder.png', href: '/products/angle-grinder-5in' },
  { name: 'Fischer Steel Drop-In Anchor Box', image: '/images/products/fischer-drop-in-anchor-box.jpeg', href: '/products/fischer-drop-in-anchor-box' },
  { name: 'Inverter MIG/TIG/MMA Welder 250A', image: '/images/products/welding-machine.png', href: '/products/mig-welding-machine-250a' },
  { name: 'Weldfix UPVC & CPVC Solvent Cement', image: '/images/products/weldfix-upvc-cement.jpeg', href: '/products/weldfix-upvc-cement' },
  { name: 'PVC Electrical Circular Junction Box', image: '/images/products/pvc-electrical-conduit-box.jpeg', href: '/products/pvc-electrical-conduit-box' },
  { name: 'Wrot Copper Fittings Set', image: '/images/products/copper-fitting.jpeg', href: '/products/copper-fitting' },
  { name: 'Water-Based HVAC Duct Sealant', image: '/images/products/duct-sealant.jpeg', href: '/products/duct-sealant' },
  { name: 'Galvanized Hex Bolts & Rods', image: '/images/products/galvanized-fasteners.jpeg', href: '/products/galvanized-fasteners' },
  { name: '24-Piece Combination Wrench Set', image: '/images/products/wrench-set.png', href: '/products/combination-wrench-set' },
  { name: 'GI Unistrut Cantilever Bracket', image: '/images/products/gi-unistrut-channel-bracket.jpeg', href: '/products/gi-unistrut-channel-bracket' },
  { name: 'Brass Heavy-Duty Gate Valve', image: '/images/products/brass-gate-valve.jpeg', href: '/products/brass-gate-valve' },
  { name: 'PVC Coated Flexible Conduit Pipe', image: '/images/products/pvc-coated-flexible-conduit.jpeg', href: '/products/pvc-coated-flexible-conduit' },
]

export function CategorySlideshow() {
  // Duplicate array for seamless infinite marquee loop
  const slides = [...showcaseProducts, ...showcaseProducts]

  return (
    <section className="relative overflow-hidden bg-primary py-8 transition-colors duration-300">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)]" />

      {/* Infinite marquee slider */}
      <div className="flex w-max animate-marquee space-x-6 hover:[animation-play-state:paused]">
        {slides.map((prod, idx) => (
          <Link
            key={`${prod.href}-${idx}`}
            href={prod.href}
            className="group relative flex h-48 w-56 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-2xl"
          >
            <div className="relative h-full w-full">
              <Image
                src={prod.image}
                alt={prod.name}
                fill
                sizes="224px"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
