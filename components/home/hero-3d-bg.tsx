'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3dBg() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Accessibility check - Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // 2. Mobile performance check - Disable WebGL on small screens to save resources
    if (window.innerWidth < 768) return

    const container = containerRef.current
    if (!container) return

    // 3. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene()
    
    // Low-poly ambient fog
    scene.fog = new THREE.FogExp2('#0a2472', 0.015)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // 4. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.25)
    scene.add(ambientLight)

    // Red industrial light
    const redLight = new THREE.DirectionalLight('#D91E2A', 1.8)
    redLight.position.set(10, 20, 15)
    scene.add(redLight)

    // Blue accent light
    const blueLight = new THREE.DirectionalLight('#2563EB', 1.2)
    blueLight.position.set(-15, -10, 10)
    scene.add(blueLight)

    // 5. Mesh Creation: Low-poly industrial wireframe shapes
    const shapesGroup = new THREE.Group()
    scene.add(shapesGroup)

    const meshes: THREE.Mesh[] = []
    const shapeCount = 12

    // Palette of colors
    const colors = ['#D91E2A', '#0A2472', '#2563EB', '#475569']

    for (let i = 0; i < shapeCount; i++) {
      let geometry: THREE.BufferGeometry

      // Alternate shapes (hex nut, gear ring, pipe torus, structural cube)
      const type = i % 4
      if (type === 0) {
        // Hex Nut (Hexagonal prism cylinder)
        geometry = new THREE.CylinderGeometry(2, 2, 1, 6)
      } else if (type === 1) {
        // Torus / Pipe
        geometry = new THREE.TorusGeometry(1.8, 0.5, 6, 16)
      } else if (type === 2) {
        // Industrial Cog / Gear shape
        geometry = new THREE.CylinderGeometry(1.6, 1.6, 0.8, 12)
      } else {
        // Double loop / spring link
        geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 32, 6)
      }

      // Wireframe overlay + low-poly flat shader
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colors[i % colors.length]),
        roughness: 0.4,
        metalness: 0.8,
        flatShading: true,
        wireframe: i % 2 === 0,
      })

      const mesh = new THREE.Mesh(geometry, material)

      // Random position layout across space
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15
      )

      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      // Random scale variance
      const scale = 0.6 + Math.random() * 0.9
      mesh.scale.set(scale, scale, scale)

      shapesGroup.add(mesh)
      meshes.push(mesh)
    }

    // 6. Camera Parallax Mouse Input Tracking
    let targetX = 0
    let targetY = 0

    function handleMouseMove(e: MouseEvent) {
      // Calculate normalized coords (-1 to 1)
      targetX = (e.clientX / window.innerWidth - 0.5) * 5
      targetY = (e.clientY / window.innerHeight - 0.5) * 3
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 7. Animation Loop
    let animationFrameId: number

    function animate() {
      // Slow rotation for individual meshes
      meshes.forEach((mesh, index) => {
        const speed = 0.002 + (index % 3) * 0.0015
        mesh.rotation.x += speed
        mesh.rotation.y += speed * 0.5
      })

      // Very slow group drift
      shapesGroup.rotation.y += 0.0004
      shapesGroup.rotation.x += 0.0002

      // Smooth camera parallax interpolation (lerp)
      camera.position.x += (targetX - camera.position.x) * 0.04
      camera.position.y += (-targetY - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 8. Canvas Resize Handler
    function handleResize() {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // 9. Cleanup on Unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      // Dispose materials & geometries
      meshes.forEach((mesh) => {
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose())
        } else {
          mesh.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 bg-[#0a2472]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
