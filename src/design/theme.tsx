'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { PALETTE, PILLARS, type PillarSlug } from './constants'

interface ThemeShape {
  base: string
  text: string
  textSub: string
  textMuted: string
  accent: string
  accentRGB: string
  glass: string
  pillar: PillarSlug
  pillarMeta: typeof PILLARS[PillarSlug]
}

const defaultTheme: ThemeShape = {
  base: PALETTE.base,
  text: PALETTE.text,
  textSub: PALETTE.textSub,
  textMuted: PALETTE.textMuted,
  accent: PILLARS.playbook.accentHex,
  accentRGB: PILLARS.playbook.accentRGB,
  glass: PALETTE.surface,
  pillar: 'playbook',
  pillarMeta: PILLARS.playbook,
}

const ThemeContext = createContext<ThemeShape>(defaultTheme)

export function ThemeProvider({ children, pillar = 'playbook' }: { children: ReactNode; pillar?: PillarSlug }) {
  const meta = PILLARS[pillar]
  const value: ThemeShape = {
    ...defaultTheme,
    accent: meta.accentHex,
    accentRGB: meta.accentRGB,
    pillar,
    pillarMeta: meta,
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function usePillar(slug: PillarSlug) {
  return PILLARS[slug]
}
