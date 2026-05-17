'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import { FONT, PALETTE } from '@/design/constants'
import { plays } from '@/data/plays'
import { roster } from '@/data/roster'
import { drills } from '@/data/drills'
import { opponents } from '@/data/opponents'

interface Entry {
  id: string
  label: string
  sub?: string
  group: string
  icon: string
  accent: string
  href: string
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const corpus: Entry[] = useMemo(() => {
    return [
      // Navigation primitives
      { id: 'nav-dash',     label: 'Dashboard',        sub: 'Today / This week / Next game', group: 'Pages', icon: 'sparkle',      accent: PALETTE.brassRGB,    href: '/dashboard' },
      { id: 'nav-playbook', label: 'Playbook',         sub: 'All plays + filters',          group: 'Pages', icon: 'play-diagram', accent: PALETTE.brassRGB,    href: '/playbook/plays' },
      { id: 'nav-defenses', label: 'Defense Library',  sub: 'Fronts · coverages · pressures',group: 'Pages', icon: 'depth',        accent: PALETTE.violetRGB,   href: '/playbook/defenses' },
      { id: 'nav-install',  label: 'Install Plan',     sub: '12-week grid',                  group: 'Pages', icon: 'calendar',     accent: PALETTE.brassRGB,    href: '/playbook/install' },
      { id: 'nav-roster',   label: 'Roster',           sub: 'Players',                       group: 'Pages', icon: 'roster',       accent: PALETTE.violetRGB,   href: '/roster/players' },
      { id: 'nav-depth',    label: 'Depth Chart',      sub: 'Drag-and-drop',                 group: 'Pages', icon: 'depth',        accent: PALETTE.violetRGB,   href: '/roster/depth-chart' },
      { id: 'nav-att',      label: 'Attendance',       sub: 'Week grid',                     group: 'Pages', icon: 'calendar',     accent: PALETTE.violetRGB,   href: '/roster/attendance' },
      { id: 'nav-comms',    label: 'Comms',            sub: 'Threads',                       group: 'Pages', icon: 'chat',         accent: PALETTE.violetRGB,   href: '/roster/comms' },
      { id: 'nav-practice', label: 'Practice Plans',   sub: 'Period scripts',                group: 'Pages', icon: 'clipboard',    accent: PALETTE.cyanRGB,     href: '/practice/plans' },
      { id: 'nav-drills',   label: 'Drill Library',    sub: 'All drills',                    group: 'Pages', icon: 'play-diagram', accent: PALETTE.cyanRGB,     href: '/practice/drills' },
      { id: 'nav-upcoming', label: 'Schedule',         sub: 'Upcoming games',                group: 'Pages', icon: 'whistle',      accent: PALETTE.emeraldRGB,  href: '/game/upcoming' },
      { id: 'nav-film',     label: 'Film Library',     sub: 'Clips & tags',                  group: 'Pages', icon: 'film',         accent: PALETTE.cyanRGB,     href: '/film/library' },
      { id: 'nav-scout',    label: 'Scout Opponents',  sub: 'Tendency heatmaps',             group: 'Pages', icon: 'scout',        accent: PALETTE.amberRGB,    href: '/scout/opponents' },
      { id: 'nav-anal',     label: 'Analytics',        sub: 'Off / Def / Workload / Install',group: 'Pages', icon: 'analytics',    accent: PALETTE.emeraldRGB,  href: '/analytics' },
      { id: 'nav-settings', label: 'Team Settings',    sub: 'Branding, season',              group: 'Pages', icon: 'settings',     accent: PALETTE.brassRGB,    href: '/settings/team' },
      { id: 'nav-sport',    label: 'Active Sport',     sub: 'Switch sport',                  group: 'Pages', icon: 'whistle',      accent: PALETTE.brassRGB,    href: '/settings/sport' },
      { id: 'nav-billing',  label: 'Billing',          sub: 'Plans',                         group: 'Pages', icon: 'trophy',       accent: PALETTE.brassRGB,    href: '/settings/billing' },
      // Plays
      ...plays.map<Entry>((p) => ({
        id: `play-${p.id}`,
        label: p.name,
        sub: `${(p.sport ?? 'football').toUpperCase()} · ${p.formation}`,
        group: 'Plays',
        icon: 'play-diagram',
        accent: PALETTE.brassRGB,
        href: `/playbook/plays/${p.id}`,
      })),
      // Players
      ...roster.map<Entry>((p) => ({
        id: `player-${p.id}`,
        label: p.name,
        sub: `#${p.jersey} · ${p.position} · ${p.classYear}`,
        group: 'Players',
        icon: 'roster',
        accent: PALETTE.violetRGB,
        href: `/roster/players/${p.id}`,
      })),
      // Drills
      ...drills.map<Entry>((d) => ({
        id: `drill-${d.id}`,
        label: d.name,
        sub: `${d.category} · ${d.position}`,
        group: 'Drills',
        icon: 'clipboard',
        accent: PALETTE.cyanRGB,
        href: `/practice/drills`,
      })),
      // Opponents
      ...opponents.map<Entry>((o) => ({
        id: `opp-${o.id}`,
        label: o.name,
        sub: `${o.record.w}–${o.record.l}`,
        group: 'Opponents',
        icon: 'scout',
        accent: PALETTE.amberRGB,
        href: `/scout/opponents/${o.id}`,
      })),
    ]
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return corpus.slice(0, 16)
    const q = query.toLowerCase()
    return corpus
      .filter((e) => e.label.toLowerCase().includes(q) || e.sub?.toLowerCase().includes(q) || e.group.toLowerCase().includes(q))
      .slice(0, 24)
  }, [query, corpus])

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Keyboard nav
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
      else if (e.key === 'Enter') {
        e.preventDefault()
        const target = filtered[active]
        if (target) { router.push(target.href); onClose() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, active, onClose, router])

  // Reset active when query changes
  useEffect(() => { setActive(0) }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '14vh 24px 24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 640,
              borderRadius: 18,
              background: `linear-gradient(180deg, rgba(14,14,22,0.95), rgba(8,8,14,0.95))`,
              border: `1px solid rgba(${PALETTE.brassRGB},0.30)`,
              boxShadow: `0 24px 60px -16px rgba(0,0,0,0.7), 0 0 0 1px rgba(${PALETTE.brassRGB},0.15)`,
              backdropFilter: 'blur(20px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
              overflow: 'hidden',
            }}
          >
            {/* Input row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${PALETTE.border}` }}>
              <OutlineIcon name="search" color={`rgba(${PALETTE.brassRGB},0.85)`} size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plays, players, drills, opponents…"
                style={{
                  flex: 1, padding: '6px 0',
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: FONT.body, fontSize: 16, fontWeight: 500, color: PALETTE.text,
                  letterSpacing: '-0.01em',
                }}
              />
              <span style={{
                padding: '3px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                color: PALETTE.textMuted,
              }}>
                ESC
              </span>
            </div>

            {/* Results */}
            <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: '8px 8px 12px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 26, textAlign: 'center', fontFamily: FONT.body, fontSize: 13, color: PALETTE.textMuted }}>
                  No matches.
                </div>
              ) : (
                groupAndRender(filtered, active, (e, idx) => {
                  router.push(e.href); onClose()
                  void idx
                })
              )}
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 18px',
              borderTop: `1px solid ${PALETTE.border}`,
              fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
              color: PALETTE.textMuted,
            }}>
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span style={{ flex: 1 }} />
              <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.cyanRGB}>Atlas Coach</Shimmer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function groupAndRender(items: Entry[], active: number, onPick: (e: Entry, idx: number) => void) {
  // Preserve order; render groups in the order they first appear.
  const seen = new Set<string>()
  const groups: { name: string; items: { e: Entry; idx: number }[] }[] = []
  items.forEach((e, idx) => {
    if (!seen.has(e.group)) { groups.push({ name: e.group, items: [] }); seen.add(e.group) }
    groups[groups.findIndex((g) => g.name === e.group)].items.push({ e, idx })
  })
  return groups.map((g) => (
    <div key={g.name} style={{ marginBottom: 6 }}>
      <div style={{ padding: '8px 14px 4px' }}>
        <Kicker size={9} color={PALETTE.textMuted}>{g.name}</Kicker>
      </div>
      {g.items.map(({ e, idx }) => {
        const isActive = idx === active
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onPick(e, idx)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '10px 12px',
              margin: '0 4px',
              borderRadius: 10,
              background: isActive
                ? `linear-gradient(145deg, rgba(${e.accent},0.16), rgba(${PALETTE.cyanRGB},0.04))`
                : 'transparent',
              border: isActive ? `1px solid rgba(${e.accent},0.40)` : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <IconPlinth accentRgb={e.accent} size={30} withBrackets={false}>
              <OutlineIcon name={e.icon} color={`rgb(${e.accent})`} size={14} />
            </IconPlinth>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.label}
              </div>
              {e.sub && <div style={{ fontFamily: FONT.body, fontSize: 11, color: PALETTE.textMuted, marginTop: 2 }}>{e.sub}</div>}
            </div>
            {isActive && (
              <span style={{
                padding: '2px 7px', borderRadius: 6,
                background: `rgba(${e.accent},0.12)`,
                border: `1px solid rgba(${e.accent},0.30)`,
                fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.16em',
                color: `rgba(${e.accent},0.95)`,
              }}>↵</span>
            )}
          </button>
        )
      })}
    </div>
  ))
}
