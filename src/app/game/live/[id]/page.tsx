'use client'

import { use, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { wristbandPlays, type WristbandTile } from '@/data/wristband'
import { team } from '@/data/team'
import { schedule } from '@/data/schedule'

interface CallLog {
  id: number
  tile: WristbandTile
  down: number
  distance: number
  ballOn: number
  quarter: number
  result?: 'gain' | 'loss' | 'td' | 'turnover' | 'penalty'
  yards?: number
}

const RESULTS: { value: CallLog['result']; label: string; accent: string }[] = [
  { value: 'gain',     label: 'Gain',     accent: PALETTE.emeraldRGB },
  { value: 'loss',     label: 'Loss',     accent: PALETTE.redRGB },
  { value: 'td',       label: 'TD',       accent: PALETTE.brassRGB },
  { value: 'turnover', label: 'Turnover', accent: PALETTE.redRGB },
  { value: 'penalty',  label: 'Penalty',  accent: PALETTE.amberRGB },
]

export default function WristbandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const game = useMemo(() => schedule.find((g) => g.id === id) ?? schedule.find((g) => g.status === 'upcoming') ?? schedule[0], [id])
  const pillar = PILLARS.game
  const [calls, setCalls] = useState<CallLog[]>([])
  const [pendingCall, setPendingCall] = useState<CallLog | null>(null)
  const [down, setDown] = useState(1)
  const [distance, setDistance] = useState(10)
  const [ballOn, setBallOn] = useState(25)
  const [quarter] = useState(1)
  const [score] = useState({ us: 0, them: 0 })

  const callTile = (tile: WristbandTile) => {
    const next: CallLog = {
      id: Date.now(),
      tile,
      down,
      distance,
      ballOn,
      quarter,
    }
    setPendingCall(next)
  }

  const logResult = (result: NonNullable<CallLog['result']>, yards: number) => {
    if (!pendingCall) return
    const completed = { ...pendingCall, result, yards }
    setCalls((prev) => [completed, ...prev])
    // Roll situation forward simply
    if (result === 'td' || result === 'turnover') {
      setDown(1); setDistance(10); setBallOn(25)
    } else if (result === 'penalty') {
      setDistance(Math.max(1, distance + 5))
    } else if (result === 'gain') {
      const newBall = Math.min(99, ballOn + yards)
      if (yards >= distance) { setDown(1); setDistance(10) } else { setDown(Math.min(4, down + 1)); setDistance(distance - yards) }
      setBallOn(newBall)
    } else if (result === 'loss') {
      setDown(Math.min(4, down + 1))
      setDistance(distance + yards)
      setBallOn(Math.max(1, ballOn - yards))
    }
    setPendingCall(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1500 }}>
      {/* Situation strip */}
      <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '14px 22px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18, alignItems: 'center' }}>
          <SituationBlock label="Quarter" value={`Q${quarter}`} accent={pillar.accentRGB} secondary={pillar.secondaryRGB} />
          <SituationBlock label="Down" value={`${down}${ordinal(down)}`} accent={pillar.accentRGB} secondary={pillar.secondaryRGB} />
          <SituationBlock label="Distance" value={String(distance)} accent={pillar.accentRGB} secondary={PALETTE.brassRGB} />
          <SituationBlock label="Ball On" value={String(ballOn)} accent={PALETTE.cyanRGB} secondary={pillar.accentRGB} />
          <SituationBlock label={`${team.short}`} value={String(score.us)} accent={pillar.accentRGB} secondary={pillar.secondaryRGB} big />
          <SituationBlock label={game.opponent.split(' ')[0]} value={String(score.them)} accent={PALETTE.violetRGB} secondary={pillar.accentRGB} big />
        </div>
      </HeroFrame>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        {/* Wristband 4×6 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Kicker color={PALETTE.textSub}>Wristband · {game.opponent}</Kicker>
            <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }} />
            <Kicker color={PALETTE.textMuted}>{wristbandPlays.length} calls</Kicker>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {wristbandPlays.map((tile) => <WristbandCard key={tile.code} tile={tile} onCall={() => callTile(tile)} />)}
          </div>
        </div>

        {/* Right rail: pending call + recent log */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 14, alignSelf: 'flex-start' }}>
          <AnimatePresence mode="wait">
            {pendingCall ? (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              >
                <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
                  <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Kicker color={PALETTE.textMuted}>Pending Call</Kicker>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <IconPlinth accentRgb={pillar.accentRGB} size={56}>
                        <span style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 600, color: `rgba(${pillar.accentRGB},0.98)` }}>
                          {pendingCall.tile.code}
                        </span>
                      </IconPlinth>
                      <div>
                        <div style={{ fontFamily: FONT.body, fontSize: 18, fontWeight: 700, color: PALETTE.text }}>
                          {pendingCall.tile.playName}
                        </div>
                        <Kicker size={9} color={PALETTE.textMuted}>{pendingCall.tile.formation}</Kicker>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                      {RESULTS.map((r) => (
                        <motion.button
                          key={r.label}
                          type="button"
                          onClick={() => logResult(r.value as NonNullable<CallLog['result']>, 6)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            padding: '8px 6px',
                            borderRadius: 12,
                            background: `linear-gradient(145deg, rgba(${r.accent},0.18), rgba(${r.accent},0.04))`,
                            border: `1px solid rgba(${r.accent},0.45)`,
                            cursor: 'pointer',
                            fontFamily: FONT.label,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            color: r.value === 'loss' || r.value === 'turnover' ? '#fca5a5' : 'transparent',
                          }}
                        >
                          {r.value === 'loss' || r.value === 'turnover'
                            ? r.label
                            : <Shimmer accentRgb={r.accent} secondaryRgb={pillar.accentRGB}>{r.label}</Shimmer>}
                        </motion.button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingCall(null)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        cursor: 'pointer',
                        fontFamily: FONT.label,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.20em',
                        textTransform: 'uppercase',
                        color: PALETTE.textMuted,
                      }}
                    >
                      Cancel call
                    </button>
                  </div>
                </HeroFrame>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
                  <div style={{ padding: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                    <IconPlinth accentRgb={pillar.accentRGB} size={56}>
                      <OutlineIcon name="whistle" color={`rgb(${pillar.accentRGB})`} size={24} />
                    </IconPlinth>
                    <Kicker color={PALETTE.textMuted}>Tap a tile to call</Kicker>
                    <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, maxWidth: 230 }}>
                      Each tap logs the call with down, distance, and result for live charting.
                    </div>
                  </div>
                </HeroFrame>
              </motion.div>
            )}
          </AnimatePresence>

          <HeroFrame intensity="md" accentRgb={PALETTE.cyanRGB} accentRgb2={pillar.accentRGB}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 1, background: `rgba(${PALETTE.cyanRGB},0.7)`, boxShadow: `0 0 8px rgba(${PALETTE.cyanRGB},0.5)` }} />
                <Kicker color={PALETTE.textSub}>Recent Calls</Kicker>
                <span style={{ flex: 1 }} />
                <Kicker color={PALETTE.textMuted}>{calls.length}</Kicker>
              </div>
              {calls.length === 0 ? (
                <div style={{ padding: 14, textAlign: 'center', color: PALETTE.textMuted, fontFamily: FONT.body, fontSize: 12 }}>
                  No calls logged yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 420, overflowY: 'auto' }}>
                  {calls.map((c) => <CallRow key={c.id} call={c} />)}
                </div>
              )}
            </div>
          </HeroFrame>
        </aside>
      </div>
    </div>
  )
}

function SituationBlock({
  label, value, accent, secondary, big,
}: { label: string; value: string; accent: string; secondary: string; big?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <Kicker size={9} color={`rgba(${accent},0.95)`}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: big ? 40 : 28, fontWeight: 700, letterSpacing: '-0.02em', minWidth: 0 }}>
        <Shimmer accentRgb={accent} secondaryRgb={secondary}>{value}</Shimmer>
      </span>
    </div>
  )
}

function WristbandCard({ tile, onCall }: { tile: WristbandTile; onCall: () => void }) {
  const pillar = PILLARS.game
  return (
    <motion.button
      type="button"
      onClick={onCall}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      style={{
        border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left', minWidth: 0,
      }}
    >
      <HeroFrame intensity="sm" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 132 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Kicker size={9} color={PALETTE.textMuted}>{tile.formation}</Kicker>
            <Kicker size={9} color={`rgba(${pillar.accentRGB},0.95)`}>{tile.code}</Kicker>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                fontFamily: FONT.display,
                fontSize: 48,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: 'transparent',
              }}
            >
              <Shimmer accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB}>
                {tile.code[0]}
              </Shimmer>
            </span>
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tile.playName}
          </div>
        </div>
      </HeroFrame>
    </motion.button>
  )
}

function CallRow({ call }: { call: CallLog }) {
  const r = RESULTS.find((x) => x.value === call.result)
  const loss = call.result === 'loss' || call.result === 'turnover'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
    }}>
      <span style={{
        width: 28, textAlign: 'center', fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
        color: `rgba(${PILLARS.game.accentRGB},0.95)`,
      }}>{call.tile.code}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: FONT.body, fontSize: 12, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {call.tile.playName}
      </span>
      <span style={{ fontFamily: FONT.label, fontSize: 9, color: PALETTE.textMuted, letterSpacing: '0.18em' }}>
        {call.down}{ordinal(call.down)} &amp; {call.distance}
      </span>
      <span
        className={loss ? 'loss-text' : ''}
        style={{
          padding: '3px 8px', borderRadius: 999,
          background: r ? `linear-gradient(145deg, rgba(${r.accent},0.18), rgba(${r.accent},0.04))` : 'rgba(255,255,255,0.03)',
          border: r ? `1px solid rgba(${r.accent},0.45)` : '1px solid rgba(255,255,255,0.08)',
          fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
          color: loss ? undefined : 'transparent',
        }}
      >
        {loss ? r?.label : <Shimmer accentRgb={r?.accent ?? PALETTE.brassRGB} secondaryRgb={PILLARS.game.accentRGB}>{r?.label ?? '—'}</Shimmer>}
      </span>
    </div>
  )
}

function ordinal(n: number): string {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}
