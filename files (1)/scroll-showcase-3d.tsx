'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ScrollShowcase3dProps {
  /** 0 → 1 scroll progress through the parent section, updated via ref for perf */
  progressRef: React.RefObject<number>
}

export default function ScrollShowcase3d({ progressRef }: ScrollShowcase3dProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    if (window.innerWidth < 768) return

    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 14)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambient)
    const key = new THREE.DirectionalLight('#0a2472', 1.6)
    key.position.set(8, 12, 10)
    scene.add(key)
    const rim = new THREE.DirectionalLight('#D91E2A', 1.4)
    rim.position.set(-10, -6, 6)
    scene.add(rim)

    // Five objects — one per product division — arranged in a ring
    const ring = new THREE.Group()
    scene.add(ring)

    const defs: { geometry: THREE.BufferGeometry; color: string; wire?: boolean }[] = [
      { geometry: new THREE.TorusGeometry(1.4, 0.42, 8, 20), color: '#0A2472' }, // A/C pipe
      { geometry: new THREE.CylinderGeometry(1.5, 1.5, 0.9, 6), color: '#D91E2A' }, // hardware hex nut
      { geometry: new THREE.ConeGeometry(1.2, 2.2, 8), color: '#475569' }, // tool bit
      { geometry: new THREE.BoxGeometry(1.9, 1.9, 1.9), color: '#0A2472', wire: true }, // construction block
      { geometry: new THREE.CylinderGeometry(1.1, 1.1, 2, 16), color: '#D91E2A' }, // industrial cylinder
    ]

    const radius = 5
    const meshes = defs.map((def, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(def.color),
        roughness: 0.35,
        metalness: 0.75,
        flatShading: true,
        wireframe: !!def.wire,
      })
      const mesh = new THREE.Mesh(def.geometry, material)
      const angle = (i / defs.length) * Math.PI * 2
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.4, Math.sin(angle) * radius)
      ring.add(mesh)
      return mesh
    })

    let raf: number
    function animate() {
      const progress = progressRef.current ?? 0

      // Scroll-driven rotation: a full turn across the section's scroll span
      ring.rotation.y = progress * Math.PI * 2
      ring.rotation.x = 0.15 + progress * 0.3

      // Gentle zoom-in as user scrolls deeper into the section
      camera.position.z = 14 - progress * 3

      meshes.forEach((mesh, i) => {
        mesh.rotation.x += 0.003 + i * 0.0006
        mesh.rotation.y += 0.002
      })

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    function handleResize() {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      meshes.forEach((m) => {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      })
      renderer.dispose()
    }
  }, [progressRef])

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />
}
