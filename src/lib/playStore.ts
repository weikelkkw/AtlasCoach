'use client'

// Per-play edit persistence — lightweight localStorage mirror keyed by
// play id. Designer edits survive reloads until Supabase lands.

import { useEffect, useState, useCallback } from 'react'
import type { Play } from '@/data/plays'

const KEY_PREFIX = 'atlas-coach.play.'

function load(id: string): Play | null {
  try {
    const raw = typeof window === 'undefined' ? null : localStorage.getItem(KEY_PREFIX + id)
    if (!raw) return null
    return JSON.parse(raw) as Play
  } catch {
    return null
  }
}

function save(id: string, play: Play) {
  try {
    localStorage.setItem(KEY_PREFIX + id, JSON.stringify(play))
  } catch { /* quota / private mode */ }
}

function clear(id: string) {
  try { localStorage.removeItem(KEY_PREFIX + id) } catch { /* ignore */ }
}

export function useEditedPlay(original: Play | undefined): {
  current: Play | undefined
  isEdited: boolean
  saveEdit: (next: Play) => void
  revert: () => void
} {
  const [edit, setEdit] = useState<Play | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate on mount
  useEffect(() => {
    if (!original) return
    const stored = load(original.id)
    if (stored) setEdit(stored)
    setHydrated(true)
  }, [original])

  const saveEdit = useCallback((next: Play) => {
    setEdit(next)
    save(next.id, next)
  }, [])

  const revert = useCallback(() => {
    if (!original) return
    clear(original.id)
    setEdit(null)
  }, [original])

  const current = hydrated ? (edit ?? original) : original
  const isEdited = hydrated && edit != null
  return { current, isEdited, saveEdit, revert }
}
