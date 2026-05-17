'use client'

import { useEffect, useRef, useState, useMemo, type PointerEvent as RPointerEvent } from 'react'
import { motion } from 'framer-motion'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import PlayCanvas from './PlayCanvas'
import ResponsiveStage from './ResponsiveStage'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { defenses, getDefense, type Play, type DefensiveAlignment } from '@/data/plays'
import { useCustomDefenses } from '@/lib/defenseStore'
import { simulateAsPlay } from '@/lib/playSimulation'

interface Props {
  play: Play
  initialDefenseId?: string
  onPrimaryChange?: (id: string | undefined) => void
}

const SPEEDS = [0.25, 0.5, 1, 2] as const
const DURATION_AT_1X_MS = 6200

export default function PlayAnimator({
  play,
  initialDefenseId,
  onPrimaryChange,
}: Props) {
  const pillar = PILLARS.playbook
  const { custom: customDefenses } = useCustomDefenses()
  const [defenseId, setDefenseId] = useState(initialDefenseId ?? play.defaultDefenseId)
  const playSport = play.sport ?? 'football'
  const allDefenses = useMemo<DefensiveAlignment[]>(() => {
    const seen = new Set<string>()
    const out: DefensiveAlignment[] = []
    for (const d of [...customDefenses, ...defenses]) {
      if (seen.has(d.id)) continue
      if ((d.sport ?? 'football') !== playSport) continue
      seen.add(d.id)
      out.push(d)
    }
    return out
  }, [customDefenses, playSport])
  const rawDefense = useMemo(
    () => allDefenses.find((d) => d.id === defenseId) ?? getDefense(defenseId) ?? allDefenses[0] ?? defenses[0],
    [allDefenses, defenseId],
  )
  // Run the simulation engine — every player gets reactive movement.
  const { play: simPlay, defense } = useMemo(() => simulateAsPlay(play, rawDefense), [play, rawDefense])
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<typeof SPEEDS[number]>(1)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const tRef = useRef(0)

  useEffect(() => { tRef.current = t }, [t])

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
      return
    }
    const tick = (now: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = now
      const dt = now - lastTimeRef.current
      lastTimeRef.current = now
      const delta = (dt * speed) / DURATION_AT_1X_MS
      let next = tRef.current + delta
      if (next >= 1) {
        next = 1
        setPlaying(false)
      }
      tRef.current = next
      setT(next)
      if (next < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, speed])

  const togglePlay = () => {
    if (t >= 1) {
      setT(0)
      tRef.current = 0
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }
  const skipStart = () => { setT(0); tRef.current = 0; setPlaying(false) }
  const skipEnd = () => { setT(1); tRef.current = 1; setPlaying(false) }
  const restart = () => { setT(0); tRef.current = 0; setPlaying(true) }

  const decisionT = play.decision?.atT
  const pastDecision = decisionT != null && t >= decisionT
  const accentRgb = pillar.accentRGB
  const secondaryRgb = pillar.secondaryRGB

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Cinematic canvas frame ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 26 }}
        style={{ position: 'relative' }}
      >
        <HeroFrame intensity="lg" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
          <div style={{ padding: 18 }}>
            <ResponsiveStage aspectRatio={16 / 9} minHeight={320} maxHeight={680}>
              {(w, h) => (
                <PlayCanvas
                  play={simPlay}
                  defense={defense}
                  t={t}
                  width={w}
                  height={h}
                  accentRgb={accentRgb}
                  secondaryRgb={secondaryRgb}
                />
              )}
            </ResponsiveStage>
          </div>
        </HeroFrame>

        {/* Floating status badge — top left */}
        <div
          style={{
            position: 'absolute', top: 32, left: 32,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(5,5,12,0.65)',
            border: `1px solid rgba(${accentRgb},0.40)`,
            backdropFilter: 'blur(12px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
            display: 'flex', alignItems: 'center', gap: 8,
            zIndex: 6,
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: playing ? `rgb(${PALETTE.emeraldRGB})` : `rgb(${accentRgb})`,
            boxShadow: playing
              ? `0 0 8px rgba(${PALETTE.emeraldRGB},0.8), 0 0 16px rgba(${PALETTE.emeraldRGB},0.4)`
              : `0 0 6px rgba(${accentRgb},0.6)`,
            animation: playing ? 'headPulse 1.4s ease-in-out infinite' : undefined,
          }} />
          <Kicker size={9} color={`rgba(${accentRgb},0.95)`}>
            {playing ? 'LIVE' : t >= 1 ? 'END' : t === 0 ? 'PRE-SNAP' : 'PAUSED'}
          </Kicker>
        </div>

        {/* Floating defense badge — top right */}
        <div
          style={{
            position: 'absolute', top: 32, right: 32,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(5,5,12,0.65)',
            border: `1px solid rgba(${PALETTE.violetRGB},0.40)`,
            backdropFilter: 'blur(12px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
            display: 'flex', alignItems: 'center', gap: 8,
            zIndex: 6,
          }}
        >
          <Kicker size={9} color={PALETTE.textMuted}>vs</Kicker>
          <Kicker size={9} color={`rgba(${PALETTE.violetRGB},0.95)`}>{defense.shortName}</Kicker>
        </div>
      </motion.div>

      {/* ── Premium scrubber strip ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 180, damping: 26 }}
      >
        <HeroFrame intensity="md" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Top row: transport + scrubber + speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TransportButton onClick={skipStart} aria="Skip to start">
                  <OutlineIcon name="back" color={`rgba(${accentRgb},0.95)`} size={14} />
                </TransportButton>
                <TransportButton onClick={togglePlay} primary accent={accentRgb} secondary={secondaryRgb} aria={playing ? 'Pause' : 'Play'}>
                  <OutlineIcon name={playing ? 'pause' : 'play'} color={`rgba(${accentRgb},0.98)`} size={17} />
                </TransportButton>
                <TransportButton onClick={skipEnd} aria="Skip to end">
                  <OutlineIcon name="forward" color={`rgba(${accentRgb},0.95)`} size={14} />
                </TransportButton>
                <TransportButton onClick={restart} aria="Restart">
                  <OutlineIcon name="sparkle" color={`rgba(${accentRgb},0.95)`} size={14} />
                </TransportButton>
              </div>

              <ScrubberBar
                value={t}
                onChange={(v) => { setT(v); tRef.current = v }}
                onScrubStart={() => setPlaying(false)}
                accentRgb={accentRgb}
                secondaryRgb={secondaryRgb}
                decisionT={decisionT}
              />

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {SPEEDS.map((s) => {
                  const active = s === speed
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      style={{
                        padding: '6px 11px',
                        borderRadius: 999,
                        border: active ? `1px solid rgba(${accentRgb},0.55)` : '1px solid rgba(255,255,255,0.08)',
                        background: active
                          ? `linear-gradient(145deg, rgba(${accentRgb},0.22), rgba(${secondaryRgb},0.06))`
                          : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        fontFamily: FONT.label,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        color: active ? 'transparent' : PALETTE.textMuted,
                      }}
                    >
                      {active ? <Shimmer accentRgb={accentRgb} secondaryRgb={secondaryRgb}>{`${s}×`}</Shimmer> : `${s}×`}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Primary read selector — route highlight cycler */}
            {onPrimaryChange && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Kicker color={PALETTE.textMuted}>Primary Read</Kicker>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <PrimaryPill
                    active={!play.primaryRouteId}
                    onClick={() => onPrimaryChange(undefined)}
                    label="None"
                  />
                  {play.offense
                    .filter((p) => p.side === 'offense' && p.action !== 'block' && p.position !== 'OL' && p.position !== 'QB')
                    .map((p) => (
                      <PrimaryPill
                        key={p.id}
                        active={play.primaryRouteId === p.id}
                        onClick={() => onPrimaryChange(p.id)}
                        label={`${p.label} · ${p.position}`}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Bottom row: defense selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Kicker color={PALETTE.textMuted}>vs Defense</Kicker>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {allDefenses.map((d) => {
                  const active = d.id === defenseId
                  return (
                    <motion.button
                      key={d.id}
                      type="button"
                      onClick={() => setDefenseId(d.id)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      title={d.label}
                      style={{
                        padding: '6px 11px',
                        borderRadius: 999,
                        border: active
                          ? `1px solid rgba(${PALETTE.violetRGB},0.60)`
                          : `1px solid rgba(${d.custom ? PALETTE.emeraldRGB : '255,255,255'},${d.custom ? 0.30 : 0.08})`,
                        background: active
                          ? `linear-gradient(145deg, rgba(${PALETTE.violetRGB},0.20), rgba(${PALETTE.violetRGB},0.04))`
                          : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        fontFamily: FONT.label,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        color: active ? 'transparent' : PALETTE.textMuted,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      {d.custom && (
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: `rgb(${PALETTE.emeraldRGB})`,
                          boxShadow: `0 0 4px rgba(${PALETTE.emeraldRGB},0.7)`,
                        }} />
                      )}
                      {active
                        ? <Shimmer accentRgb={PALETTE.violetRGB} secondaryRgb={accentRgb}>{d.shortName}</Shimmer>
                        : d.shortName}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </HeroFrame>
      </motion.div>

      {/* Decision panel */}
      {play.decision && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, type: 'spring', stiffness: 180, damping: 26 }}
        >
          <HeroFrame intensity="md" accentRgb={pastDecision ? PALETTE.violetRGB : accentRgb} accentRgb2={secondaryRgb}>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Kicker color={PALETTE.textMuted}>Decision · @ {Math.round(play.decision.atT * 100)}%</Kicker>
                <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }} />
                <Kicker color={pastDecision ? `rgba(${PALETTE.violetRGB},0.95)` : PALETTE.textFaint}>
                  {pastDecision ? 'Triggered' : 'Pending'}
                </Kicker>
              </div>
              <div style={{
                fontFamily: FONT.display, fontSize: 26, fontWeight: 500,
                color: PALETTE.text, marginBottom: 16, letterSpacing: '-0.01em',
              }}>
                {play.decision.prompt}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {play.decision.branches.map((b) => (
                  <div
                    key={b.label}
                    style={{
                      padding: 16, borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 999,
                        background: `linear-gradient(145deg, rgba(${accentRgb},0.20), rgba(${secondaryRgb},0.06))`,
                        border: `1px solid rgba(${accentRgb},0.40)`,
                        fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em',
                        color: 'transparent',
                      }}>
                        <Shimmer accentRgb={accentRgb} secondaryRgb={secondaryRgb}>{b.label}</Shimmer>
                      </span>
                    </div>
                    <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, lineHeight: 1.6 }}>
                      {b.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </HeroFrame>
        </motion.div>
      )}
    </div>
  )
}

function TransportButton({
  children, onClick, primary, accent = '232,195,118', secondary = '34,211,238', aria,
}: {
  children: React.ReactNode; onClick: () => void; primary?: boolean; accent?: string; secondary?: string; aria?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={aria}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      style={{
        width: primary ? 44 : 36,
        height: primary ? 44 : 36,
        borderRadius: 999,
        cursor: 'pointer',
        background: primary
          ? `linear-gradient(145deg, rgba(${accent},0.28), rgba(${secondary},0.10))`
          : 'rgba(255,255,255,0.04)',
        border: primary ? `1px solid rgba(${accent},0.65)` : '1px solid rgba(255,255,255,0.10)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: primary
          ? `0 12px 24px -12px rgba(${accent},0.65), 0 0 24px rgba(${accent},0.20)`
          : 'none',
      }}
    >
      {children}
    </motion.button>
  )
}

// ── Premium draggable scrubber ─────────────────────────────────────────

function ScrubberBar({
  value, onChange, onScrubStart, accentRgb, secondaryRgb, decisionT,
}: {
  value: number
  onChange: (v: number) => void
  onScrubStart?: () => void
  accentRgb: string
  secondaryRgb: string
  decisionT?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hoverX, setHoverX] = useState<number | null>(null)

  const setFromClientX = (clientX: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    onChange(pct)
  }

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    onScrubStart?.()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setDragging(true)
    setFromClientX(e.clientX)
  }
  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (dragging) setFromClientX(e.clientX)
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHoverX(e.clientX - rect.left)
    }
  }
  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    if (dragging) setDragging(false)
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }
  const onPointerLeave = () => {
    if (!dragging) setHoverX(null)
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      style={{
        flex: 1,
        height: 44,
        position: 'relative',
        cursor: dragging ? 'grabbing' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Track aura */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        height: 12, borderRadius: 999,
        background: `linear-gradient(90deg, rgba(${accentRgb},0.04), rgba(${accentRgb},0.10), rgba(${accentRgb},0.04))`,
        filter: 'blur(2px)',
      }} />
      {/* Track */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        height: 6, borderRadius: 999,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.55)',
      }} />
      {/* Fill aura */}
      <div style={{
        position: 'absolute', left: 0,
        width: `${value * 100}%`,
        height: 14, borderRadius: 999,
        background: `linear-gradient(90deg, rgba(${accentRgb},0.30), rgba(${secondaryRgb},0.40))`,
        filter: 'blur(8px)',
        opacity: 0.85,
      }} />
      {/* Fill */}
      <div style={{
        position: 'absolute', left: 0,
        width: `${value * 100}%`,
        height: 6, borderRadius: 999,
        background: `linear-gradient(90deg, rgb(${accentRgb}), rgb(${secondaryRgb}))`,
        boxShadow: `0 0 12px rgba(${accentRgb},0.55)`,
      }} />

      {/* Keyframe dots */}
      {[0, 0.5, 1, ...(decisionT != null ? [decisionT] : [])].map((kt, i) => {
        const isDecision = kt === decisionT
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `calc(${kt * 100}% - 4px)`,
              width: 8, height: 8, borderRadius: '50%',
              background: isDecision
                ? `rgba(${PALETTE.violetRGB},0.95)`
                : `rgba(${accentRgb},0.85)`,
              boxShadow: isDecision
                ? `0 0 10px rgba(${PALETTE.violetRGB},0.7), 0 0 24px rgba(${PALETTE.violetRGB},0.35)`
                : `0 0 8px rgba(${accentRgb},0.5)`,
              border: '1.5px solid rgba(5,5,12,0.85)',
              pointerEvents: 'none',
              animation: isDecision ? 'headPulse 2s ease-in-out infinite' : undefined,
            }}
          />
        )
      })}

      {/* Hover preview line */}
      {hoverX != null && !dragging && (
        <span
          style={{
            position: 'absolute',
            left: hoverX - 0.5,
            top: 6, bottom: 6,
            width: 1,
            background: `rgba(${secondaryRgb},0.40)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Head-dot */}
      <span
        style={{
          position: 'absolute',
          left: `calc(${value * 100}% - 11px)`,
          width: 22, height: 22, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgb(${secondaryRgb}) 60%)`,
          boxShadow: `
            0 0 0 1.5px rgba(5,5,12,0.85),
            0 0 0 3px rgba(${secondaryRgb},0.30),
            0 0 14px rgba(${secondaryRgb},0.75),
            0 0 28px rgba(${secondaryRgb},0.45)
          `,
          color: `rgb(${secondaryRgb})`,
          pointerEvents: 'none',
          transition: dragging ? 'none' : 'left 60ms linear',
        }}
        className={dragging ? '' : 'head-pulse'}
      />

      {/* Floating tooltip while dragging */}
      {dragging && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${value * 100}% - 28px)`,
            top: -34,
            padding: '4px 10px',
            borderRadius: 8,
            background: 'rgba(5,5,12,0.85)',
            border: `1px solid rgba(${secondaryRgb},0.45)`,
            boxShadow: `0 8px 22px -10px rgba(${secondaryRgb},0.5)`,
            backdropFilter: 'blur(12px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
            fontFamily: FONT.label,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.20em',
            color: `rgba(${secondaryRgb},0.95)`,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(value * 100)}%
          {decisionT != null && Math.abs(value - decisionT) < 0.03 && (
            <span style={{ marginLeft: 6, color: `rgba(${PALETTE.violetRGB},0.95)` }}>· DECISION</span>
          )}
        </div>
      )}
    </div>
  )
}

function PrimaryPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: '6px 11px',
        borderRadius: 999,
        border: active
          ? `1px solid rgba(${PALETTE.cyanRGB},0.65)`
          : '1px solid rgba(255,255,255,0.08)',
        background: active
          ? `linear-gradient(145deg, rgba(${PALETTE.cyanRGB},0.22), rgba(${PALETTE.brassRGB},0.06))`
          : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        fontFamily: FONT.label,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: active ? 'transparent' : PALETTE.textMuted,
        boxShadow: active ? `0 0 14px rgba(${PALETTE.cyanRGB},0.30)` : 'none',
      }}
    >
      {active ? <Shimmer accentRgb={PALETTE.cyanRGB} secondaryRgb={PALETTE.brassRGB}>{label}</Shimmer> : label}
    </motion.button>
  )
}
