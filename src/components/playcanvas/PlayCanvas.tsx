'use client'

// PlayCanvas — read-only play renderer.
// Performance pass: shared <defs>, no per-frame drop-shadow filters,
// no per-instance gradient generation.

import type { CSSProperties } from 'react'
import FieldSurface from './FieldSurface'
import PlayerChip, { SharedChipDefs } from './PlayerChip'
import type { DefensiveAlignment, Play, PlayerPath } from '@/data/plays'
import { PALETTE } from '@/design/constants'

interface Props {
  play: Play
  defense: DefensiveAlignment
  t: number
  width?: number
  height?: number
  showLabels?: boolean
  accentRgb?: string
  secondaryRgb?: string
  style?: CSSProperties
  compact?: boolean
}

// Position-specific pre-snap settle — tightened range so the play feels
// like one motion rather than 22 individual entrances.
function preSnapDelay(p: PlayerPath): number {
  if (p.side === 'defense') {
    if (p.position === 'DL') return 0.025
    if (p.position === 'LB') return 0.05
    if (p.position === 'CB') return 0.04
    if (p.position === 'S')  return 0.055
    return 0.04
  }
  if (p.position === 'OL') return 0.02
  if (p.position === 'QB') return 0.025
  if (p.position === 'TE' && p.action === 'block') return 0.03
  if (p.position === 'RB') return 0.04
  return 0.05  // WR / route runner
}

// smootherstep — quintic Hermite. Like smoothstep but with continuous 2nd
// derivative, which is what makes it feel "buttery" rather than just
// "smooth". https://en.wikipedia.org/wiki/Smoothstep
function smootherstep(x: number): number {
  const c = Math.max(0, Math.min(1, x))
  return c * c * c * (c * (c * 6 - 15) + 10)
}

// Catmull-Rom spline sampled in arc-length-ish space. No per-segment ease
// because the spline is C1 continuous — easing again creates micro-stops
// at every waypoint, which is what made the motion feel "jerky".
function sampleSpline(stops: { x: number; y: number; t: number }[], u: number): { x: number; y: number } {
  if (u <= 0) return { x: stops[0].x, y: stops[0].y }
  const last = stops[stops.length - 1]
  if (u >= 1 || stops.length < 2) return { x: last.x, y: last.y }

  // Find segment by waypoint-time
  let seg = 1
  for (let i = 1; i < stops.length; i++) {
    if (u <= stops[i].t) { seg = i; break }
    seg = i
  }
  const p0 = stops[Math.max(0, seg - 2)] ?? stops[seg - 1]
  const p1 = stops[seg - 1]
  const p2 = stops[seg]
  const p3 = stops[Math.min(stops.length - 1, seg + 1)] ?? stops[seg]

  const span = Math.max(p2.t - p1.t, 0.0001)
  const local = Math.max(0, Math.min(1, (u - p1.t) / span))

  // Catmull-Rom → cubic Bezier control points (tension 0.5)
  const c1x = p1.x + (p2.x - p0.x) / 6
  const c1y = p1.y + (p2.y - p0.y) / 6
  const c2x = p2.x - (p3.x - p1.x) / 6
  const c2y = p2.y - (p3.y - p1.y) / 6

  const tt = local
  const omt = 1 - tt
  const x = omt * omt * omt * p1.x
          + 3 * omt * omt * tt * c1x
          + 3 * omt * tt * tt * c2x
          + tt * tt * tt * p2.x
  const y = omt * omt * omt * p1.y
          + 3 * omt * omt * tt * c1y
          + 3 * omt * tt * tt * c2y
          + tt * tt * tt * p2.y
  return { x, y }
}

export function interpolatePath(p: PlayerPath, t: number): { x: number; y: number } {
  if (t <= 0) return { x: p.start.x, y: p.start.y }
  if (!p.waypoints.length) return { x: p.start.x, y: p.start.y }

  // Pre-snap settle — soft acceleration out of the hold instead of a step.
  // We fade motion in over a 4% window starting at `delay` so velocity at
  // the handoff is ~0 rather than the bezier's natural take-off speed.
  const delay = preSnapDelay(p)
  if (t < delay) return { x: p.start.x, y: p.start.y }

  const raw = (t - delay) / Math.max(1 - delay, 0.0001)
  // Single global ease — smootherstep gives a continuous acceleration
  // profile across the whole play instead of waypoint-by-waypoint dips.
  const u = smootherstep(raw)

  const stops = [{ x: p.start.x, y: p.start.y, t: 0 }, ...p.waypoints]
  return sampleSpline(stops, u)
}

export function pathToSvg(p: PlayerPath, w: number, h: number): string {
  // Draw the same Catmull-Rom curve the player moves along — that way the
  // ink under the head-dot matches the head-dot's trajectory exactly.
  const stops = [{ x: p.start.x, y: p.start.y }, ...p.waypoints.map((wp) => ({ x: wp.x, y: wp.y }))]
  if (stops.length < 2) return ''
  const pts = stops.map((s) => ({ x: s.x * w, y: (1 - s.y) * h }))
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export function isRouteAction(p: PlayerPath): boolean {
  if (p.side !== 'offense') return false
  if (p.action === 'block') return false
  if (p.position === 'OL') return false
  return true
}

function endTangent(p: PlayerPath, w: number, h: number): { x: number; y: number; angle: number } | null {
  const stops = [{ x: p.start.x, y: p.start.y }, ...p.waypoints.map((wp) => ({ x: wp.x, y: wp.y }))]
  if (stops.length < 2) return null
  const a = stops[stops.length - 2]
  const b = stops[stops.length - 1]
  const ax = a.x * w, ay = (1 - a.y) * h
  const bx = b.x * w, by = (1 - b.y) * h
  const angle = Math.atan2(by - ay, bx - ax) * (180 / Math.PI)
  return { x: bx, y: by, angle }
}

export default function PlayCanvas({
  play,
  defense,
  t,
  width = 720,
  height = 405,
  showLabels = true,
  accentRgb = PALETTE.brassRGB,
  secondaryRgb = PALETTE.cyanRGB,
  style,
  compact = false,
}: Props) {
  const w = width
  const h = height
  const chipSize = compact ? 16 : 30

  return (
    <FieldSurface
      sport={play.sport ?? 'football'}
      width={w}
      height={h}
      accentRgb={accentRgb}
      secondaryRgb={secondaryRgb}
      compact={compact}
      style={style}
    >
      <SharedChipDefs />

      {/* Routes — primary read renders thicker, solid, brighter */}
      <g>
        {play.offense.filter(isRouteAction).map((p) => {
          const d = pathToSvg(p, w, h)
          if (!d) return null
          const tip = endTangent(p, w, h)
          const isPrimary = play.primaryRouteId === p.id
          return (
            <g key={`route-${p.id}`}>
              {/* Outer aura — wider on primary */}
              <path
                d={d}
                stroke={isPrimary ? `rgba(${secondaryRgb},0.55)` : `rgba(${accentRgb},0.30)`}
                strokeWidth={isPrimary ? (compact ? 6 : 10) : (compact ? 4 : 6)}
                fill="none"
                strokeLinecap="round"
              />
              {/* Crisp stroke */}
              <path
                d={d}
                stroke="url(#route-grad)"
                strokeWidth={isPrimary ? (compact ? 2.4 : 3.6) : (compact ? 1.6 : 2.4)}
                fill="none"
                strokeDasharray={isPrimary || compact ? undefined : '7 5'}
                strokeLinecap="round"
                className={compact ? undefined : 'route-flow'}
                opacity={isPrimary ? 1 : 0.85}
              />
              {/* Arrowhead at terminus — bigger + extra halo on primary */}
              {tip && !compact && (
                <g transform={`translate(${tip.x},${tip.y}) rotate(${tip.angle})`}>
                  {isPrimary && (
                    <polygon points="0,-9 18,0 0,9" fill={`rgba(${secondaryRgb},0.30)`} />
                  )}
                  <polygon
                    points={isPrimary ? '0,-6 14,0 0,6' : '0,-5 11,0 0,5'}
                    fill={`rgb(${secondaryRgb})`}
                  />
                </g>
              )}
            </g>
          )
        })}
      </g>

      {/* Block marks */}
      <g>
        {play.offense.filter((p) => p.action === 'block').map((p) => {
          const pos = interpolatePath(p, Math.max(t, 0.1))
          const px = pos.x * w
          const py = (1 - pos.y) * h
          return (
            <line
              key={`block-${p.id}`}
              x1={px - 8}
              x2={px + 8}
              y1={py - 18}
              y2={py - 18}
              stroke={`rgba(${accentRgb},0.75)`}
              strokeWidth={2}
              strokeLinecap="round"
            />
          )
        })}
      </g>

      {/* Defense */}
      <g>
        {defense.players.map((p) => {
          const pos = interpolatePath(p, t)
          return (
            <PlayerChip
              key={`d-${p.id}`}
              cx={pos.x * w}
              cy={(1 - pos.y) * h}
              label={p.label}
              position={showLabels ? p.position : undefined}
              side="defense"
              size={chipSize}
              showPosition={showLabels && !compact}
            />
          )
        })}
      </g>

      {/* Offense */}
      <g>
        {play.offense.map((p) => {
          const pos = interpolatePath(p, t)
          return (
            <PlayerChip
              key={`o-${p.id}`}
              cx={pos.x * w}
              cy={(1 - pos.y) * h}
              label={p.label}
              position={showLabels ? p.position : undefined}
              side="offense"
              size={chipSize}
              showPosition={showLabels && !compact}
            />
          )
        })}
      </g>

      {/* Head-dots — primary read has a larger, brighter head + a halo ring around the receiver chip */}
      <g>
        {play.offense.filter(isRouteAction).map((p) => {
          const pos = interpolatePath(p, t)
          const cx = pos.x * w
          const cy = (1 - pos.y) * h
          const isPrimary = play.primaryRouteId === p.id
          return (
            <g key={`head-${p.id}`}>
              {isPrimary && !compact && (
                <circle
                  cx={cx} cy={cy}
                  r={20}
                  fill="none"
                  stroke={`rgba(${secondaryRgb},0.55)`}
                  strokeWidth={1.4}
                  strokeDasharray="3 4"
                  className="head-pulse"
                />
              )}
              <circle
                cx={cx} cy={cy}
                r={isPrimary ? (compact ? 7 : 11) : (compact ? 5 : 7)}
                fill={`rgba(${secondaryRgb},${isPrimary ? 0.45 : 0.30})`}
              />
              <circle
                cx={cx} cy={cy}
                r={isPrimary ? (compact ? 3.5 : 5) : (compact ? 2.5 : 3.5)}
                fill={`rgb(${secondaryRgb})`}
                stroke={`rgba(${secondaryRgb},${isPrimary ? 0.95 : 0.6})`}
                strokeWidth={isPrimary ? 2.5 : 2}
              />
            </g>
          )
        })}
      </g>
    </FieldSurface>
  )
}
