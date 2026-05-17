'use client'

// Custom defense storage — user-imported alignments live in localStorage
// under `atlas-coach.defense.<id>`. An index key lists the IDs.

import { useEffect, useState, useCallback } from 'react'
import type { DefensiveAlignment } from '@/data/plays'

const KEY_PREFIX = 'atlas-coach.defense.'
const INDEX_KEY = 'atlas-coach.defense.index'

function loadIndex(): string[] {
  try {
    const raw = typeof window === 'undefined' ? null : localStorage.getItem(INDEX_KEY)
    return raw ? JSON.parse(raw) as string[] : []
  } catch { return [] }
}

function saveIndex(ids: string[]) {
  try { localStorage.setItem(INDEX_KEY, JSON.stringify(ids)) } catch { /* ignore */ }
}

function loadOne(id: string): DefensiveAlignment | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + id)
    return raw ? JSON.parse(raw) as DefensiveAlignment : null
  } catch { return null }
}

function saveOne(d: DefensiveAlignment) {
  try { localStorage.setItem(KEY_PREFIX + d.id, JSON.stringify(d)) } catch { /* ignore */ }
}

function deleteOne(id: string) {
  try { localStorage.removeItem(KEY_PREFIX + id) } catch { /* ignore */ }
}

export function loadAllCustom(): DefensiveAlignment[] {
  if (typeof window === 'undefined') return []
  return loadIndex().map(loadOne).filter((d): d is DefensiveAlignment => d != null)
}

export function useCustomDefenses(): {
  custom: DefensiveAlignment[]
  add: (d: DefensiveAlignment) => void
  remove: (id: string) => void
  refresh: () => void
} {
  const [custom, setCustom] = useState<DefensiveAlignment[]>([])

  const refresh = useCallback(() => {
    setCustom(loadAllCustom())
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = useCallback((d: DefensiveAlignment) => {
    const marked: DefensiveAlignment = { ...d, custom: true }
    saveOne(marked)
    const ids = loadIndex()
    if (!ids.includes(d.id)) saveIndex([...ids, d.id])
    setCustom(loadAllCustom())
  }, [])

  const remove = useCallback((id: string) => {
    deleteOne(id)
    saveIndex(loadIndex().filter((x) => x !== id))
    setCustom(loadAllCustom())
  }, [])

  return { custom, add, remove, refresh }
}

// Schema validator for imported JSON.
export function validateDefense(raw: unknown): { ok: true; defense: DefensiveAlignment } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Expected a JSON object.' }
  const r = raw as Record<string, unknown>
  if (typeof r.label !== 'string') return { ok: false, error: 'Missing "label" string.' }
  if (typeof r.shortName !== 'string') return { ok: false, error: 'Missing "shortName" string.' }
  if (typeof r.description !== 'string') return { ok: false, error: 'Missing "description" string.' }
  if (!Array.isArray(r.players)) return { ok: false, error: 'Missing "players" array.' }
  if (r.players.length === 0) return { ok: false, error: '"players" array is empty.' }

  const players = r.players as unknown[]
  for (let i = 0; i < players.length; i++) {
    const p = players[i] as Record<string, unknown> | null
    if (!p || typeof p !== 'object') return { ok: false, error: `Player ${i} is not an object.` }
    if (typeof p.label !== 'string') return { ok: false, error: `Player ${i} missing "label".` }
    if (typeof p.position !== 'string') return { ok: false, error: `Player ${i} missing "position".` }
    const start = p.start as Record<string, unknown> | null
    if (!start || typeof start.x !== 'number' || typeof start.y !== 'number') {
      return { ok: false, error: `Player ${i} missing "start: { x, y }" with numeric values.` }
    }
    if (start.x < 0 || start.x > 1 || start.y < 0 || start.y > 1) {
      return { ok: false, error: `Player ${i} start coords must be in 0..1 (field-normalized).` }
    }
    if (p.waypoints != null && !Array.isArray(p.waypoints)) {
      return { ok: false, error: `Player ${i} "waypoints" must be an array if provided.` }
    }
  }

  // Normalize each player to a complete PlayerPath
  const norm = players.map((raw, i) => {
    const p = raw as Record<string, unknown>
    const start = p.start as { x: number; y: number }
    return {
      id: typeof p.id === 'string' ? p.id : `imp-${i}`,
      label: p.label as string,
      position: p.position as string,
      side: 'defense' as const,
      start: { x: start.x, y: start.y },
      waypoints: Array.isArray(p.waypoints)
        ? (p.waypoints as Array<{ x: number; y: number; t?: number }>).map((w, j, arr) => ({
            x: w.x, y: w.y, t: typeof w.t === 'number' ? w.t : (j + 1) / arr.length,
          }))
        : [],
    }
  })

  const id = typeof r.id === 'string' ? r.id : `import-${Date.now()}`
  const defense: DefensiveAlignment = {
    id,
    label: r.label as string,
    shortName: r.shortName as string,
    description: r.description as string,
    players: norm,
    sport: typeof r.sport === 'string' ? r.sport as DefensiveAlignment['sport'] : 'football',
    family: typeof r.family === 'string' ? r.family as DefensiveAlignment['family'] : undefined,
    personnel: typeof r.personnel === 'string' ? r.personnel : undefined,
    custom: true,
  }
  return { ok: true, defense }
}
