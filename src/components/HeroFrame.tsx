'use client'

// HeroFrame — reusable cinematic frame wrapper.
// Layers: 8 corner brackets, 2 drifting glow orbs, faint tech grid,
// center vignette, hover scanline, hover halo box-shadow.
// Three intensities: 'sm' (KPI tile), 'md' (panel), 'lg' (signature/modal).
// Grid-safe (minWidth: 0).

import { useState, useRef, type ReactNode, type CSSProperties } from 'react'

type Intensity = 'sm' | 'md' | 'lg'

interface Props {
  children: ReactNode
  accentRgb?: string
  accentRgb2?: string
  intensity?: Intensity
  cornerLength?: number
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

const SETTINGS: Record<Intensity, {
  minHeight: number; cornerLen: number; gridSize: number; borderRadius: number
  orb1: { w: number; left: string; top: string }
  orb2: { w: number; right: string; bottom: string }
}> = {
  sm: { minHeight: 0,   cornerLen: 14, gridSize: 32, borderRadius: 16,
        orb1: { w: 160, left: '10%', top: '8%' }, orb2: { w: 130, right: '8%', bottom: '4%' } },
  md: { minHeight: 0,   cornerLen: 18, gridSize: 44, borderRadius: 18,
        orb1: { w: 240, left: '12%', top: '14%' }, orb2: { w: 200, right: '10%', bottom: '6%' } },
  lg: { minHeight: 140, cornerLen: 22, gridSize: 60, borderRadius: 22,
        orb1: { w: 320, left: '14%', top: '16%' }, orb2: { w: 260, right: '12%', bottom: '8%' } },
}

export default function HeroFrame({
  children,
  accentRgb = '232,195,118',
  accentRgb2,
  intensity = 'sm',
  cornerLength,
  className,
  style,
  onClick,
}: Props) {
  const cfg = SETTINGS[intensity]
  const cornerL = cornerLength ?? cfg.cornerLen
  const a = accentRgb
  const b = accentRgb2 ?? accentRgb
  const [hover, setHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const cornerStyle = {
    background: `rgba(${a}, ${hover ? 0.95 : 0.55})`,
    boxShadow: hover
      ? `0 0 8px rgba(${a},0.7), 0 0 14px rgba(${a},0.4)`
      : `0 0 4px rgba(${a},0.4)`,
    transition:
      'background 280ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 280ms cubic-bezier(0.2,0.8,0.2,1)',
    zIndex: 4,
  } as const

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: cfg.borderRadius,
        border: `1px solid rgba(255,255,255,${hover ? 0.10 : 0.06})`,
        minHeight: cfg.minHeight || undefined,
        minWidth: 0,
        background: `linear-gradient(135deg, rgba(${a},0.10) 0%, rgba(${a},0.03) 50%, rgba(${b},0.07) 100%)`,
        boxShadow: hover
          ? `0 0 60px rgba(${a},0.20), 0 0 120px rgba(${a},0.08), inset 0 0 80px rgba(${a},0.05), 0 14px 32px -10px rgba(0,0,0,0.55)`
          : `0 0 32px rgba(${a},0.10), 0 0 64px rgba(${a},0.04), 0 8px 18px -8px rgba(0,0,0,0.50)`,
        transition:
          'box-shadow 480ms cubic-bezier(0.2,0.8,0.2,1), border-color 280ms ease',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {/* Ambient layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: cfg.orb1.top, left: cfg.orb1.left,
          width: cfg.orb1.w, height: cfg.orb1.w, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${a},0.22) 0%, rgba(${a},0.08) 45%, transparent 70%)`,
          filter: 'blur(28px)', animation: 'heroOrb1 14s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: cfg.orb2.bottom, right: cfg.orb2.right,
          width: cfg.orb2.w, height: cfg.orb2.w, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${b},0.18) 0%, rgba(${b},0.06) 45%, transparent 70%)`,
          filter: 'blur(24px)', animation: 'heroOrb2 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: `${cfg.gridSize}px ${cfg.gridSize}px`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 75% at 50% 50%, transparent 35%, rgba(5,5,12,0.55) 100%)',
        }} />
      </div>

      {/* Scanline */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 4 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${a},${hover ? 0.85 : 0.55}), transparent)`,
          opacity: hover ? 0.6 : 0.3,
          animation: 'heroScanline 6s ease-in-out infinite',
          transition: 'opacity 280ms ease',
        }} />
      </div>

      {/* 8 Corner brackets */}
      <div style={{ position: 'absolute', top: 0, left: 0,  width: cornerL, height: 1, ...cornerStyle }} />
      <div style={{ position: 'absolute', top: 0, left: 0,  width: 1, height: cornerL, ...cornerStyle }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: cornerL, height: 1, ...cornerStyle }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: cornerL, ...cornerStyle }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0,  width: cornerL, height: 1, ...cornerStyle }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0,  width: 1, height: cornerL, ...cornerStyle }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: cornerL, height: 1, ...cornerStyle }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: cornerL, ...cornerStyle }} />

      <div style={{ position: 'relative', zIndex: 5, minWidth: 0 }}>{children}</div>
    </div>
  )
}
