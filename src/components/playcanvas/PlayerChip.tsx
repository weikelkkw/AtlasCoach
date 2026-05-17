'use client'

// PlayerChip — fast version.
// Gradient defs are global (defined once via <SharedChipDefs/> at the top of
// the parent SVG). No per-instance drop-shadow filters — those force CPU
// repaints. We rely on stroke + thin overlay rects for the lit look.

import type { PointerEvent as RPointerEvent } from 'react'

interface Props {
  cx: number
  cy: number
  label: string
  position?: string
  side: 'offense' | 'defense'
  state?: 'idle' | 'selected' | 'dragging'
  size?: number
  interactive?: boolean
  onPointerDown?: (e: RPointerEvent) => void
  showPosition?: boolean
}

const BRASS = '232,195,118'
const CYAN = '34,211,238'
const VIOLET = '167,139,250'
const EMERALD = '16,185,129'
const AMBER = '245,158,11'

// Subtle position-color pip — adds character without breaking the
// brass/violet base. Returns null when the position has no dedicated tint.
function positionAccent(pos: string | undefined): string | null {
  if (!pos) return null
  const p = pos.toUpperCase()
  // Skill / playmaker
  if (p === 'QB' || p === 'PG' || p === '10' || p === 'C' && false) return CYAN
  if (p === 'QB' || p === 'PG') return CYAN
  // Backs / wings
  if (p === 'RB' || p === 'F' || p === 'WR' || p === 'ST' || p === 'SF' || p === 'LW' || p === 'RW') return EMERALD
  // Big / interior
  if (p === 'OL' || p === 'TE' || p === 'PF' || p === 'C' || p === 'D' || p === 'BAT') return AMBER
  return null
}

// One-time global defs — call <SharedChipDefs/> inside <svg> once.
export function SharedChipDefs() {
  return (
    <defs>
      {/* Offense gradients */}
      <linearGradient id="chip-off-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor={`rgba(${BRASS},0.50)`} />
        <stop offset="55%" stopColor={`rgba(${BRASS},0.24)`} />
        <stop offset="100%" stopColor={`rgba(${BRASS},0.10)`} />
      </linearGradient>
      <radialGradient id="chip-off-hl" cx="30%" cy="20%" r="60%">
        <stop offset="0%"  stopColor="rgba(255,255,255,0.45)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      {/* Defense gradients */}
      <linearGradient id="chip-def-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor={`rgba(${VIOLET},0.50)`} />
        <stop offset="55%" stopColor={`rgba(${VIOLET},0.24)`} />
        <stop offset="100%" stopColor={`rgba(${VIOLET},0.10)`} />
      </linearGradient>
      <radialGradient id="chip-def-hl" cx="30%" cy="20%" r="60%">
        <stop offset="0%"  stopColor="rgba(255,255,255,0.45)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      {/* Route gradient — single shared instance */}
      <linearGradient id="route-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%"  stopColor={`rgba(${BRASS},0.95)`} />
        <stop offset="60%" stopColor={`rgba(${CYAN},0.95)`} />
        <stop offset="100%" stopColor={`rgba(${CYAN},1)`} />
      </linearGradient>
    </defs>
  )
}

export default function PlayerChip({
  cx, cy, label, position, side,
  state = 'idle',
  size = 30,
  interactive = false,
  onPointerDown,
  showPosition = true,
}: Props) {
  const accent = side === 'offense' ? BRASS : VIOLET
  const partner = side === 'offense' ? CYAN : BRASS
  const r = Math.round(size * 0.22)
  // Scale up via SVG transform — cheaper than re-laying out width/height
  const sc = state === 'dragging' ? 1.16 : state === 'selected' ? 1.06 : 1
  const w = size
  const half = w / 2

  const bodyFill = side === 'offense' ? 'url(#chip-off-body)' : 'url(#chip-def-body)'
  const hlFill   = side === 'offense' ? 'url(#chip-off-hl)'   : 'url(#chip-def-hl)'

  return (
    <g
      transform={sc === 1 ? undefined : `translate(${cx},${cy}) scale(${sc}) translate(${-cx},${-cy})`}
      onPointerDown={interactive ? onPointerDown : undefined}
      style={{
        cursor: interactive ? (state === 'dragging' ? 'grabbing' : 'grab') : undefined,
        touchAction: 'none',
      }}
    >
      {/* Selection ring (cheap circle, no filter) */}
      {state === 'selected' && (
        <circle
          cx={cx} cy={cy}
          r={w * 0.72}
          fill="none"
          stroke={`rgba(${partner},0.85)`}
          strokeWidth={1.2}
          strokeDasharray="3 4"
        />
      )}
      {state === 'dragging' && (
        <circle
          cx={cx} cy={cy}
          r={w * 0.75}
          fill="none"
          stroke={`rgba(${partner},0.95)`}
          strokeWidth={1.8}
        />
      )}

      {/* Hit target (larger than visual) for touch */}
      <circle cx={cx} cy={cy} r={22} fill="transparent" />

      {/* Plinth body — gradient via shared def, no filter */}
      <rect
        x={cx - half} y={cy - half}
        width={w} height={w}
        rx={r} ry={r}
        fill={bodyFill}
        stroke={`rgba(${accent},${state === 'idle' ? 0.80 : 0.98})`}
        strokeWidth={state === 'idle' ? 1.1 : 1.5}
      />
      {/* Inner top-left highlight */}
      <rect
        x={cx - half} y={cy - half}
        width={w} height={w}
        rx={r} ry={r}
        fill={hlFill}
        pointerEvents="none"
      />
      {/* Top gloss edge */}
      <rect
        x={cx - half + 2} y={cy - half + 1.5}
        width={w - 4} height={0.8}
        rx={1}
        fill={`rgba(255,255,255,${state === 'idle' ? 0.35 : 0.55})`}
        pointerEvents="none"
      />
      {/* Position color pip (top-right corner) */}
      {(() => {
        const pip = positionAccent(position)
        if (!pip) return null
        return (
          <circle
            cx={cx + half - 4}
            cy={cy - half + 4}
            r={2.4}
            fill={`rgb(${pip})`}
            stroke="rgba(5,5,12,0.6)"
            strokeWidth={0.6}
          />
        )
      })()}

      {/* Jersey number */}
      <text
        x={cx}
        y={showPosition ? cy + 1 : cy + 4}
        textAnchor="middle"
        fontSize={Math.max(10, Math.round(w * 0.40))}
        fontFamily="var(--font-dm-sans), sans-serif"
        fontWeight={800}
        letterSpacing="-0.02em"
        fill={`rgb(${accent})`}
        pointerEvents="none"
      >
        {label}
      </text>
      {/* Position kicker */}
      {showPosition && position && (
        <text
          x={cx}
          y={cy + Math.round(w * 0.34)}
          textAnchor="middle"
          fontSize={Math.max(6, Math.round(w * 0.20))}
          fontFamily="var(--font-syncopate), sans-serif"
          fontWeight={700}
          letterSpacing="0.14em"
          fill={`rgba(${accent},0.85)`}
          pointerEvents="none"
        >
          {position}
        </text>
      )}
    </g>
  )
}
