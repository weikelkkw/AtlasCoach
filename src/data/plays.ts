// Field coordinates are normalized 0–1.
// x: 0 (left sideline) → 1 (right sideline)
// y: 0 (offense backfield) → 1 (downfield)
// The PlayCanvas renderer maps these into the SVG surface.

import type { Sport } from './routes'

export type Side = 'offense' | 'defense'

export interface PlayerPath {
  id: string
  label: string          // role/letter (X, Z, Y, F, Q, T) or jersey number for visual
  position: string       // QB, WR, RB, TE, OL etc.
  side: Side
  start: { x: number; y: number }
  waypoints: { x: number; y: number; t: number }[]  // t in [0,1], includes implicit start at t=0
  action?: 'pass' | 'run' | 'block' | 'route'
}

export interface DefensiveAlignment {
  id: string
  label: string
  shortName: string
  description: string
  players: PlayerPath[]
  // ── Optional metadata (used by the defense library / detail pages)
  sport?: Sport
  family?: 'front' | 'coverage' | 'pressure' | 'sub-package'
  personnel?: string         // e.g. '4-3', 'Nickel 4-2-5', 'Dime 4-1-6', '3-3-5'
  bestVs?: Array<'run' | 'pass' | 'rpo' | 'screen' | 'play-action' | 'mobile-qb'>
  weakness?: string
  custom?: boolean           // user-imported defenses get true
}

export interface Play {
  id: string
  name: string
  sport?: Sport
  formation: string
  personnel: string
  situation: 'open' | 'redzone' | 'short' | 'long' | '2min'
  tags: string[]
  installStatus: 'installed' | 'teaching' | 'planned'
  stats: { runs: number; efficiency: number; lastUsed: string }
  defaultDefenseId: string
  offense: PlayerPath[]
  /** Offensive player id whose route is the QB's primary read. Renders with the highlighted treatment. */
  primaryRouteId?: string
  decision?: {
    atT: number
    prompt: string
    branches: { label: string; description: string }[]
  }
  variants: { id: string; label: string; vs: string }[]
}

// ── Defensive looks ──────────────────────────────────────────────────────

export const defenses: DefensiveAlignment[] = [
  {
    id: 'cover-2',
    label: 'Cover 2 Shell',
    shortName: 'Cover 2',
    description: 'Two-deep safety, five-under zone.',
    players: [
      // DL
      { id: 'd-le', label: 'E', position: 'DL', side: 'defense', start: { x: 0.36, y: 0.34 }, waypoints: [{ x: 0.40, y: 0.30, t: 1 }] },
      { id: 'd-lt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.46, y: 0.34 }, waypoints: [{ x: 0.48, y: 0.30, t: 1 }] },
      { id: 'd-rt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re', label: 'E', position: 'DL', side: 'defense', start: { x: 0.64, y: 0.34 }, waypoints: [{ x: 0.60, y: 0.30, t: 1 }] },
      // LB
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.30, y: 0.52, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.54, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.70, y: 0.52, t: 1 }] },
      // CB
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.50, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.50, t: 1 }] },
      // Safeties — two-deep
      { id: 'd-fs', label: 'F', position: 'S', side: 'defense', start: { x: 0.30, y: 0.62 }, waypoints: [{ x: 0.28, y: 0.78, t: 1 }] },
      { id: 'd-ss', label: 'S', position: 'S', side: 'defense', start: { x: 0.70, y: 0.62 }, waypoints: [{ x: 0.72, y: 0.78, t: 1 }] },
    ],
  },
  {
    id: 'cover-3-buzz',
    label: 'Cover 3 Buzz',
    shortName: 'C3 Buzz',
    description: 'Three-deep zone, strong safety rotates to hook/curl.',
    players: [
      { id: 'd-le', label: 'E', position: 'DL', side: 'defense', start: { x: 0.36, y: 0.34 }, waypoints: [{ x: 0.40, y: 0.30, t: 1 }] },
      { id: 'd-lt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.46, y: 0.34 }, waypoints: [{ x: 0.48, y: 0.30, t: 1 }] },
      { id: 'd-rt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re', label: 'E', position: 'DL', side: 'defense', start: { x: 0.64, y: 0.34 }, waypoints: [{ x: 0.60, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.26, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.74, y: 0.55, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.80, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.80, t: 1 }] },
      { id: 'd-fs', label: 'F', position: 'S', side: 'defense', start: { x: 0.50, y: 0.66 }, waypoints: [{ x: 0.50, y: 0.85, t: 1 }] },
      { id: 'd-ss', label: 'S', position: 'S', side: 'defense', start: { x: 0.70, y: 0.62 }, waypoints: [{ x: 0.62, y: 0.50, t: 1 }] },
    ],
  },
  {
    id: 'tampa-2',
    label: 'Tampa 2',
    shortName: 'Tampa 2',
    description: 'Mike LB drops to middle, hash safeties carry outside.',
    players: [
      { id: 'd-le', label: 'E', position: 'DL', side: 'defense', start: { x: 0.36, y: 0.34 }, waypoints: [{ x: 0.40, y: 0.30, t: 1 }] },
      { id: 'd-lt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.46, y: 0.34 }, waypoints: [{ x: 0.48, y: 0.30, t: 1 }] },
      { id: 'd-rt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re', label: 'E', position: 'DL', side: 'defense', start: { x: 0.64, y: 0.34 }, waypoints: [{ x: 0.60, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.28, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.74, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.72, y: 0.55, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.52, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.52, t: 1 }] },
      { id: 'd-fs', label: 'F', position: 'S', side: 'defense', start: { x: 0.32, y: 0.64 }, waypoints: [{ x: 0.28, y: 0.82, t: 1 }] },
      { id: 'd-ss', label: 'S', position: 'S', side: 'defense', start: { x: 0.68, y: 0.64 }, waypoints: [{ x: 0.72, y: 0.82, t: 1 }] },
    ],
  },
  {
    id: 'man-blitz',
    label: '0 Blitz · Mike on the A',
    shortName: '0 Blitz',
    description: 'No deep safety. Mike attacks A-gap. Press man across.',
    players: [
      { id: 'd-le', label: 'E', position: 'DL', side: 'defense', start: { x: 0.36, y: 0.34 }, waypoints: [{ x: 0.42, y: 0.26, t: 1 }] },
      { id: 'd-lt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.46, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.24, t: 1 }] },
      { id: 'd-rt', label: 'T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.54, y: 0.24, t: 1 }] },
      { id: 'd-re', label: 'E', position: 'DL', side: 'defense', start: { x: 0.64, y: 0.34 }, waypoints: [{ x: 0.58, y: 0.26, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.34, y: 0.32, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.20, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.32, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.16, y: 0.40 }, waypoints: [{ x: 0.18, y: 0.55, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.84, y: 0.40 }, waypoints: [{ x: 0.82, y: 0.55, t: 1 }] },
      { id: 'd-fs', label: 'F', position: 'S', side: 'defense', start: { x: 0.36, y: 0.58 }, waypoints: [{ x: 0.30, y: 0.70, t: 1 }] },
      { id: 'd-ss', label: 'S', position: 'S', side: 'defense', start: { x: 0.64, y: 0.58 }, waypoints: [{ x: 0.70, y: 0.70, t: 1 }] },
    ],
  },
]

// ── Plays ────────────────────────────────────────────────────────────────

const spreadRight: PlayerPath[] = [
  { id: 'lt',  label: 'LT', position: 'OL', side: 'offense', start: { x: 0.40, y: 0.26 }, waypoints: [{ x: 0.40, y: 0.30, t: 1 }], action: 'block' },
  { id: 'lg',  label: 'LG', position: 'OL', side: 'offense', start: { x: 0.46, y: 0.26 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }], action: 'block' },
  { id: 'c',   label: 'C',  position: 'OL', side: 'offense', start: { x: 0.50, y: 0.26 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }], action: 'block' },
  { id: 'rg',  label: 'RG', position: 'OL', side: 'offense', start: { x: 0.54, y: 0.26 }, waypoints: [{ x: 0.54, y: 0.30, t: 1 }], action: 'block' },
  { id: 'rt',  label: 'RT', position: 'OL', side: 'offense', start: { x: 0.60, y: 0.26 }, waypoints: [{ x: 0.60, y: 0.30, t: 1 }], action: 'block' },
  { id: 'qb',  label: 'Q',  position: 'QB', side: 'offense', start: { x: 0.50, y: 0.18 }, waypoints: [{ x: 0.50, y: 0.20, t: 0.4 }, { x: 0.50, y: 0.22, t: 1 }], action: 'pass' },
  { id: 'rb',  label: 'F',  position: 'RB', side: 'offense', start: { x: 0.46, y: 0.10 }, waypoints: [{ x: 0.50, y: 0.20, t: 0.4 }, { x: 0.42, y: 0.32, t: 1 }], action: 'route' },
  { id: 'x',   label: 'X',  position: 'WR', side: 'offense', start: { x: 0.10, y: 0.26 }, waypoints: [{ x: 0.12, y: 0.40, t: 0.5 }, { x: 0.18, y: 0.62, t: 1 }], action: 'route' },
  { id: 'z',   label: 'Z',  position: 'WR', side: 'offense', start: { x: 0.90, y: 0.26 }, waypoints: [{ x: 0.88, y: 0.50, t: 0.55 }, { x: 0.50, y: 0.70, t: 1 }], action: 'route' },
  { id: 'y',   label: 'Y',  position: 'TE', side: 'offense', start: { x: 0.66, y: 0.26 }, waypoints: [{ x: 0.66, y: 0.40, t: 0.45 }, { x: 0.50, y: 0.56, t: 1 }], action: 'route' },
  { id: 's',   label: 'H',  position: 'WR', side: 'offense', start: { x: 0.78, y: 0.24 }, waypoints: [{ x: 0.74, y: 0.42, t: 0.5 }, { x: 0.86, y: 0.62, t: 1 }], action: 'route' },
]

const trips: PlayerPath[] = [
  { id: 'lt',  label: 'LT', position: 'OL', side: 'offense', start: { x: 0.40, y: 0.26 }, waypoints: [{ x: 0.40, y: 0.30, t: 1 }], action: 'block' },
  { id: 'lg',  label: 'LG', position: 'OL', side: 'offense', start: { x: 0.46, y: 0.26 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }], action: 'block' },
  { id: 'c',   label: 'C',  position: 'OL', side: 'offense', start: { x: 0.50, y: 0.26 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }], action: 'block' },
  { id: 'rg',  label: 'RG', position: 'OL', side: 'offense', start: { x: 0.54, y: 0.26 }, waypoints: [{ x: 0.54, y: 0.30, t: 1 }], action: 'block' },
  { id: 'rt',  label: 'RT', position: 'OL', side: 'offense', start: { x: 0.60, y: 0.26 }, waypoints: [{ x: 0.60, y: 0.30, t: 1 }], action: 'block' },
  { id: 'qb',  label: 'Q',  position: 'QB', side: 'offense', start: { x: 0.50, y: 0.18 }, waypoints: [{ x: 0.50, y: 0.22, t: 1 }], action: 'pass' },
  { id: 'rb',  label: 'F',  position: 'RB', side: 'offense', start: { x: 0.40, y: 0.14 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }], action: 'block' },
  { id: 'x',   label: 'X',  position: 'WR', side: 'offense', start: { x: 0.10, y: 0.26 }, waypoints: [{ x: 0.12, y: 0.52, t: 1 }], action: 'route' },
  { id: 'z',   label: 'Z',  position: 'WR', side: 'offense', start: { x: 0.78, y: 0.24 }, waypoints: [{ x: 0.80, y: 0.55, t: 1 }], action: 'route' },
  { id: 'y',   label: 'Y',  position: 'TE', side: 'offense', start: { x: 0.84, y: 0.26 }, waypoints: [{ x: 0.84, y: 0.42, t: 0.6 }, { x: 0.72, y: 0.55, t: 1 }], action: 'route' },
  { id: 's',   label: 'H',  position: 'WR', side: 'offense', start: { x: 0.90, y: 0.22 }, waypoints: [{ x: 0.86, y: 0.38, t: 0.5 }, { x: 0.62, y: 0.60, t: 1 }], action: 'route' },
]

const iform: PlayerPath[] = [
  { id: 'lt',  label: 'LT', position: 'OL', side: 'offense', start: { x: 0.40, y: 0.26 }, waypoints: [{ x: 0.42, y: 0.32, t: 1 }], action: 'block' },
  { id: 'lg',  label: 'LG', position: 'OL', side: 'offense', start: { x: 0.46, y: 0.26 }, waypoints: [{ x: 0.48, y: 0.32, t: 1 }], action: 'block' },
  { id: 'c',   label: 'C',  position: 'OL', side: 'offense', start: { x: 0.50, y: 0.26 }, waypoints: [{ x: 0.50, y: 0.32, t: 1 }], action: 'block' },
  { id: 'rg',  label: 'RG', position: 'OL', side: 'offense', start: { x: 0.54, y: 0.26 }, waypoints: [{ x: 0.56, y: 0.32, t: 1 }], action: 'block' },
  { id: 'rt',  label: 'RT', position: 'OL', side: 'offense', start: { x: 0.60, y: 0.26 }, waypoints: [{ x: 0.62, y: 0.32, t: 1 }], action: 'block' },
  { id: 'qb',  label: 'Q',  position: 'QB', side: 'offense', start: { x: 0.50, y: 0.20 }, waypoints: [{ x: 0.46, y: 0.18, t: 0.4 }, { x: 0.42, y: 0.20, t: 1 }], action: 'pass' },
  { id: 'fb',  label: 'B',  position: 'RB', side: 'offense', start: { x: 0.50, y: 0.13 }, waypoints: [{ x: 0.56, y: 0.32, t: 1 }], action: 'block' },
  { id: 'tb',  label: 'T',  position: 'RB', side: 'offense', start: { x: 0.50, y: 0.06 }, waypoints: [{ x: 0.52, y: 0.18, t: 0.35 }, { x: 0.68, y: 0.40, t: 1 }], action: 'run' },
  { id: 'x',   label: 'X',  position: 'WR', side: 'offense', start: { x: 0.12, y: 0.26 }, waypoints: [{ x: 0.14, y: 0.55, t: 1 }], action: 'route' },
  { id: 'z',   label: 'Z',  position: 'WR', side: 'offense', start: { x: 0.86, y: 0.26 }, waypoints: [{ x: 0.84, y: 0.48, t: 1 }], action: 'block' },
  { id: 'y',   label: 'Y',  position: 'TE', side: 'offense', start: { x: 0.66, y: 0.26 }, waypoints: [{ x: 0.74, y: 0.36, t: 1 }], action: 'block' },
]

export const plays: Play[] = [
  {
    id: 'spread-y-cross',
    name: 'Spread Right · Y-Cross',
    formation: 'Spread Right',
    personnel: '11',
    situation: 'open',
    tags: ['pass', 'play-action', 'middle'],
    installStatus: 'installed',
    stats: { runs: 18, efficiency: 64, lastUsed: 'Week 7' },
    defaultDefenseId: 'cover-2',
    offense: spreadRight,
    decision: {
      atT: 0.45,
      prompt: 'MIKE blitzes?',
      branches: [
        { label: 'Yes', description: 'Hot to slot (H) on the seam — Q delivers in rhythm.' },
        { label: 'No',  description: 'Full progression: X → Z → check-down to F.' },
      ],
    },
    variants: [
      { id: 'vs-c2',  label: 'vs Cover 2',  vs: 'cover-2' },
      { id: 'vs-c3b', label: 'vs C3 Buzz',  vs: 'cover-3-buzz' },
      { id: 'vs-mb',  label: 'vs Man Blitz', vs: 'man-blitz' },
    ],
  },
  {
    id: 'trips-stick',
    name: 'Trips Right · Stick',
    formation: 'Trips Right',
    personnel: '11',
    situation: 'short',
    tags: ['pass', 'quick-game', '3rd-short'],
    installStatus: 'installed',
    stats: { runs: 24, efficiency: 71, lastUsed: 'Week 7' },
    defaultDefenseId: 'cover-3-buzz',
    offense: trips,
    decision: {
      atT: 0.50,
      prompt: 'Flat defender widens?',
      branches: [
        { label: 'Yes', description: 'Throw the stick (Y) at 5 yards.' },
        { label: 'No',  description: 'Drift to H in the flat.' },
      ],
    },
    variants: [
      { id: 'vs-c3b', label: 'vs C3 Buzz', vs: 'cover-3-buzz' },
      { id: 'vs-t2',  label: 'vs Tampa 2', vs: 'tampa-2' },
    ],
  },
  {
    id: 'iform-iso',
    name: 'I-Form · Iso Right',
    formation: 'I-Form',
    personnel: '21',
    situation: 'short',
    tags: ['run', 'inside-zone', 'goal-line'],
    installStatus: 'installed',
    stats: { runs: 31, efficiency: 58, lastUsed: 'Week 6' },
    defaultDefenseId: 'tampa-2',
    offense: iform,
    decision: {
      atT: 0.55,
      prompt: 'B-gap free runner?',
      branches: [
        { label: 'Yes', description: 'Bounce outside the RT block.' },
        { label: 'No',  description: 'Hit the A-gap behind the FB lead.' },
      ],
    },
    variants: [
      { id: 'vs-t2', label: 'vs Tampa 2', vs: 'tampa-2' },
      { id: 'vs-c2', label: 'vs Cover 2', vs: 'cover-2' },
    ],
  },
  {
    id: 'spread-rpo',
    name: 'Spread Right · Slant RPO',
    formation: 'Spread Right',
    personnel: '11',
    situation: 'open',
    tags: ['rpo', 'quick-game', '1st-10'],
    installStatus: 'teaching',
    stats: { runs: 9, efficiency: 78, lastUsed: 'Week 7' },
    defaultDefenseId: 'cover-3-buzz',
    offense: spreadRight,
    variants: [
      { id: 'vs-c3b', label: 'vs C3 Buzz', vs: 'cover-3-buzz' },
    ],
  },
  {
    id: 'trips-screen',
    name: 'Trips Right · Bubble Screen',
    formation: 'Trips Right',
    personnel: '11',
    situation: 'open',
    tags: ['screen', 'perimeter', '1st-10'],
    installStatus: 'installed',
    stats: { runs: 14, efficiency: 61, lastUsed: 'Week 7' },
    defaultDefenseId: 'cover-2',
    offense: trips,
    variants: [
      { id: 'vs-c2', label: 'vs Cover 2', vs: 'cover-2' },
    ],
  },
  {
    id: 'iform-pa-cross',
    name: 'I-Form · PA Cross',
    formation: 'I-Form',
    personnel: '21',
    situation: 'long',
    tags: ['play-action', 'pass', '3rd-long'],
    installStatus: 'planned',
    stats: { runs: 4, efficiency: 50, lastUsed: 'Week 5' },
    defaultDefenseId: 'man-blitz',
    offense: iform,
    variants: [],
  },
]

// ── Cross-sport demo plays ──────────────────────────────────────────────

const basketballSet: PlayerPath[] = [
  { id: 'pg', label: '1', position: 'PG', side: 'offense', start: { x: 0.50, y: 0.18 }, waypoints: [{ x: 0.50, y: 0.32, t: 1 }], action: 'route' },
  { id: 'sg', label: '2', position: 'SG', side: 'offense', start: { x: 0.78, y: 0.34 }, waypoints: [{ x: 0.60, y: 0.58, t: 1 }], action: 'route' },
  { id: 'sf', label: '3', position: 'SF', side: 'offense', start: { x: 0.22, y: 0.34 }, waypoints: [{ x: 0.40, y: 0.58, t: 1 }], action: 'route' },
  { id: 'pf', label: '4', position: 'PF', side: 'offense', start: { x: 0.36, y: 0.60 }, waypoints: [{ x: 0.46, y: 0.78, t: 1 }], action: 'block' },
  { id: 'c',  label: '5', position: 'C',  side: 'offense', start: { x: 0.64, y: 0.60 }, waypoints: [{ x: 0.54, y: 0.78, t: 1 }], action: 'block' },
]

const soccerSet: PlayerPath[] = [
  { id: 's-fw', label: '9',  position: 'FW',  side: 'offense', start: { x: 0.50, y: 0.60 }, waypoints: [{ x: 0.50, y: 0.80, t: 1 }], action: 'run' },
  { id: 's-am', label: '10', position: 'AM',  side: 'offense', start: { x: 0.50, y: 0.40 }, waypoints: [{ x: 0.52, y: 0.62, t: 1 }], action: 'route' },
  { id: 's-rw', label: '7',  position: 'RW',  side: 'offense', start: { x: 0.78, y: 0.50 }, waypoints: [{ x: 0.86, y: 0.75, t: 1 }], action: 'route' },
  { id: 's-lw', label: '11', position: 'LW',  side: 'offense', start: { x: 0.22, y: 0.50 }, waypoints: [{ x: 0.14, y: 0.75, t: 1 }], action: 'route' },
  { id: 's-cm1',label: '8',  position: 'CM',  side: 'offense', start: { x: 0.38, y: 0.28 }, waypoints: [{ x: 0.42, y: 0.46, t: 1 }], action: 'route' },
  { id: 's-cm2',label: '6',  position: 'CM',  side: 'offense', start: { x: 0.62, y: 0.28 }, waypoints: [{ x: 0.58, y: 0.46, t: 1 }], action: 'route' },
]

// ── Sport-specific defenses ─────────────────────────────────────────────

// ── Real football defensive schemes ─────────────────────────────────────
// LOS sits at y=0.30. Defense lines up above (y > 0.30). All x-values are
// from offense's perspective: x<0.5 is offense's left, x>0.5 is offense's right.

defenses.push(
  // FRONTS
  {
    id: '4-3-over',
    label: '4-3 Over',
    shortName: '4-3 Over',
    description: 'Four down linemen shifted toward the strong side. Sam LB walks up over the TE. Stout vs strong-side run, sound base coverage.',
    sport: 'football',
    family: 'front',
    personnel: '4-3',
    bestVs: ['run', 'pass'],
    weakness: 'Boundary perimeter run (weak side); slot drag underneath.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-9t',  label: '9T', position: 'DL', side: 'defense', start: { x: 0.70, y: 0.34 }, waypoints: [{ x: 0.72, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.30, y: 0.46 }, waypoints: [{ x: 0.30, y: 0.46, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.46, y: 0.46 }, waypoints: [{ x: 0.46, y: 0.50, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.66, y: 0.40 }, waypoints: [{ x: 0.66, y: 0.42, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.40 }, waypoints: [{ x: 0.12, y: 0.50, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.40 }, waypoints: [{ x: 0.88, y: 0.50, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.36, y: 0.62 }, waypoints: [{ x: 0.30, y: 0.78, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.64, y: 0.62 }, waypoints: [{ x: 0.70, y: 0.78, t: 1 }] },
    ],
  },
  {
    id: '4-3-under',
    label: '4-3 Under',
    shortName: '4-3 Under',
    description: 'Front shifted weak. Nose covers the center, 3-tech and 5-tech to the weak side, Sam walks over the TE. Strong against zone run.',
    sport: 'football',
    family: 'front',
    personnel: '4-3',
    bestVs: ['run'],
    weakness: 'Strong-side perimeter; slot vertical seam.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.30, y: 0.34 }, waypoints: [{ x: 0.32, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.42, y: 0.34 }, waypoints: [{ x: 0.44, y: 0.30, t: 1 }] },
      { id: 'd-n',   label: 'N', position: 'DL', side: 'defense', start: { x: 0.50, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }] },
      { id: 'd-5t',  label: '5T', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.66, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.34, y: 0.46 }, waypoints: [{ x: 0.34, y: 0.48, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.52, y: 0.46 }, waypoints: [{ x: 0.52, y: 0.50, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.72, y: 0.40 }, waypoints: [{ x: 0.72, y: 0.42, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.40 }, waypoints: [{ x: 0.12, y: 0.50, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.40 }, waypoints: [{ x: 0.88, y: 0.50, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.36, y: 0.62 }, waypoints: [{ x: 0.30, y: 0.78, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.64, y: 0.62 }, waypoints: [{ x: 0.70, y: 0.78, t: 1 }] },
    ],
  },
  {
    id: '3-4-base',
    label: '3-4 Base',
    shortName: '3-4',
    description: 'Two-gap NT, two 5-techs, two ILBs inside, two OLBs as 9-techs. Disguise pressure from anywhere on the second level.',
    sport: 'football',
    family: 'front',
    personnel: '3-4',
    bestVs: ['run', 'pass'],
    weakness: 'Quick screens to a 1-tech double-team.',
    players: [
      { id: 'd-lde', label: '5T', position: 'DL', side: 'defense', start: { x: 0.36, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-nt',  label: 'NT', position: 'DL', side: 'defense', start: { x: 0.50, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }] },
      { id: 'd-rde', label: '5T', position: 'DL', side: 'defense', start: { x: 0.64, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-jack',label: 'J', position: 'LB', side: 'defense', start: { x: 0.28, y: 0.36 }, waypoints: [{ x: 0.26, y: 0.32, t: 1 }] },
      { id: 'd-wilb',label: 'W', position: 'LB', side: 'defense', start: { x: 0.42, y: 0.46 }, waypoints: [{ x: 0.42, y: 0.50, t: 1 }] },
      { id: 'd-milb',label: 'M', position: 'LB', side: 'defense', start: { x: 0.58, y: 0.46 }, waypoints: [{ x: 0.58, y: 0.50, t: 1 }] },
      { id: 'd-sam', label: 'S', position: 'LB', side: 'defense', start: { x: 0.72, y: 0.36 }, waypoints: [{ x: 0.74, y: 0.32, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.40 }, waypoints: [{ x: 0.12, y: 0.50, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.40 }, waypoints: [{ x: 0.88, y: 0.50, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.36, y: 0.62 }, waypoints: [{ x: 0.30, y: 0.78, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.64, y: 0.62 }, waypoints: [{ x: 0.70, y: 0.78, t: 1 }] },
    ],
  },
  {
    id: 'bear-front',
    label: 'Bear Front (46)',
    shortName: 'Bear 46',
    description: '3 DT covering both A-gaps + the center. Both 5-techs on the OTs. Crushes interior run, opens the perimeter.',
    sport: 'football',
    family: 'front',
    personnel: '46',
    bestVs: ['run'],
    weakness: 'Quick boundary pass / RPO glance; perimeter sweep.',
    players: [
      { id: 'd-l5t', label: '5T', position: 'DL', side: 'defense', start: { x: 0.36, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-l1t', label: '1T', position: 'DL', side: 'defense', start: { x: 0.46, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-nt',  label: 'N', position: 'DL', side: 'defense', start: { x: 0.50, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }] },
      { id: 'd-r1t', label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.54, y: 0.30, t: 1 }] },
      { id: 'd-r5t', label: '5T', position: 'DL', side: 'defense', start: { x: 0.64, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.34, y: 0.46 }, waypoints: [{ x: 0.34, y: 0.50, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.66, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.50, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.40 }, waypoints: [{ x: 0.14, y: 0.52, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.40 }, waypoints: [{ x: 0.86, y: 0.52, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.78, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.74, y: 0.46 }, waypoints: [{ x: 0.74, y: 0.50, t: 1 }] },
    ],
  },
  {
    id: 'nickel-4-2-5',
    label: 'Nickel 4-2-5',
    shortName: 'Nickel',
    description: 'Sub package — pull a LB, add a Nickel CB over the slot. Standard answer to 11 personnel.',
    sport: 'football',
    family: 'sub-package',
    personnel: 'Nickel 4-2-5',
    bestVs: ['pass', 'rpo'],
    weakness: 'Interior duo run; gap-scheme power.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.40, y: 0.46 }, waypoints: [{ x: 0.40, y: 0.50, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.58, y: 0.46 }, waypoints: [{ x: 0.58, y: 0.50, t: 1 }] },
      { id: 'd-nb',  label: 'N', position: 'CB', side: 'defense', start: { x: 0.74, y: 0.40 }, waypoints: [{ x: 0.74, y: 0.46, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.40 }, waypoints: [{ x: 0.14, y: 0.50, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.40 }, waypoints: [{ x: 0.88, y: 0.50, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.36, y: 0.62 }, waypoints: [{ x: 0.30, y: 0.78, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.64, y: 0.62 }, waypoints: [{ x: 0.70, y: 0.78, t: 1 }] },
    ],
  },
  {
    id: 'dime-4-1-6',
    label: 'Dime 4-1-6',
    shortName: 'Dime',
    description: 'Sub package for obvious pass. Six DBs, one ILB. Built for 3rd-and-long.',
    sport: 'football',
    family: 'sub-package',
    personnel: 'Dime 4-1-6',
    bestVs: ['pass'],
    weakness: 'Anything on the ground; QB scrambles.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.50 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-n1',  label: 'N', position: 'CB', side: 'defense', start: { x: 0.32, y: 0.42 }, waypoints: [{ x: 0.32, y: 0.50, t: 1 }] },
      { id: 'd-n2',  label: 'N', position: 'CB', side: 'defense', start: { x: 0.68, y: 0.42 }, waypoints: [{ x: 0.68, y: 0.50, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.12, y: 0.52, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.88, y: 0.52, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.40, y: 0.66 }, waypoints: [{ x: 0.36, y: 0.84, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.60, y: 0.66 }, waypoints: [{ x: 0.64, y: 0.84, t: 1 }] },
    ],
  },
  {
    id: '3-3-5-stack',
    label: '3-3-5 Stack (Odd)',
    shortName: '3-3-5',
    description: 'Odd front with three stacked LBs reading the QB. Pressure can come from any second-level player.',
    sport: 'football',
    family: 'front',
    personnel: '3-3-5',
    bestVs: ['pass', 'mobile-qb', 'rpo'],
    weakness: 'Downhill double-teams on the nose; goal-line wedge.',
    players: [
      { id: 'd-lde', label: 'E', position: 'DL', side: 'defense', start: { x: 0.38, y: 0.34 }, waypoints: [{ x: 0.38, y: 0.30, t: 1 }] },
      { id: 'd-nt',  label: 'NT', position: 'DL', side: 'defense', start: { x: 0.50, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }] },
      { id: 'd-rde', label: 'E', position: 'DL', side: 'defense', start: { x: 0.62, y: 0.34 }, waypoints: [{ x: 0.62, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.38, y: 0.46 }, waypoints: [{ x: 0.38, y: 0.48, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.48, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.62, y: 0.46 }, waypoints: [{ x: 0.62, y: 0.48, t: 1 }] },
      { id: 'd-nb',  label: 'N', position: 'CB', side: 'defense', start: { x: 0.70, y: 0.42 }, waypoints: [{ x: 0.72, y: 0.50, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.40 }, waypoints: [{ x: 0.12, y: 0.50, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.40 }, waypoints: [{ x: 0.88, y: 0.50, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.40, y: 0.64 }, waypoints: [{ x: 0.34, y: 0.80, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.60, y: 0.64 }, waypoints: [{ x: 0.66, y: 0.80, t: 1 }] },
    ],
  },
  // COVERAGES
  {
    id: 'cover-0',
    label: 'Cover 0 (All-Out Man)',
    shortName: 'Cover 0',
    description: 'Zero deep safeties. Pure man across with everyone else rushing or matched on a route. Maximum pressure, maximum risk.',
    sport: 'football',
    family: 'coverage',
    personnel: '4-3 / Nickel',
    bestVs: ['run', 'screen'],
    weakness: 'Any quick separator wins big. Hot routes and double-moves are deadly.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.28, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.24, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.24, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.28, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.36, y: 0.46 }, waypoints: [{ x: 0.36, y: 0.24, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.20, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.64, y: 0.46 }, waypoints: [{ x: 0.64, y: 0.24, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.38 }, waypoints: [{ x: 0.16, y: 0.55, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.38 }, waypoints: [{ x: 0.84, y: 0.55, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.32, y: 0.58 }, waypoints: [{ x: 0.30, y: 0.50, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.68, y: 0.58 }, waypoints: [{ x: 0.70, y: 0.50, t: 1 }] },
    ],
  },
  {
    id: 'cover-1',
    label: 'Cover 1 (Man Free)',
    shortName: 'Cover 1',
    description: 'Man-to-man across with one deep free safety in the middle of the field as the only deep help.',
    sport: 'football',
    family: 'coverage',
    personnel: '4-3 / Nickel',
    bestVs: ['run', 'pass'],
    weakness: 'Verticals to the boundary; rub routes.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.36, y: 0.46 }, waypoints: [{ x: 0.34, y: 0.50, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.52, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.64, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.50, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.38 }, waypoints: [{ x: 0.16, y: 0.55, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.38 }, waypoints: [{ x: 0.84, y: 0.55, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.86, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.66, y: 0.50 }, waypoints: [{ x: 0.68, y: 0.46, t: 1 }] },
    ],
  },
  {
    id: 'cover-1-robber',
    label: 'Cover 1 Robber',
    shortName: 'C1 Robber',
    description: 'Man-free with a "robber" safety lurking in the middle hole. Punishes crossers and digs.',
    sport: 'football',
    family: 'coverage',
    personnel: '4-3 / Nickel',
    bestVs: ['pass', 'play-action'],
    weakness: 'Outside breaking routes (out, comeback); RPO glance backside.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.36, y: 0.46 }, waypoints: [{ x: 0.34, y: 0.50, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.52, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.64, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.50, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.38 }, waypoints: [{ x: 0.16, y: 0.55, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.38 }, waypoints: [{ x: 0.84, y: 0.55, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.86, t: 1 }] },
      { id: 'd-rob', label: 'R', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.50 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
    ],
  },
  {
    id: 'cover-2-man',
    label: 'Cover 2 Man (2-Man)',
    shortName: 'Cover 2 Man',
    description: 'Two deep safeties, five under in man coverage. Squeeze every route, no help underneath.',
    sport: 'football',
    family: 'coverage',
    personnel: 'Nickel',
    bestVs: ['pass', 'play-action'],
    weakness: 'Rub routes (mesh / pick); RB checkdown lanes.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.34, y: 0.42 }, waypoints: [{ x: 0.32, y: 0.46, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.42 }, waypoints: [{ x: 0.50, y: 0.46, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.66, y: 0.42 }, waypoints: [{ x: 0.68, y: 0.46, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.36 }, waypoints: [{ x: 0.16, y: 0.46, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.36 }, waypoints: [{ x: 0.84, y: 0.46, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.30, y: 0.62 }, waypoints: [{ x: 0.28, y: 0.82, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.70, y: 0.62 }, waypoints: [{ x: 0.72, y: 0.82, t: 1 }] },
    ],
  },
  {
    id: 'cover-3-sky',
    label: 'Cover 3 Sky',
    shortName: 'C3 Sky',
    description: 'Three-deep zone with the strong safety dropping down hard for the curl/flat (sky).',
    sport: 'football',
    family: 'coverage',
    personnel: '4-3',
    bestVs: ['run', 'pass'],
    weakness: 'Four-verticals to the boundary; trips matchups.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.28, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.66, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.55, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.84, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.84, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.66 }, waypoints: [{ x: 0.50, y: 0.86, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.68, y: 0.60 }, waypoints: [{ x: 0.78, y: 0.52, t: 1 }] },
    ],
  },
  {
    id: 'cover-4',
    label: 'Cover 4 (Quarters)',
    shortName: 'Quarters',
    description: 'Four-deep zone, each defender takes a quarter of the deep field. Safeties read #2 and run-fit if it stays in the box.',
    sport: 'football',
    family: 'coverage',
    personnel: '4-3 / Nickel',
    bestVs: ['pass', 'rpo'],
    weakness: 'Quick three-step game; underneath crossers.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.32, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.68, y: 0.55, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.82, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.82, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.36, y: 0.60 }, waypoints: [{ x: 0.36, y: 0.80, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.64, y: 0.60 }, waypoints: [{ x: 0.64, y: 0.80, t: 1 }] },
    ],
  },
  {
    id: 'cover-6',
    label: 'Cover 6 (Quarter-Quarter-Half)',
    shortName: 'Cover 6',
    description: 'Quarters to one side (typically field/strong), Cover 2 to the other (boundary). Built for hash-aware offenses.',
    sport: 'football',
    family: 'coverage',
    personnel: '4-3 / Nickel',
    bestVs: ['pass', 'play-action'],
    weakness: 'Trips field side overloading the quarters quarter.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.30, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.30, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.30, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.30, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.30, y: 0.46 }, waypoints: [{ x: 0.28, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.68, y: 0.55, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.50, t: 1 }] },  // boundary press, Cover 2
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.82, t: 1 }] },  // field, Quarters
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.28, y: 0.62 }, waypoints: [{ x: 0.24, y: 0.84, t: 1 }] },  // boundary half
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.66, y: 0.60 }, waypoints: [{ x: 0.66, y: 0.80, t: 1 }] },  // field quarter
    ],
  },
  // PRESSURES
  {
    id: 'double-a',
    label: 'Double A-Gap Pressure',
    shortName: 'Double A',
    description: 'Mike + Will sugar both A-gaps. Late rotate to Cover 3 or Cover 1 depending on call.',
    sport: 'football',
    family: 'pressure',
    personnel: '4-3 / Nickel',
    bestVs: ['pass', 'rpo'],
    weakness: 'Quick screen / RB checkdown if QB beats the rush.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.26, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.26, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.26, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.26, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.46, y: 0.40 }, waypoints: [{ x: 0.48, y: 0.22, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.54, y: 0.40 }, waypoints: [{ x: 0.52, y: 0.22, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.66, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.52, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.38 }, waypoints: [{ x: 0.16, y: 0.55, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.38 }, waypoints: [{ x: 0.84, y: 0.55, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.84, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.34, y: 0.60 }, waypoints: [{ x: 0.32, y: 0.50, t: 1 }] },
    ],
  },
  {
    id: 'nickel-blitz',
    label: 'Nickel Blitz',
    shortName: 'Nickel Blitz',
    description: 'Nickel CB rolls down and rushes off the edge. Mike replaces in coverage.',
    sport: 'football',
    family: 'pressure',
    personnel: 'Nickel',
    bestVs: ['pass'],
    weakness: 'Slot quick game; bubble screen back to the nickel side.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.26, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.26, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.26, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.26, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.36, y: 0.46 }, waypoints: [{ x: 0.36, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-nb',  label: 'N', position: 'CB', side: 'defense', start: { x: 0.74, y: 0.40 }, waypoints: [{ x: 0.78, y: 0.24, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.14, y: 0.38 }, waypoints: [{ x: 0.16, y: 0.55, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.86, y: 0.38 }, waypoints: [{ x: 0.84, y: 0.55, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.84, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.68, y: 0.46 }, waypoints: [{ x: 0.72, y: 0.46, t: 1 }] },
    ],
  },
  {
    id: 'edge-pressure',
    label: 'Edge Pressure (Sam Blitz)',
    shortName: 'Sam Blitz',
    description: 'Sam off the strong edge, end loops inside. Sound 5-man pressure with Cover 3 behind it.',
    sport: 'football',
    family: 'pressure',
    personnel: '4-3',
    bestVs: ['pass', 'play-action'],
    weakness: 'Backside misdirection (counter, boot away).',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.36, y: 0.26, t: 1 }] },
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.26, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.26, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.60, y: 0.28, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.32, y: 0.46 }, waypoints: [{ x: 0.30, y: 0.55, t: 1 }] },
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.72, y: 0.40 }, waypoints: [{ x: 0.78, y: 0.22, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.82, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.82, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.86, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.36, y: 0.50 }, waypoints: [{ x: 0.30, y: 0.46, t: 1 }] },
    ],
  },
  {
    id: 'sim-pressure',
    label: 'Sim Pressure (Drop the End)',
    shortName: 'Sim Pressure',
    description: 'Drop a DE into coverage, blitz a LB in his place. Same 4-man rush — different geometry.',
    sport: 'football',
    family: 'pressure',
    personnel: '4-3 / Nickel',
    bestVs: ['pass', 'rpo'],
    weakness: 'Quick screens to the dropped end\'s side; QB scrambles.',
    players: [
      { id: 'd-le',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.34, y: 0.34 }, waypoints: [{ x: 0.34, y: 0.46, t: 1 }] }, // drops
      { id: 'd-3t',  label: '3T', position: 'DL', side: 'defense', start: { x: 0.44, y: 0.34 }, waypoints: [{ x: 0.46, y: 0.26, t: 1 }] },
      { id: 'd-1t',  label: '1T', position: 'DL', side: 'defense', start: { x: 0.54, y: 0.34 }, waypoints: [{ x: 0.52, y: 0.26, t: 1 }] },
      { id: 'd-re',  label: 'E', position: 'DL', side: 'defense', start: { x: 0.66, y: 0.34 }, waypoints: [{ x: 0.64, y: 0.26, t: 1 }] },
      { id: 'd-wlb', label: 'W', position: 'LB', side: 'defense', start: { x: 0.36, y: 0.46 }, waypoints: [{ x: 0.36, y: 0.22, t: 1 }] }, // blitzes
      { id: 'd-mlb', label: 'M', position: 'LB', side: 'defense', start: { x: 0.50, y: 0.46 }, waypoints: [{ x: 0.50, y: 0.55, t: 1 }] },
      { id: 'd-slb', label: 'S', position: 'LB', side: 'defense', start: { x: 0.66, y: 0.46 }, waypoints: [{ x: 0.66, y: 0.55, t: 1 }] },
      { id: 'd-lcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.12, y: 0.42 }, waypoints: [{ x: 0.14, y: 0.82, t: 1 }] },
      { id: 'd-rcb', label: 'C', position: 'CB', side: 'defense', start: { x: 0.88, y: 0.42 }, waypoints: [{ x: 0.86, y: 0.82, t: 1 }] },
      { id: 'd-fs',  label: 'F', position: 'S',  side: 'defense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.86, t: 1 }] },
      { id: 'd-ss',  label: 'S', position: 'S',  side: 'defense', start: { x: 0.66, y: 0.62 }, waypoints: [{ x: 0.70, y: 0.50, t: 1 }] },
    ],
  },
)

// Tag the existing defenses with sport + family for the library page
defenses.forEach((d) => {
  if (d.sport) return  // already set
  d.sport = 'football'
  if (d.id === 'cover-2' || d.id === 'cover-3-buzz' || d.id === 'tampa-2') d.family = 'coverage'
  else if (d.id === 'man-blitz') d.family = 'pressure'
})

defenses.push(
  // Basketball
  {
    id: 'bball-man',
    label: 'Man-to-Man',
    shortName: 'Man',
    description: 'Tight man defense, deny first pass.',
    sport: 'basketball',
    family: 'coverage',
    players: [
      { id: 'd1', label: 'X1', position: 'PG', side: 'defense', start: { x: 0.50, y: 0.32 }, waypoints: [{ x: 0.50, y: 0.30, t: 1 }] },
      { id: 'd2', label: 'X2', position: 'SG', side: 'defense', start: { x: 0.74, y: 0.42 }, waypoints: [{ x: 0.72, y: 0.44, t: 1 }] },
      { id: 'd3', label: 'X3', position: 'SF', side: 'defense', start: { x: 0.26, y: 0.42 }, waypoints: [{ x: 0.28, y: 0.44, t: 1 }] },
      { id: 'd4', label: 'X4', position: 'PF', side: 'defense', start: { x: 0.40, y: 0.62 }, waypoints: [{ x: 0.42, y: 0.64, t: 1 }] },
      { id: 'd5', label: 'X5', position: 'C',  side: 'defense', start: { x: 0.60, y: 0.62 }, waypoints: [{ x: 0.58, y: 0.64, t: 1 }] },
    ],
  },
  {
    id: 'bball-2-3-zone',
    label: '2-3 Zone',
    shortName: '2-3 Zone',
    description: 'Two up top, three across the baseline.',
    sport: 'basketball',
    family: 'coverage',
    players: [
      { id: 'z1', label: 'Z1', position: 'PG', side: 'defense', start: { x: 0.40, y: 0.42 }, waypoints: [{ x: 0.40, y: 0.45, t: 1 }] },
      { id: 'z2', label: 'Z2', position: 'SG', side: 'defense', start: { x: 0.60, y: 0.42 }, waypoints: [{ x: 0.60, y: 0.45, t: 1 }] },
      { id: 'z3', label: 'Z3', position: 'SF', side: 'defense', start: { x: 0.28, y: 0.72 }, waypoints: [{ x: 0.28, y: 0.75, t: 1 }] },
      { id: 'z4', label: 'Z4', position: 'PF', side: 'defense', start: { x: 0.50, y: 0.72 }, waypoints: [{ x: 0.50, y: 0.75, t: 1 }] },
      { id: 'z5', label: 'Z5', position: 'C',  side: 'defense', start: { x: 0.72, y: 0.72 }, waypoints: [{ x: 0.72, y: 0.75, t: 1 }] },
    ],
  },
  // Soccer
  {
    id: 'soccer-high-block',
    label: 'High Block · 4-4-2',
    shortName: 'High 4-4-2',
    description: 'Press the build-up, compact in the middle third.',
    sport: 'soccer',
    family: 'coverage',
    players: [
      { id: 's-st1', label: '9',  position: 'ST', side: 'defense', start: { x: 0.44, y: 0.72 }, waypoints: [{ x: 0.44, y: 0.68, t: 1 }] },
      { id: 's-st2', label: '10', position: 'ST', side: 'defense', start: { x: 0.56, y: 0.72 }, waypoints: [{ x: 0.56, y: 0.68, t: 1 }] },
      { id: 's-m1',  label: '7',  position: 'M',  side: 'defense', start: { x: 0.20, y: 0.55 }, waypoints: [{ x: 0.22, y: 0.58, t: 1 }] },
      { id: 's-m2',  label: '8',  position: 'M',  side: 'defense', start: { x: 0.40, y: 0.55 }, waypoints: [{ x: 0.42, y: 0.58, t: 1 }] },
      { id: 's-m3',  label: '6',  position: 'M',  side: 'defense', start: { x: 0.60, y: 0.55 }, waypoints: [{ x: 0.58, y: 0.58, t: 1 }] },
      { id: 's-m4',  label: '11', position: 'M',  side: 'defense', start: { x: 0.80, y: 0.55 }, waypoints: [{ x: 0.78, y: 0.58, t: 1 }] },
      { id: 's-d1',  label: '2',  position: 'D',  side: 'defense', start: { x: 0.18, y: 0.38 }, waypoints: [{ x: 0.18, y: 0.40, t: 1 }] },
      { id: 's-d2',  label: '4',  position: 'D',  side: 'defense', start: { x: 0.40, y: 0.36 }, waypoints: [{ x: 0.40, y: 0.38, t: 1 }] },
      { id: 's-d3',  label: '5',  position: 'D',  side: 'defense', start: { x: 0.60, y: 0.36 }, waypoints: [{ x: 0.60, y: 0.38, t: 1 }] },
      { id: 's-d4',  label: '3',  position: 'D',  side: 'defense', start: { x: 0.82, y: 0.38 }, waypoints: [{ x: 0.82, y: 0.40, t: 1 }] },
      { id: 's-gk',  label: '1',  position: 'GK', side: 'defense', start: { x: 0.50, y: 0.22 }, waypoints: [{ x: 0.50, y: 0.20, t: 1 }] },
    ],
  },
  // Hockey
  {
    id: 'hockey-1-3-1',
    label: '1-3-1 Forecheck',
    shortName: '1-3-1 FC',
    description: 'F1 pressures, F2/F3 + D1 build the wall, D2 shadows high.',
    sport: 'hockey',
    family: 'coverage',
    players: [
      { id: 'h-f1', label: 'F1', position: 'F', side: 'defense', start: { x: 0.50, y: 0.74 }, waypoints: [{ x: 0.50, y: 0.85, t: 1 }] },
      { id: 'h-f2', label: 'F2', position: 'F', side: 'defense', start: { x: 0.30, y: 0.60 }, waypoints: [{ x: 0.32, y: 0.66, t: 1 }] },
      { id: 'h-f3', label: 'F3', position: 'F', side: 'defense', start: { x: 0.70, y: 0.60 }, waypoints: [{ x: 0.68, y: 0.66, t: 1 }] },
      { id: 'h-d1', label: 'D1', position: 'D', side: 'defense', start: { x: 0.50, y: 0.55 }, waypoints: [{ x: 0.50, y: 0.58, t: 1 }] },
      { id: 'h-d2', label: 'D2', position: 'D', side: 'defense', start: { x: 0.50, y: 0.36 }, waypoints: [{ x: 0.50, y: 0.34, t: 1 }] },
      { id: 'h-g',  label: 'G',  position: 'G', side: 'defense', start: { x: 0.50, y: 0.20 }, waypoints: [{ x: 0.50, y: 0.18, t: 1 }] },
    ],
  },
  // Baseball
  {
    id: 'baseball-standard',
    label: 'Standard Alignment',
    shortName: 'Standard',
    description: 'Straight up — corners and middle infielders honest.',
    sport: 'baseball',
    family: 'coverage',
    players: [
      { id: 'b-1b', label: '1B', position: '1B', side: 'defense', start: { x: 0.72, y: 0.34 }, waypoints: [{ x: 0.72, y: 0.36, t: 1 }] },
      { id: 'b-2b', label: '2B', position: '2B', side: 'defense', start: { x: 0.58, y: 0.50 }, waypoints: [{ x: 0.58, y: 0.52, t: 1 }] },
      { id: 'b-ss', label: 'SS', position: 'SS', side: 'defense', start: { x: 0.42, y: 0.50 }, waypoints: [{ x: 0.42, y: 0.52, t: 1 }] },
      { id: 'b-3b', label: '3B', position: '3B', side: 'defense', start: { x: 0.28, y: 0.34 }, waypoints: [{ x: 0.28, y: 0.36, t: 1 }] },
      { id: 'b-p',  label: 'P',  position: 'P',  side: 'defense', start: { x: 0.50, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.32, t: 1 }] },
      { id: 'b-c',  label: 'C',  position: 'C',  side: 'defense', start: { x: 0.50, y: 0.08 }, waypoints: [{ x: 0.50, y: 0.06, t: 1 }] },
      { id: 'b-lf', label: 'LF', position: 'OF', side: 'defense', start: { x: 0.22, y: 0.78 }, waypoints: [{ x: 0.22, y: 0.80, t: 1 }] },
      { id: 'b-cf', label: 'CF', position: 'OF', side: 'defense', start: { x: 0.50, y: 0.88 }, waypoints: [{ x: 0.50, y: 0.90, t: 1 }] },
      { id: 'b-rf', label: 'RF', position: 'OF', side: 'defense', start: { x: 0.78, y: 0.78 }, waypoints: [{ x: 0.78, y: 0.80, t: 1 }] },
    ],
  },
  // Lacrosse
  {
    id: 'lax-zone',
    label: 'Zone D · 2-3-1',
    shortName: '2-3-1 Zone',
    description: 'Two at the top, three middle, one deep on the crease.',
    sport: 'lacrosse',
    family: 'coverage',
    players: [
      { id: 'l-d1', label: 'D1', position: 'D', side: 'defense', start: { x: 0.40, y: 0.30 }, waypoints: [{ x: 0.40, y: 0.32, t: 1 }] },
      { id: 'l-d2', label: 'D2', position: 'D', side: 'defense', start: { x: 0.60, y: 0.30 }, waypoints: [{ x: 0.60, y: 0.32, t: 1 }] },
      { id: 'l-d3', label: 'D3', position: 'D', side: 'defense', start: { x: 0.28, y: 0.18 }, waypoints: [{ x: 0.28, y: 0.20, t: 1 }] },
      { id: 'l-d4', label: 'D4', position: 'D', side: 'defense', start: { x: 0.50, y: 0.18 }, waypoints: [{ x: 0.50, y: 0.20, t: 1 }] },
      { id: 'l-d5', label: 'D5', position: 'D', side: 'defense', start: { x: 0.72, y: 0.18 }, waypoints: [{ x: 0.72, y: 0.20, t: 1 }] },
      { id: 'l-d6', label: 'D6', position: 'D', side: 'defense', start: { x: 0.50, y: 0.12 }, waypoints: [{ x: 0.50, y: 0.14, t: 1 }] },
      { id: 'l-g',  label: 'G',  position: 'G', side: 'defense', start: { x: 0.50, y: 0.08 }, waypoints: [{ x: 0.50, y: 0.06, t: 1 }] },
    ],
  },
)

// ── Cross-sport offensive plays ─────────────────────────────────────────

const hockeyForechek: PlayerPath[] = [
  { id: 'h-c',  label: 'C',  position: 'F',  side: 'offense', start: { x: 0.50, y: 0.45 }, waypoints: [{ x: 0.50, y: 0.70, t: 1 }], action: 'route' },
  { id: 'h-lw', label: 'LW', position: 'F',  side: 'offense', start: { x: 0.30, y: 0.45 }, waypoints: [{ x: 0.20, y: 0.78, t: 1 }], action: 'route' },
  { id: 'h-rw', label: 'RW', position: 'F',  side: 'offense', start: { x: 0.70, y: 0.45 }, waypoints: [{ x: 0.80, y: 0.78, t: 1 }], action: 'route' },
  { id: 'h-ld', label: 'LD', position: 'D',  side: 'offense', start: { x: 0.40, y: 0.32 }, waypoints: [{ x: 0.40, y: 0.40, t: 1 }], action: 'block' },
  { id: 'h-rd', label: 'RD', position: 'D',  side: 'offense', start: { x: 0.60, y: 0.32 }, waypoints: [{ x: 0.60, y: 0.40, t: 1 }], action: 'block' },
  { id: 'h-g',  label: 'G',  position: 'G',  side: 'offense', start: { x: 0.50, y: 0.20 }, waypoints: [{ x: 0.50, y: 0.18, t: 1 }], action: 'block' },
]

const baseballShift: PlayerPath[] = [
  { id: 'ba',   label: 'B',  position: 'BAT', side: 'offense', start: { x: 0.50, y: 0.10 }, waypoints: [{ x: 0.74, y: 0.34, t: 1 }], action: 'run' },
  { id: 'r1',   label: 'R1', position: 'R',   side: 'offense', start: { x: 0.74, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.58, t: 1 }], action: 'run' },
  { id: 'r2',   label: 'R2', position: 'R',   side: 'offense', start: { x: 0.50, y: 0.58 }, waypoints: [{ x: 0.26, y: 0.34, t: 1 }], action: 'run' },
  { id: 'r3',   label: 'R3', position: 'R',   side: 'offense', start: { x: 0.26, y: 0.34 }, waypoints: [{ x: 0.50, y: 0.10, t: 1 }], action: 'run' },
]

const laxOffense: PlayerPath[] = [
  { id: 'a1',  label: 'A1', position: 'A',   side: 'offense', start: { x: 0.30, y: 0.78 }, waypoints: [{ x: 0.40, y: 0.86, t: 1 }], action: 'route' },
  { id: 'a2',  label: 'A2', position: 'A',   side: 'offense', start: { x: 0.70, y: 0.78 }, waypoints: [{ x: 0.60, y: 0.86, t: 1 }], action: 'route' },
  { id: 'a3',  label: 'A3', position: 'A',   side: 'offense', start: { x: 0.50, y: 0.84 }, waypoints: [{ x: 0.50, y: 0.92, t: 1 }], action: 'run' },
  { id: 'm1',  label: 'M1', position: 'M',   side: 'offense', start: { x: 0.30, y: 0.62 }, waypoints: [{ x: 0.32, y: 0.70, t: 1 }], action: 'route' },
  { id: 'm2',  label: 'M2', position: 'M',   side: 'offense', start: { x: 0.50, y: 0.62 }, waypoints: [{ x: 0.50, y: 0.70, t: 1 }], action: 'route' },
  { id: 'm3',  label: 'M3', position: 'M',   side: 'offense', start: { x: 0.70, y: 0.62 }, waypoints: [{ x: 0.68, y: 0.70, t: 1 }], action: 'route' },
]

plays.push(
  {
    id: 'bball-horns',
    name: 'Horns · Pop Action',
    sport: 'basketball',
    formation: 'Horns',
    personnel: '5-out',
    situation: 'open',
    tags: ['set', 'pnr', 'half-court'],
    installStatus: 'installed',
    stats: { runs: 12, efficiency: 68, lastUsed: 'Week 7' },
    defaultDefenseId: 'bball-man',
    offense: basketballSet,
    variants: [],
  },
  {
    id: 'bball-zone-buster',
    name: 'Zone Buster · Skip',
    sport: 'basketball',
    formation: 'Spread',
    personnel: '4-out 1-in',
    situation: 'open',
    tags: ['set', 'zone-attack', 'half-court'],
    installStatus: 'teaching',
    stats: { runs: 6, efficiency: 58, lastUsed: 'Week 7' },
    defaultDefenseId: 'bball-2-3-zone',
    offense: basketballSet,
    variants: [],
  },
  {
    id: 'soccer-433-press',
    name: '4-3-3 · High Press Trigger',
    sport: 'soccer',
    formation: '4-3-3',
    personnel: 'XI',
    situation: 'open',
    tags: ['press', 'transition'],
    installStatus: 'installed',
    stats: { runs: 6, efficiency: 55, lastUsed: 'Week 7' },
    defaultDefenseId: 'soccer-high-block',
    offense: soccerSet,
    variants: [],
  },
  {
    id: 'hockey-cycle',
    name: 'Cycle · Low Down Wall',
    sport: 'hockey',
    formation: 'Low Cycle',
    personnel: '5v5',
    situation: 'open',
    tags: ['cycle', 'o-zone'],
    installStatus: 'installed',
    stats: { runs: 14, efficiency: 62, lastUsed: 'Week 7' },
    defaultDefenseId: 'hockey-1-3-1',
    offense: hockeyForechek,
    variants: [],
  },
  {
    id: 'baseball-first-third',
    name: 'First-and-Third · Steal',
    sport: 'baseball',
    formation: 'First & Third',
    personnel: '—',
    situation: 'short',
    tags: ['baserunning', 'steal'],
    installStatus: 'installed',
    stats: { runs: 4, efficiency: 75, lastUsed: 'Week 7' },
    defaultDefenseId: 'baseball-standard',
    offense: baseballShift,
    variants: [],
  },
  {
    id: 'lax-2-1-3',
    name: '2-1-3 · Pick & Roll',
    sport: 'lacrosse',
    formation: '2-1-3',
    personnel: '6v6',
    situation: 'open',
    tags: ['set', 'pnr', 'crease'],
    installStatus: 'installed',
    stats: { runs: 8, efficiency: 60, lastUsed: 'Week 7' },
    defaultDefenseId: 'lax-zone',
    offense: laxOffense,
    variants: [],
  },
)

export function getPlay(id: string): Play | undefined {
  return plays.find((p) => p.id === id)
}

export function getDefense(id: string): DefensiveAlignment | undefined {
  return defenses.find((d) => d.id === id)
}
