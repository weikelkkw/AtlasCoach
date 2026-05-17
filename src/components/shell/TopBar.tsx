'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OutlineIcon from '@/components/OutlineIcon'
import IconButton from '@/components/ui/IconButton'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import CommandPalette from './CommandPalette'
import { FONT, PALETTE } from '@/design/constants'
import { usePersona, PERSONA_LABEL, PERSONA_ICON, type Persona } from '@/design/persona'

const PERSONAS: Persona[] = ['head-coach', 'coordinator', 'player', 'parent']

export default function TopBar() {
  const { persona, setPersona } = usePersona()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [personaOpen, setPersonaOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [lastSavedAgo, setLastSavedAgo] = useState<string>('moments ago')

  // ⌘K / Ctrl+K to open palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
      if (e.key === '/' && !(e.metaKey || e.ctrlKey)) {
        const tag = (e.target as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Mock "last saved" ticker
  useEffect(() => {
    const id = setInterval(() => {
      const opts = ['moments ago', '< 1 min', '2 min ago', '5 min ago']
      setLastSavedAgo(opts[Math.floor(Math.random() * opts.length)])
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 22px',
          background: 'linear-gradient(180deg, rgba(7,7,15,0.92), rgba(7,7,15,0.65) 80%, transparent)',
          backdropFilter: 'blur(14px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
          borderBottom: `1px solid ${PALETTE.border}`,
        }}
      >
        {/* Search trigger pill */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            cursor: 'pointer',
            color: PALETTE.textMuted,
            minWidth: 280,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <OutlineIcon name="search" color={PALETTE.textSub} size={14} />
          <span style={{ flex: 1, textAlign: 'left', fontFamily: FONT.body, fontSize: 12, fontWeight: 500 }}>
            Search plays, players, drills…
          </span>
          <span style={{
            padding: '2px 7px', borderRadius: 6,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
            color: PALETTE.textMuted,
          }}>⌘K</span>
        </button>

        <span style={{ flex: 1 }} />

        {/* Last saved indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid rgba(${PALETTE.emeraldRGB},0.20)`,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: `rgb(${PALETTE.emeraldRGB})`,
            boxShadow: `0 0 6px rgba(${PALETTE.emeraldRGB},0.7)`,
          }} />
          <Kicker size={8} color={`rgba(${PALETTE.emeraldRGB},0.95)`}>SAVED · {lastSavedAgo}</Kicker>
        </div>

        {/* Persona switcher */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setPersonaOpen((o) => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 12px 6px 8px',
              borderRadius: 999,
              background: `linear-gradient(145deg, rgba(${PALETTE.brassRGB},0.16), rgba(${PALETTE.cyanRGB},0.04))`,
              border: `1px solid rgba(${PALETTE.brassRGB},0.35)`,
              cursor: 'pointer',
            }}
          >
            <IconPlinth accentRgb={PALETTE.brassRGB} size={28} withBrackets={false}>
              <OutlineIcon name={PERSONA_ICON[persona]} color={`rgb(${PALETTE.brassRGB})`} size={14} />
            </IconPlinth>
            <span style={{
              fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
              color: 'transparent',
            }}>
              <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.cyanRGB}>{PERSONA_LABEL[persona]}</Shimmer>
            </span>
            <OutlineIcon name="forward" color={PALETTE.textMuted} size={11} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <AnimatePresence>
            {personaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                onMouseLeave={() => setPersonaOpen(false)}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  minWidth: 240,
                  background: 'rgba(8,8,16,0.95)',
                  border: `1px solid rgba(${PALETTE.brassRGB},0.30)`,
                  borderRadius: 14,
                  padding: 6,
                  backdropFilter: 'blur(14px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
                  boxShadow: '0 14px 32px -10px rgba(0,0,0,0.7)',
                  zIndex: 50,
                }}
              >
                <div style={{ padding: '8px 10px 6px' }}>
                  <Kicker size={9} color={PALETTE.textMuted}>View as</Kicker>
                </div>
                {PERSONAS.map((p) => {
                  const active = p === persona
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setPersona(p); setPersonaOpen(false) }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '8px 10px', borderRadius: 10,
                        background: active
                          ? `linear-gradient(145deg, rgba(${PALETTE.brassRGB},0.16), rgba(${PALETTE.cyanRGB},0.04))`
                          : 'transparent',
                        border: active ? `1px solid rgba(${PALETTE.brassRGB},0.35)` : '1px solid transparent',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                    >
                      <IconPlinth accentRgb={PALETTE.brassRGB} size={28} withBrackets={false}>
                        <OutlineIcon name={PERSONA_ICON[p]} color={`rgb(${PALETTE.brassRGB})`} size={14} />
                      </IconPlinth>
                      <span style={{
                        flex: 1,
                        fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
                        color: active ? 'transparent' : PALETTE.textSub,
                      }}>
                        {active ? <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.cyanRGB}>{PERSONA_LABEL[p]}</Shimmer> : PERSONA_LABEL[p]}
                      </span>
                      {active && (
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: `rgb(${PALETTE.emeraldRGB})`,
                          boxShadow: `0 0 6px rgba(${PALETTE.emeraldRGB},0.7)`,
                        }} />
                      )}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <IconButton title="Notifications" accentRgb={PALETTE.cyanRGB} onClick={() => setBellOpen((o) => !o)}>
            <OutlineIcon name="bell" color={PALETTE.textSub} size={15} />
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 7, height: 7, borderRadius: '50%',
              background: `rgb(${PALETTE.brassRGB})`,
              boxShadow: `0 0 6px rgba(${PALETTE.brassRGB},0.8)`,
            }} />
          </IconButton>
          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onMouseLeave={() => setBellOpen(false)}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 320,
                  background: 'rgba(8,8,16,0.95)',
                  border: `1px solid rgba(${PALETTE.cyanRGB},0.25)`,
                  borderRadius: 14,
                  padding: 12,
                  backdropFilter: 'blur(14px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
                  boxShadow: '0 14px 32px -10px rgba(0,0,0,0.7)',
                  zIndex: 50,
                }}
              >
                <div style={{ padding: '4px 8px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 24, height: 1, background: `rgba(${PALETTE.cyanRGB},0.7)`, boxShadow: `0 0 8px rgba(${PALETTE.cyanRGB},0.5)` }} />
                  <Kicker size={9} color={PALETTE.textSub}>Notifications</Kicker>
                </div>
                {[
                  { title: 'Practice plan posted', sub: 'Marcus Halloway · Tuesday script ready', accent: PALETTE.cyanRGB },
                  { title: 'Injury flagged', sub: 'Quincy Locke moved to OUT for Friday', accent: PALETTE.redRGB },
                  { title: 'Film tagged', sub: 'Devon Pierce added 12 tags to Bayshore cut-ups', accent: PALETTE.brassRGB },
                ].map((n, i) => (
                  <div key={i} style={{
                    padding: '10px 10px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${PALETTE.border}`,
                    marginBottom: 6,
                  }}>
                    <Kicker size={9} color={`rgba(${n.accent},0.95)`}>{n.title}</Kicker>
                    <div style={{ marginTop: 4, fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub }}>{n.sub}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
