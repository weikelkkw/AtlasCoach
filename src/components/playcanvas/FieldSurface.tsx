'use client'

// FieldSurface — sport-aware SVG field rendered inside cinematic ambient.
// Performance pass: pre-blurred radial gradients (no runtime `filter: blur`),
// no `filter: drop-shadow`, dust motes are pure CSS (no React reconciliation).

import { memo, type CSSProperties, type ReactNode } from 'react'
import { PALETTE } from '@/design/constants'
import type { Sport } from '@/data/routes'

interface Props {
  sport?: Sport
  width: number
  height: number
  accentRgb?: string
  secondaryRgb?: string
  compact?: boolean
  children?: ReactNode
  style?: CSSProperties
  wordmark?: string
}

function FieldSurfaceImpl({
  sport = 'football',
  width,
  height,
  accentRgb = PALETTE.brassRGB,
  secondaryRgb = PALETTE.cyanRGB,
  compact = false,
  children,
  style,
  wordmark = 'COASTAL PREP',
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 16,
        overflow: 'hidden',
        background:
          // Layered turf gradient — feels like a stadium under lights
          `radial-gradient(ellipse 70% 50% at 50% 35%, rgba(${accentRgb},0.16) 0%, transparent 60%),
           radial-gradient(ellipse 60% 40% at 50% 100%, rgba(${secondaryRgb},0.08) 0%, transparent 70%),
           linear-gradient(135deg, rgba(${accentRgb},0.08) 0%, rgba(8,12,20,0.85) 50%, rgba(${secondaryRgb},0.06) 100%),
           linear-gradient(180deg, #0a0a14 0%, #07070f 100%)`,
        border: `1px solid rgba(${accentRgb},0.28)`,
        boxShadow:
          `0 0 48px rgba(${accentRgb},0.16),
           0 0 0 1px rgba(255,255,255,0.04),
           inset 0 0 120px rgba(0,0,0,0.55),
           inset 0 1px 0 rgba(255,255,255,0.06)`,
        ...style,
      }}
    >
      {/* Turf grain overlay — subtle noise via SVG */}
      {!compact && <TurfGrain accentRgb={accentRgb} />}

      {/* Ambient orbs — pre-blurred radials, no runtime CSS filter (cheap) */}
      {!compact && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '0%', left: '5%', width: '60%', height: '60%',
            background: `radial-gradient(ellipse at center, rgba(${accentRgb},0.16) 0%, rgba(${accentRgb},0.06) 40%, transparent 70%)`,
            animation: 'heroOrb1 16s ease-in-out infinite',
            willChange: 'transform',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '0%', width: '55%', height: '55%',
            background: `radial-gradient(ellipse at center, rgba(${secondaryRgb},0.12) 0%, rgba(${secondaryRgb},0.04) 40%, transparent 70%)`,
            animation: 'heroOrb2 20s ease-in-out infinite',
            willChange: 'transform',
          }} />
          {/* Stadium floodlight from above */}
          <div style={{
            position: 'absolute', top: '-30%', left: '20%', right: '20%', height: '80%',
            background: `radial-gradient(ellipse at top, rgba(${accentRgb},0.10) 0%, transparent 60%)`,
          }} />
        </div>
      )}

      {/* Corner brackets — frame the field */}
      {!compact && <CornerBrackets accentRgb={accentRgb} />}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ position: 'relative', zIndex: 2, display: 'block', touchAction: 'none' }}
      >
        <FieldLines sport={sport} width={width} height={height} accentRgb={accentRgb} wordmark={wordmark} compact={compact} />
        {children}
      </svg>

      {/* Top scanline */}
      {!compact && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.65), transparent)`,
            opacity: 0.4,
            animation: 'heroScanline 7s ease-in-out infinite',
          }} />
        </div>
      )}
    </div>
  )
}

function DustMotes({ accentRgb, secondaryRgb }: { accentRgb: string; secondaryRgb: string }) {
  // Deterministic mote positions so SSR + hydration match.
  const motes = [
    { left: '14%',  top: '22%', size: 2,   color: accentRgb,    delay: '0s',   dur: '14s' },
    { left: '28%',  top: '64%', size: 1.5, color: secondaryRgb, delay: '2s',   dur: '18s' },
    { left: '42%',  top: '40%', size: 2.5, color: accentRgb,    delay: '4s',   dur: '12s' },
    { left: '58%',  top: '78%', size: 1.5, color: secondaryRgb, delay: '1s',   dur: '20s' },
    { left: '70%',  top: '18%', size: 2,   color: accentRgb,    delay: '3s',   dur: '15s' },
    { left: '86%',  top: '52%', size: 1.5, color: secondaryRgb, delay: '5s',   dur: '17s' },
    { left: '34%',  top: '88%', size: 1,   color: accentRgb,    delay: '6s',   dur: '13s' },
    { left: '62%',  top: '34%', size: 2,   color: accentRgb,    delay: '7s',   dur: '19s' },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      {motes.map((m, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            borderRadius: '50%',
            background: `rgb(${m.color})`,
            boxShadow: `0 0 ${m.size * 3}px rgba(${m.color},0.75)`,
            animation: `heroOrb${(i % 2) + 1} ${m.dur} ease-in-out ${m.delay} infinite`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  )
}

function TurfGrain({ accentRgb }: { accentRgb: string }) {
  // Subtle horizontal grass lines via repeating linear gradient
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage:
          `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(${accentRgb},0.012) 3px, rgba(${accentRgb},0.012) 6px)`,
        opacity: 0.6,
      }}
    />
  )
}

function CornerBrackets({ accentRgb }: { accentRgb: string }) {
  const len = 18
  const off = 8
  const style = {
    position: 'absolute' as const,
    background: `rgba(${accentRgb},0.75)`,
    boxShadow: `0 0 6px rgba(${accentRgb},0.6)`,
    zIndex: 5,
  }
  return (
    <>
      <span style={{ ...style, top: off, left: off, width: len, height: 1 }} />
      <span style={{ ...style, top: off, left: off, width: 1, height: len }} />
      <span style={{ ...style, top: off, right: off, width: len, height: 1 }} />
      <span style={{ ...style, top: off, right: off, width: 1, height: len }} />
      <span style={{ ...style, bottom: off, left: off, width: len, height: 1 }} />
      <span style={{ ...style, bottom: off, left: off, width: 1, height: len }} />
      <span style={{ ...style, bottom: off, right: off, width: len, height: 1 }} />
      <span style={{ ...style, bottom: off, right: off, width: 1, height: len }} />
    </>
  )
}

function FieldLines({
  sport, width: w, height: h, accentRgb, wordmark, compact,
}: {
  sport: Sport; width: number; height: number; accentRgb: string; wordmark: string; compact: boolean
}) {
  if (sport === 'basketball') {
    const baseline = 0.85
    const ft = 0.55
    const keyLeft = 0.34, keyRight = 0.66
    return (
      <g stroke="rgba(255,255,255,0.14)" strokeWidth={1.4} fill="none" strokeLinecap="round">
        <rect x={w * 0.04} y={h * 0.04} width={w * 0.92} height={h * 0.92} rx={3} />
        <line x1={w * 0.04} x2={w * 0.96} y1={(1 - 0.10) * h} y2={(1 - 0.10) * h} />
        <circle cx={w * 0.50} cy={(1 - 0.10) * h} r={w * 0.06} />
        <line x1={w * keyLeft} x2={w * keyRight} y1={(1 - ft) * h} y2={(1 - ft) * h} stroke={`rgba(${accentRgb},0.55)`} strokeWidth={1.4} />
        <circle cx={w * 0.50} cy={(1 - ft) * h} r={w * 0.10} strokeDasharray="6 6" />
        <rect x={w * keyLeft} y={(1 - baseline) * h} width={w * (keyRight - keyLeft)} height={(baseline - ft) * h} />
        <line x1={w * 0.44} x2={w * 0.56} y1={(1 - 0.81) * h} y2={(1 - 0.81) * h} stroke={`rgba(${accentRgb},0.70)`} strokeWidth={1.8} />
        <circle cx={w * 0.50} cy={(1 - 0.80) * h} r={4.5} fill={`rgba(${accentRgb},0.80)`} stroke="none" />
        <path
          d={`M ${w * 0.16} ${h * (1 - baseline)} L ${w * 0.16} ${h * (1 - 0.66)} A ${w * 0.34} ${h * 0.36} 0 0 0 ${w * 0.84} ${h * (1 - 0.66)} L ${w * 0.84} ${h * (1 - baseline)}`}
        />
      </g>
    )
  }

  if (sport === 'soccer') {
    return (
      <g stroke="rgba(255,255,255,0.14)" strokeWidth={1.4} fill="none" strokeLinecap="round">
        <rect x={w * 0.04} y={h * 0.04} width={w * 0.92} height={h * 0.92} rx={3} />
        <line x1={w * 0.04} x2={w * 0.96} y1={(1 - 0.20) * h} y2={(1 - 0.20) * h} stroke={`rgba(${accentRgb},0.50)`} />
        <circle cx={w * 0.50} cy={(1 - 0.20) * h} r={w * 0.10} />
        <circle cx={w * 0.50} cy={(1 - 0.20) * h} r={4} fill={`rgba(${accentRgb},0.7)`} stroke="none" />
        <rect x={w * 0.22} y={(1 - 0.96) * h} width={w * 0.56} height={h * 0.18} />
        <rect x={w * 0.36} y={(1 - 0.96) * h} width={w * 0.28} height={h * 0.08} />
        <circle cx={w * 0.50} cy={(1 - 0.84) * h} r={3.5} fill={`rgba(${accentRgb},0.7)`} stroke="none" />
        <path d={`M ${w * 0.40} ${(1 - 0.78) * h} A ${w * 0.10} ${w * 0.10} 0 0 1 ${w * 0.60} ${(1 - 0.78) * h}`} />
        <line x1={w * 0.44} x2={w * 0.56} y1={(1 - 0.96) * h - 2.5} y2={(1 - 0.96) * h - 2.5} stroke={`rgba(${accentRgb},0.80)`} strokeWidth={2} />
      </g>
    )
  }

  if (sport === 'hockey') {
    // Portrait rink — attacking goal at top.
    // Red center line, two blue lines, goal lines, faceoff dots + circles.
    const ax = w * 0.06, az = w * 0.94
    const att = 0.92, def = 0.08
    const blueA = 0.62, blueD = 0.38, center = 0.50
    const RED = '239,68,68'
    const BLUE = '59,130,246'
    return (
      <g stroke="rgba(255,255,255,0.14)" strokeWidth={1.4} fill="none" strokeLinecap="round">
        {/* Rink boundary with rounded corners */}
        <rect x={ax} y={h * 0.04} width={az - ax} height={h * 0.92} rx={w * 0.06} />
        {/* Center red line */}
        <line x1={ax} x2={az} y1={(1 - center) * h} y2={(1 - center) * h}
          stroke={`rgba(${RED},0.55)`} strokeWidth={2.4} />
        {/* Blue lines */}
        <line x1={ax} x2={az} y1={(1 - blueA) * h} y2={(1 - blueA) * h}
          stroke={`rgba(${BLUE},0.55)`} strokeWidth={2.2} />
        <line x1={ax} x2={az} y1={(1 - blueD) * h} y2={(1 - blueD) * h}
          stroke={`rgba(${BLUE},0.55)`} strokeWidth={2.2} />
        {/* Goal lines */}
        <line x1={ax} x2={az} y1={(1 - att) * h} y2={(1 - att) * h}
          stroke={`rgba(${RED},0.45)`} strokeWidth={1.2} />
        <line x1={ax} x2={az} y1={(1 - def) * h} y2={(1 - def) * h}
          stroke={`rgba(${RED},0.45)`} strokeWidth={1.2} />
        {/* Center faceoff dot + circle */}
        <circle cx={w * 0.50} cy={(1 - center) * h} r={4} fill={`rgba(${accentRgb},0.85)`} stroke="none" />
        <circle cx={w * 0.50} cy={(1 - center) * h} r={w * 0.10} stroke={`rgba(${BLUE},0.45)`} />
        {/* End-zone faceoff dots & circles */}
        {[
          { x: 0.32, y: 0.80 }, { x: 0.68, y: 0.80 },
          { x: 0.32, y: 0.20 }, { x: 0.68, y: 0.20 },
        ].map((d, i) => (
          <g key={i}>
            <circle cx={w * d.x} cy={(1 - d.y) * h} r={3.5} fill={`rgba(${RED},0.80)`} stroke="none" />
            <circle cx={w * d.x} cy={(1 - d.y) * h} r={w * 0.08} stroke={`rgba(${RED},0.35)`} />
          </g>
        ))}
        {/* Neutral-zone faceoff dots */}
        {[
          { x: 0.32, y: 0.42 }, { x: 0.68, y: 0.42 },
          { x: 0.32, y: 0.58 }, { x: 0.68, y: 0.58 },
        ].map((d, i) => (
          <circle key={`nz-${i}`} cx={w * d.x} cy={(1 - d.y) * h} r={3} fill={`rgba(${RED},0.65)`} stroke="none" />
        ))}
        {/* Goals + creases */}
        <rect x={w * 0.46} y={(1 - att) * h - 2} width={w * 0.08} height={4}
          fill={`rgba(${accentRgb},0.55)`} stroke={`rgba(${accentRgb},0.85)`} strokeWidth={1.4} />
        <path d={`M ${w * 0.43} ${(1 - att) * h} A ${w * 0.07} ${w * 0.07} 0 0 0 ${w * 0.57} ${(1 - att) * h}`}
          stroke={`rgba(${BLUE},0.65)`} fill={`rgba(${BLUE},0.05)`} strokeWidth={1.4} />
        <rect x={w * 0.46} y={(1 - def) * h - 2} width={w * 0.08} height={4}
          fill={`rgba(${PALETTE.violetRGB},0.55)`} stroke={`rgba(${PALETTE.violetRGB},0.85)`} strokeWidth={1.4} />
        <path d={`M ${w * 0.43} ${(1 - def) * h} A ${w * 0.07} ${w * 0.07} 0 0 1 ${w * 0.57} ${(1 - def) * h}`}
          stroke={`rgba(${BLUE},0.65)`} fill={`rgba(${BLUE},0.05)`} strokeWidth={1.4} />
        {/* Wordmark */}
        {!compact && (
          <text x={w * 0.50} y={(1 - center) * h - 8} textAnchor="middle"
            fontSize={Math.max(8, w * 0.014)} fontFamily="var(--font-syncopate), sans-serif"
            fontWeight={700} letterSpacing="0.40em" fill={`rgba(${accentRgb},0.45)`}>
            {wordmark}
          </text>
        )}
      </g>
    )
  }

  if (sport === 'baseball') {
    // Portrait diamond — home at bottom, second at top.
    const home = { x: 0.50, y: 0.10 }
    const first = { x: 0.74, y: 0.34 }
    const second = { x: 0.50, y: 0.58 }
    const third = { x: 0.26, y: 0.34 }
    const mound = { x: 0.50, y: 0.34 }
    const DIRT = '195,156,113'
    const GRASS = '52,142,64'
    const FOUL_X1 = (1 - home.x) * w  // anchor for foul lines
    const FOUL_Y1 = (1 - home.y) * h
    return (
      <g stroke="rgba(255,255,255,0.18)" strokeWidth={1.4} fill="none" strokeLinecap="round">
        {/* Outfield arc */}
        <path d={`M ${w * 0.04} ${(1 - 0.34) * h} A ${w * 0.50} ${h * 0.50} 0 0 0 ${w * 0.96} ${(1 - 0.34) * h}`}
          stroke={`rgba(${GRASS},0.35)`} fill={`rgba(${GRASS},0.06)`} strokeWidth={1.8} />
        {/* Infield (dirt) outline — diamond */}
        <path d={`M ${home.x * w} ${(1 - home.y) * h}
          L ${first.x * w} ${(1 - first.y) * h}
          L ${second.x * w} ${(1 - second.y) * h}
          L ${third.x * w} ${(1 - third.y) * h} Z`}
          stroke={`rgba(${DIRT},0.70)`} strokeWidth={1.8} fill={`rgba(${DIRT},0.10)`} />
        {/* Foul lines extending past first & third */}
        <line x1={home.x * w} y1={(1 - home.y) * h} x2={w * 0.96} y2={(1 - 0.38) * h}
          stroke={`rgba(${DIRT},0.55)`} strokeWidth={1.2} />
        <line x1={home.x * w} y1={(1 - home.y) * h} x2={w * 0.04} y2={(1 - 0.38) * h}
          stroke={`rgba(${DIRT},0.55)`} strokeWidth={1.2} />
        {/* Mound */}
        <circle cx={mound.x * w} cy={(1 - mound.y) * h} r={w * 0.05}
          stroke={`rgba(${DIRT},0.65)`} fill={`rgba(${DIRT},0.20)`} strokeWidth={1.4} />
        <circle cx={mound.x * w} cy={(1 - mound.y) * h} r={3} fill={`rgba(${accentRgb},0.80)`} stroke="none" />
        {/* Bases */}
        {[home, first, second, third].map((b, i) => (
          <rect key={i} x={b.x * w - 6} y={(1 - b.y) * h - 6} width={12} height={12}
            transform={`rotate(45 ${b.x * w} ${(1 - b.y) * h})`}
            fill={`rgba(${accentRgb},0.75)`} stroke={`rgba(${accentRgb},0.95)`} strokeWidth={1.2} />
        ))}
        {/* Wordmark */}
        {!compact && (
          <text x={w * 0.50} y={(1 - 0.04) * h} textAnchor="middle"
            fontSize={Math.max(8, w * 0.016)} fontFamily="var(--font-syncopate), sans-serif"
            fontWeight={700} letterSpacing="0.40em" fill={`rgba(${accentRgb},0.55)`}>
            {wordmark}
          </text>
        )}
      </g>
    )
  }

  if (sport === 'lacrosse') {
    // Portrait field — attacking goal at top.
    return (
      <g stroke="rgba(255,255,255,0.14)" strokeWidth={1.4} fill="none" strokeLinecap="round">
        {/* Boundary */}
        <rect x={w * 0.04} y={h * 0.04} width={w * 0.92} height={h * 0.92} rx={3} />
        {/* Midfield */}
        <line x1={w * 0.04} x2={w * 0.96} y1={(1 - 0.50) * h} y2={(1 - 0.50) * h}
          stroke={`rgba(${accentRgb},0.45)`} strokeWidth={1.4} />
        <circle cx={w * 0.50} cy={(1 - 0.50) * h} r={4} fill={`rgba(${accentRgb},0.75)`} stroke="none" />
        {/* Restraining lines */}
        <line x1={w * 0.04} x2={w * 0.96} y1={(1 - 0.78) * h} y2={(1 - 0.78) * h}
          stroke="rgba(255,255,255,0.10)" strokeDasharray="6 6" />
        <line x1={w * 0.04} x2={w * 0.96} y1={(1 - 0.22) * h} y2={(1 - 0.22) * h}
          stroke="rgba(255,255,255,0.10)" strokeDasharray="6 6" />
        {/* Wing lines */}
        <line x1={w * 0.30} x2={w * 0.30} y1={(1 - 0.55) * h} y2={(1 - 0.45) * h} stroke="rgba(255,255,255,0.18)" />
        <line x1={w * 0.70} x2={w * 0.70} y1={(1 - 0.55) * h} y2={(1 - 0.45) * h} stroke="rgba(255,255,255,0.18)" />
        {/* Attacking goal + crease */}
        <line x1={w * 0.46} x2={w * 0.54} y1={(1 - 0.90) * h} y2={(1 - 0.90) * h}
          stroke={`rgba(${accentRgb},0.85)`} strokeWidth={2.2} />
        <circle cx={w * 0.50} cy={(1 - 0.90) * h} r={w * 0.06}
          stroke={`rgba(${accentRgb},0.55)`} fill={`rgba(${accentRgb},0.06)`} strokeWidth={1.4} />
        {/* Defensive goal + crease */}
        <line x1={w * 0.46} x2={w * 0.54} y1={(1 - 0.10) * h} y2={(1 - 0.10) * h}
          stroke={`rgba(${PALETTE.violetRGB},0.85)`} strokeWidth={2.2} />
        <circle cx={w * 0.50} cy={(1 - 0.10) * h} r={w * 0.06}
          stroke={`rgba(${PALETTE.violetRGB},0.55)`} fill={`rgba(${PALETTE.violetRGB},0.06)`} strokeWidth={1.4} />
        {/* Wordmark */}
        {!compact && (
          <text x={w * 0.50} y={(1 - 0.04) * h} textAnchor="middle"
            fontSize={Math.max(8, w * 0.016)} fontFamily="var(--font-syncopate), sans-serif"
            fontWeight={700} letterSpacing="0.40em" fill={`rgba(${accentRgb},0.55)`}>
            {wordmark}
          </text>
        )}
      </g>
    )
  }

  // ── Football ─────────────────────────────────────────────────────────
  const losY = 0.30
  // Major yard lines with on-field numbers
  const majorLines = [
    { y: 0.95, num: '20', goalSide: true },
    { y: 0.80, num: '30' },
    { y: 0.65, num: '40' },
    { y: 0.50, num: '50', is50: true },
    { y: 0.35, num: '40' },
    { y: 0.20, num: '30' },
    { y: 0.05, num: '20', goalSide: true },
  ]

  return (
    <g>
      {/* End-zone shading (offensive end at bottom) */}
      <rect x={w * 0.04} y={h * 0.93} width={w * 0.92} height={h * 0.07}
        fill={`rgba(${accentRgb},0.06)`} stroke={`rgba(${accentRgb},0.30)`} strokeWidth={1} />
      {/* End-zone wordmark */}
      {!compact && (
        <text
          x={w * 0.50}
          y={h * 0.985}
          textAnchor="middle"
          fontSize={Math.max(9, w * 0.018)}
          fontFamily="var(--font-syncopate), sans-serif"
          fontWeight={700}
          letterSpacing="0.35em"
          fill={`rgba(${accentRgb},0.55)`}
        >
          {wordmark}
        </text>
      )}

      {/* Sidelines */}
      <line x1={w * 0.04} x2={w * 0.04} y1={0} y2={h}
        stroke={`rgba(${accentRgb},0.30)`} strokeWidth={1.5} />
      <line x1={w * 0.96} x2={w * 0.96} y1={0} y2={h}
        stroke={`rgba(${accentRgb},0.30)`} strokeWidth={1.5} />

      {/* Yard lines */}
      {majorLines.map((line, i) => (
        <g key={i}>
          <line
            x1={w * 0.04} x2={w * 0.96}
            y1={(1 - line.y) * h} y2={(1 - line.y) * h}
            stroke={line.is50 ? `rgba(255,255,255,0.18)` : `rgba(255,255,255,0.10)`}
            strokeWidth={line.is50 ? 1.2 : 1}
          />
          {/* On-field yard numbers, near both hashes */}
          {!compact && !line.goalSide && (
            <>
              <text
                x={w * 0.22}
                y={(1 - line.y) * h + 4}
                textAnchor="middle"
                fontSize={Math.max(11, w * 0.022)}
                fontFamily="var(--font-syncopate), sans-serif"
                fontWeight={700}
                letterSpacing="0.10em"
                fill="rgba(255,255,255,0.12)"
              >
                {line.num}
              </text>
              <text
                x={w * 0.78}
                y={(1 - line.y) * h + 4}
                textAnchor="middle"
                fontSize={Math.max(11, w * 0.022)}
                fontFamily="var(--font-syncopate), sans-serif"
                fontWeight={700}
                letterSpacing="0.10em"
                fill="rgba(255,255,255,0.12)"
              >
                {line.num}
              </text>
            </>
          )}
        </g>
      ))}

      {/* Line of scrimmage — brass, layered (no filters) */}
      <g>
        <line
          x1={w * 0.04} x2={w * 0.96}
          y1={(1 - losY) * h} y2={(1 - losY) * h}
          stroke={`rgba(${accentRgb},0.20)`}
          strokeWidth={6}
        />
        <line
          x1={w * 0.04} x2={w * 0.96}
          y1={(1 - losY) * h} y2={(1 - losY) * h}
          stroke={`rgba(${accentRgb},0.90)`}
          strokeWidth={1.6}
        />
      </g>

      {/* Hash marks */}
      {Array.from({ length: 16 }).map((_, i) => {
        const yy = (i + 1) / 17
        return (
          <g key={`hash-${i}`}>
            <line x1={w * 0.36} x2={w * 0.36} y1={(1 - yy) * h - 3} y2={(1 - yy) * h + 3}
              stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
            <line x1={w * 0.64} x2={w * 0.64} y1={(1 - yy) * h - 3} y2={(1 - yy) * h + 3}
              stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
          </g>
        )
      })}
    </g>
  )
}

// Memoize so per-frame parent rerenders (animation tick) don't reflow the
// static field. FieldSurface only changes when sport/size/accent change.
const FieldSurface = memo(FieldSurfaceImpl)
export default FieldSurface
