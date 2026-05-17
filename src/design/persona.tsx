'use client'

// PersonaContext — current "view-as" role. Drives sidebar nav scoping and
// surfaces a Top Bar pill. Persists choice to localStorage so a refresh
// keeps the same persona.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Persona = 'head-coach' | 'coordinator' | 'player' | 'parent'

interface PersonaShape {
  persona: Persona
  setPersona: (p: Persona) => void
  isAllowed: (key: string) => boolean
}

const PersonaContext = createContext<PersonaShape | null>(null)

const STORAGE_KEY = 'atlas-coach.persona'

// Which sidebar nav items each persona can see
const NAV_GRANTS: Record<Persona, Set<string>> = {
  'head-coach':  new Set(['dashboard', 'playbook', 'roster', 'practice', 'game', 'film', 'scout', 'analytics']),
  'coordinator': new Set(['dashboard', 'playbook', 'roster', 'practice', 'game', 'film', 'scout', 'analytics']),
  'player':      new Set(['dashboard', 'playbook', 'roster', 'game', 'film']),
  'parent':      new Set(['dashboard', 'game', 'roster']),
}

export const PERSONA_LABEL: Record<Persona, string> = {
  'head-coach':  'Head Coach',
  'coordinator': 'Coordinator',
  'player':      'Player',
  'parent':      'Parent',
}

export const PERSONA_ICON: Record<Persona, string> = {
  'head-coach':  'whistle',
  'coordinator': 'clipboard',
  'player':      'roster',
  'parent':      'chat',
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>('head-coach')

  // Restore from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Persona | null
      if (saved && saved in NAV_GRANTS) setPersonaState(saved)
    } catch { /* private mode etc */ }
  }, [])

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p)
    try { localStorage.setItem(STORAGE_KEY, p) } catch { /* ignore */ }
  }, [])

  const isAllowed = useCallback((key: string) => {
    return NAV_GRANTS[persona].has(key)
  }, [persona])

  const value = useMemo(() => ({ persona, setPersona, isAllowed }), [persona, setPersona, isAllowed])

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
}

export function usePersona(): PersonaShape {
  const ctx = useContext(PersonaContext)
  if (!ctx) {
    // SSR-safe fallback — no persona scoping
    return {
      persona: 'head-coach',
      setPersona: () => {},
      isAllowed: () => true,
    }
  }
  return ctx
}
