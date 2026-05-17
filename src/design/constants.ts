// Atlas Coach — global design tokens.
// All colors live here. No raw hex values inside components.

export const FONT = {
  display: 'var(--font-cormorant), serif',
  body: 'var(--font-dm-sans), sans-serif',
  label: 'var(--font-syncopate), sans-serif',
} as const

export const PALETTE = {
  // Base
  base: '#05050c',
  baseSoft: '#07070f',
  surface: 'rgba(255,255,255,0.03)',
  surfaceStrong: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.04)',

  // Text
  text: '#f3f0e8',
  textSub: 'rgba(243,240,232,0.72)',
  textMuted: 'rgba(243,240,232,0.46)',
  textFaint: 'rgba(243,240,232,0.28)',

  // Brass family (totals / shimmer / primary accent)
  brass: '#e8c376',
  brassRGB: '232,195,118',

  // Pillar accents
  playbookRGB: '232,195,118',   // brass
  rosterRGB: '167,139,250',     // violet #a78bfa
  practiceRGB: '6,182,212',     // azure
  gameRGB: '16,185,129',        // emerald

  // Secondary partner accents
  cyanRGB: '34,211,238',
  goldRGB: '232,195,118',
  emeraldRGB: '16,185,129',
  violetRGB: '167,139,250',
  azureRGB: '6,182,212',
  amberRGB: '245,158,11',
  redRGB: '239,68,68',
  lossText: '#fca5a5',
} as const

export type PillarSlug = 'playbook' | 'roster' | 'practice' | 'game'

export const PILLARS: Record<PillarSlug, {
  label: string
  accentHex: string
  accentRGB: string
  secondaryRGB: string
}> = {
  playbook: { label: 'Playbook', accentHex: '#e8c376', accentRGB: PALETTE.playbookRGB, secondaryRGB: PALETTE.cyanRGB },
  roster:   { label: 'Roster',   accentHex: '#a78bfa', accentRGB: PALETTE.rosterRGB,   secondaryRGB: PALETTE.brassRGB },
  practice: { label: 'Practice', accentHex: '#06b6d4', accentRGB: PALETTE.practiceRGB, secondaryRGB: PALETTE.brassRGB },
  game:     { label: 'Game',     accentHex: '#10b981', accentRGB: PALETTE.gameRGB,     secondaryRGB: PALETTE.brassRGB },
}

export const SPRING = {
  snappy: { type: 'spring' as const, stiffness: 500, damping: 32 },
  gentle: { type: 'spring' as const, stiffness: 260, damping: 28 },
  modal:  { type: 'spring' as const, stiffness: 180, damping: 24 },
}

export const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

export const RADIUS = { sm: 12, md: 16, lg: 22, pill: 999 } as const

export const TYPE = {
  label: {
    fontFamily: FONT.label,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.20em',
    textTransform: 'uppercase' as const,
  },
  labelSm: {
    fontFamily: FONT.label,
    fontWeight: 700,
    fontSize: 9,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
  },
  kicker: {
    fontFamily: FONT.label,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
  },
  display: {
    fontFamily: FONT.display,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  body: {
    fontFamily: FONT.body,
    fontWeight: 400,
  },
}
