import React from 'react'

interface IconProps {
  className?: string
}

// Helper grid classes and hover effect wrapper
function FloatWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`transition-all duration-300 hover:-translate-y-2 hover:drop-shadow-2xl ${className}`}>
      {children}
    </div>
  )
}

// 1. Isometric A/C Condenser Unit
export function IsometricAcIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="35" ry="12" fill="#0A2472" fillOpacity="0.15" />
        
        {/* Left Side (Darker Navy) */}
        <path d="M25 50 L60 70 L60 90 L25 70 Z" fill="#071b56" />
        {/* Right Side (Medium Navy) */}
        <path d="M60 70 L95 50 L95 70 L60 90 Z" fill="#0A2472" />
        {/* Top Side (Light Navy) */}
        <path d="M25 50 L60 30 L95 50 L60 70 Z" fill="#1e3f9e" />

        {/* Grill Slots (Left Side) */}
        <path d="M30 58 L55 72" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M30 63 L55 77" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M30 68 L55 82" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Fan Grill Outline on Top */}
        <ellipse cx="60" cy="50" rx="20" ry="10" stroke="#D91E2A" strokeWidth="2" />
        <line x1="60" y1="40" x2="60" y2="60" stroke="#D91E2A" strokeWidth="1.5" />
        <line x1="40" y1="50" x2="80" y2="50" stroke="#D91E2A" strokeWidth="1.5" />
        <circle cx="60" cy="50" r="4" fill="#ffffff" />
      </svg>
    </FloatWrapper>
  )
}

// 2. Isometric Hex Bolt and Nut (Hardware)
export function IsometricHardwareIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="25" ry="8" fill="#0A2472" fillOpacity="0.15" />

        {/* Bolt Shaft */}
        <path d="M50 45 L70 35 L70 80 L50 90 Z" fill="#D91E2A" />
        <path d="M50 90 L70 80 L60 85 Z" fill="#b81521" />

        {/* Shaft Threads (Lines) */}
        <path d="M50 55 L70 45" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M50 63 L70 53" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M50 71 L70 61" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M50 79 L70 69" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Hexagonal Bolt Head */}
        {/* Left */}
        <path d="M30 35 L60 50 L60 62 L30 47 Z" fill="#071b56" />
        {/* Right */}
        <path d="M60 50 L90 35 L90 47 L60 62 Z" fill="#0A2472" />
        {/* Top */}
        <path d="M30 35 L60 20 L90 35 L60 50 Z" fill="#1e3f9e" />
      </svg>
    </FloatWrapper>
  )
}

// 3. Isometric Wrench and Drill (Tools)
export function IsometricToolsIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="30" ry="10" fill="#0A2472" fillOpacity="0.15" />

        {/* 3D Wrench lying flat */}
        <path d="M25 80 L85 30 L95 38 L35 88 Z" fill="#0A2472" />
        <path d="M25 80 L35 88 L30 84 Z" fill="#071b56" />
        
        {/* Wrench Jaw (open end) */}
        <circle cx="88" cy="33" r="12" fill="#1e3f9e" />
        <path d="M82 25 L94 37" fill="#0a2472" />
        <circle cx="88" cy="33" r="6" fill="#0a2472" />

        {/* 3D Drill crossing vertically */}
        {/* Drill body */}
        <path d="M45 40 L75 25 L85 35 L55 50 Z" fill="#D91E2A" />
        {/* Drill handle */}
        <path d="M55 50 L65 75 L55 78 L45 53 Z" fill="#b81521" />
        {/* Drill chuck / bit */}
        <path d="M75 25 L85 20 L80 18 Z" fill="#ffffff" />
      </svg>
    </FloatWrapper>
  )
}

// 4. Isometric Bricks & Steel Beams (Construction)
export function IsometricConstructionIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="32" ry="10" fill="#0A2472" fillOpacity="0.15" />

        {/* Steel I-Beam (Grey/Navy) */}
        <path d="M20 70 L90 35 L100 40 L30 75 Z" fill="#475569" />
        <path d="M20 70 L30 75 L30 85 L20 80 Z" fill="#334155" />
        {/* Bottom flange */}
        <path d="M20 80 L90 45 L100 50 L30 85 Z" fill="#475569" />

        {/* 3D Bricks (Red) */}
        {/* Brick 1 */}
        <path d="M35 60 L65 45 L65 55 L35 65 Z" fill="#D91E2A" />
        <path d="M65 45 L80 37 L80 47 L65 55 Z" fill="#b81521" />
        <path d="M35 60 L50 52 L80 37 L65 45 Z" fill="#ff4d5a" />

        {/* Brick 2 (Offset) */}
        <path d="M50 72 L80 57 L80 67 L50 77 Z" fill="#D91E2A" />
        <path d="M80 57 L95 49 L95 59 L80 67 Z" fill="#b81521" />
        <path d="M50 72 L65 64 L95 49 L80 57 Z" fill="#ff4d5a" />
      </svg>
    </FloatWrapper>
  )
}

// 5. Isometric Gear and Valve Wheel (Industrial)
export function IsometricIndustrialIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="35" ry="12" fill="#0A2472" fillOpacity="0.15" />

        {/* 3D Gear Wheel Base */}
        <path d="M30 65 L60 80 L90 65 L60 50 Z" fill="#0A2472" />
        <path d="M30 65 L60 80 L60 88 L30 73 Z" fill="#071b56" />
        <path d="M60 80 L90 65 L90 73 L60 88 Z" fill="#1e3f9e" />

        {/* Gear Teeth Extrusions */}
        <path d="M25 62 L32 66 L32 72 L25 68 Z" fill="#071b56" />
        <path d="M95 62 L88 66 L88 72 L95 68 Z" fill="#1e3f9e" />
        <path d="M60 46 L68 50 L68 56 L60 52 Z" fill="#0a2472" />

        {/* Valve Wheel Overlay (Red) */}
        <ellipse cx="60" cy="48" rx="20" ry="10" stroke="#D91E2A" strokeWidth="4" />
        <line x1="60" y1="38" x2="60" y2="58" stroke="#D91E2A" strokeWidth="3" />
        <line x1="40" y1="48" x2="80" y2="48" stroke="#D91E2A" strokeWidth="3" />
        <circle cx="60" cy="48" r="6" fill="#ffffff" />
      </svg>
    </FloatWrapper>
  )
}

// 6. Isometric Quality Shield Badge
export function IsometricCheckIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="28" ry="9" fill="#0A2472" fillOpacity="0.15" />

        {/* 3D Badge Base (Navy) */}
        <path d="M35 45 L60 60 L85 45 L60 25 Z" fill="#0A2472" />
        <path d="M35 45 L60 60 L60 70 L35 55 Z" fill="#071b56" />
        <path d="M60 60 L85 45 L85 55 L60 70 Z" fill="#1e3f9e" />

        {/* Checkmark Floating Above (Red) */}
        <path d="M45 42 L55 52 L78 30" stroke="#D91E2A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M45 44 L55 54 L78 32" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
      </svg>
    </FloatWrapper>
  )
}

// 7. Isometric Delivery Truck
export function IsometricTruckIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="35" ry="10" fill="#0A2472" fillOpacity="0.15" />

        {/* Cargo Container (Navy Box) */}
        {/* Left */}
        <path d="M25 45 L55 60 L55 80 L25 65 Z" fill="#071b56" />
        {/* Right */}
        <path d="M55 60 L85 45 L85 65 L55 80 Z" fill="#0A2472" />
        {/* Top */}
        <path d="M25 45 L55 30 L85 45 L55 60 Z" fill="#1e3f9e" />

        {/* Cabin Front (Red) */}
        <path d="M85 45 L98 38 L98 52 L85 59 Z" fill="#D91E2A" />
        <path d="M85 59 L98 52 L90 55 Z" fill="#b81521" />

        {/* Wheels (3D Cylinders) */}
        <circle cx="40" cy="80" r="6" fill="#334155" />
        <circle cx="75" cy="68" r="6" fill="#334155" />
      </svg>
    </FloatWrapper>
  )
}

// 8. Isometric Support / Handshake / Service Cube
export function IsometricSupportIcon({ className = 'size-12' }: IconProps) {
  return (
    <FloatWrapper className={className}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Shadow */}
        <ellipse cx="60" cy="95" rx="26" ry="8" fill="#0A2472" fillOpacity="0.15" />

        {/* Main Isometric Cube representing Service Portal */}
        {/* Left */}
        <path d="M35 50 L60 63 L60 85 L35 72 Z" fill="#071b56" />
        {/* Right */}
        <path d="M60 63 L85 50 L85 72 L60 85 Z" fill="#D91E2A" />
        {/* Top */}
        <path d="M35 50 L60 37 L85 50 L60 63 Z" fill="#1e3f9e" />

        {/* Connecting Ring Orbits */}
        <ellipse cx="60" cy="42" rx="30" ry="12" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.8" />
        <ellipse cx="60" cy="74" rx="30" ry="12" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.8" />
        
        {/* Central Core Light Node */}
        <circle cx="60" cy="50" r="5" fill="#ffffff" className="animate-pulse" />
      </svg>
    </FloatWrapper>
  )
}
