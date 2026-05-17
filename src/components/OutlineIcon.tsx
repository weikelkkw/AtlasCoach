'use client'

import type { CSSProperties, JSX } from 'react'

interface Props {
  name: string
  color: string
  size?: number
  style?: CSSProperties
}

const COMMON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ── Coaching-domain glyphs ────────────────────────────────────────────────

function Whistle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M3 11 L13 8.5 L17 8.5 A4 4 0 1 1 17 16 L13 16 L3 13 Z" />
      <path d="M13 8.5 L13 16" />
      <circle cx="17" cy="12.25" r="0.7" />
    </svg>
  )
}

function Clipboard({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <rect x="9" y="2.5" width="6" height="4" rx="1" />
      <path d="M8.5 11 H15.5 M8.5 14.5 H15.5 M8.5 18 H13" />
    </svg>
  )
}

function Football({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(-30 12 12)" />
      <path d="M9 12 L15 12 M11.5 10.5 L11.5 13.5 M13 10.5 L13 13.5" />
    </svg>
  )
}

function Soccer({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 5.5 L15.5 8 L14 12 L10 12 L8.5 8 Z" />
      <path d="M12 5.5 L12 3.5 M15.5 8 L18.5 7 M10 12 L7 14 M14 12 L17 14 M8.5 8 L5.5 7" />
    </svg>
  )
}

function Basketball({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12 L20.5 12 M12 3.5 L12 20.5" />
      <path d="M5.6 6.5 Q12 12 18.4 6.5 M5.6 17.5 Q12 12 18.4 17.5" />
    </svg>
  )
}

function Hockey({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M4 4 L4 16 L11 16 L11 19" />
      <ellipse cx="14" cy="19" rx="3" ry="1.2" />
    </svg>
  )
}

function Baseball({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M5.5 6.5 Q9 9 9 12 Q9 15 5.5 17.5 M18.5 6.5 Q15 9 15 12 Q15 15 18.5 17.5" />
    </svg>
  )
}

function Lacrosse({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <ellipse cx="7" cy="7" rx="3.5" ry="2.5" transform="rotate(-30 7 7)" />
      <path d="M9 9 L19 19" />
      <circle cx="7" cy="7" r="0.7" />
    </svg>
  )
}

function PlayDiagram({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M3 19 Q9 13 12 13 Q15 13 21 5" />
      <path d="M18 5 L21 5 L21 8" />
      <circle cx="3" cy="19" r="1.4" />
    </svg>
  )
}

function Roster({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3 19 Q3 14 9 14 Q15 14 15 19" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M14.5 19 Q14.5 16 18 16 Q21 16 21 19" />
    </svg>
  )
}

function DepthChart({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <rect x="3" y="4" width="7" height="3" rx="1" />
      <rect x="3" y="10.5" width="7" height="3" rx="1" />
      <rect x="3" y="17" width="7" height="3" rx="1" />
      <rect x="14" y="4" width="7" height="3" rx="1" />
      <rect x="14" y="10.5" width="7" height="3" rx="1" />
      <rect x="14" y="17" width="7" height="3" rx="1" />
    </svg>
  )
}

function Calendar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10 H21 M8 3 V7 M16 3 V7" />
    </svg>
  )
}

function Film({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9 H21 M3 15 H21" />
      <path d="M7 4 V20 M17 4 V20" />
    </svg>
  )
}

function Scout({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 L20 20" />
      <path d="M11 8 V14 M8 11 H14" />
    </svg>
  )
}

function Analytics({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M3 20 H21" />
      <rect x="5" y="13" width="3" height="6" rx="0.6" />
      <rect x="10.5" y="8" width="3" height="11" rx="0.6" />
      <rect x="16" y="4" width="3" height="15" rx="0.6" />
    </svg>
  )
}

function Settings({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.1 5.1 L6.9 6.9 M17.1 17.1 L18.9 18.9 M5.1 18.9 L6.9 17.1 M17.1 6.9 L18.9 5.1" />
    </svg>
  )
}

function Play({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M7 5 L19 12 L7 19 Z" />
    </svg>
  )
}

function Pause({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function SkipBack({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M19 5 L9 12 L19 19 Z" />
      <path d="M5 5 V19" />
    </svg>
  )
}

function SkipForward({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M5 5 L15 12 L5 19 Z" />
      <path d="M19 5 V19" />
    </svg>
  )
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M12 5 V19 M5 12 H19" />
    </svg>
  )
}

function Bell({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M6 16 L6 11 A6 6 0 0 1 18 11 L18 16 L20 18 H4 Z" />
      <path d="M10 21 H14" />
    </svg>
  )
}

function Trophy({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M7 4 H17 V11 A5 5 0 0 1 7 11 Z" />
      <path d="M7 6 H4 V8 A3 3 0 0 0 7 11 M17 6 H20 V8 A3 3 0 0 1 17 11" />
      <path d="M9 16 H15 L16 20 H8 Z M12 11 V16" />
    </svg>
  )
}

function Stopwatch({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 13 L12 9 M12 13 L15 14" />
      <path d="M10 2.5 H14 M12 2.5 V5.5" />
    </svg>
  )
}

function Note({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M5 4 H15 L19 8 V20 H5 Z" />
      <path d="M15 4 V8 H19" />
      <path d="M8 12 H16 M8 15.5 H16 M8 19 H13" />
    </svg>
  )
}

function Chat({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M4 5 H20 V17 H13 L8 21 V17 H4 Z" />
      <path d="M8 10 H16 M8 13 H14" />
    </svg>
  )
}

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M12 3 L13.4 9.6 L20 11 L13.4 12.4 L12 19 L10.6 12.4 L4 11 L10.6 9.6 Z" />
    </svg>
  )
}

function Share({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8 11 L16 7 M8 13 L16 17" />
    </svg>
  )
}

function Download({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <path d="M12 4 V15 M7.5 11 L12 15 L16.5 11" />
      <path d="M4 19 H20" />
    </svg>
  )
}

function Search({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...COMMON} aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8 L20 20" />
    </svg>
  )
}

function resolve(name: string): (props: { size: number }) => JSX.Element {
  const n = name.toLowerCase()
  if (n.includes('whistle')) return Whistle
  if (n.includes('clipboard')) return Clipboard
  if (n.includes('football')) return Football
  if (n.includes('soccer')) return Soccer
  if (n.includes('basketball') || n === 'bball') return Basketball
  if (n.includes('hockey')) return Hockey
  if (n.includes('baseball')) return Baseball
  if (n.includes('lacrosse')) return Lacrosse
  if (n.includes('play-diagram') || n.includes('playbook') || n.includes('play')) {
    if (n === 'play' || n.includes('control')) return Play
    return PlayDiagram
  }
  if (n.includes('roster') || n.includes('people') || n.includes('players')) return Roster
  if (n.includes('depth')) return DepthChart
  if (n.includes('calendar') || n.includes('schedule')) return Calendar
  if (n.includes('film') || n.includes('video')) return Film
  if (n.includes('scout') || n.includes('search')) return n.includes('search') ? Search : Scout
  if (n.includes('analytic') || n.includes('chart')) return Analytics
  if (n.includes('setting')) return Settings
  if (n.includes('pause')) return Pause
  if (n.includes('back') || n.includes('previous')) return SkipBack
  if (n.includes('forward') || n.includes('next') || n.includes('skip')) return SkipForward
  if (n.includes('plus') || n.includes('add') || n.includes('new')) return Plus
  if (n.includes('bell') || n.includes('notif')) return Bell
  if (n.includes('trophy') || n.includes('award')) return Trophy
  if (n.includes('stopwatch') || n.includes('timer') || n.includes('clock')) return Stopwatch
  if (n.includes('note') || n.includes('doc')) return Note
  if (n.includes('chat') || n.includes('message') || n.includes('comm')) return Chat
  if (n.includes('sparkle') || n.includes('ai') || n.includes('star')) return Sparkle
  if (n.includes('share')) return Share
  if (n.includes('download') || n.includes('export')) return Download
  return PlayDiagram
}

export default function OutlineIcon({ name, color, size = 22, style }: Props) {
  const Icon = resolve(name)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        filter: `drop-shadow(0 0 6px ${color}66) drop-shadow(0 0 14px ${color}33)`,
        ...style,
      }}
    >
      <Icon size={size} />
    </span>
  )
}
