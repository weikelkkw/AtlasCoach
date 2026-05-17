'use client'

import { useMemo, useState } from 'react'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { roster } from '@/data/roster'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const WEEKS = ['Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'] as const

// Deterministic mock attendance grid (no randomness on render)
function attendanceFor(week: number, day: number): { present: number; absent: number; total: number } {
  const total = roster.length
  const seed = (week * 7 + day) * 13
  const absent = (seed % 6) + (day === 6 ? 4 : 0)  // Sundays = many absent
  return { present: total - absent, absent, total }
}

export default function AttendancePage() {
  const pillar = PILLARS.roster
  const [weekIdx, setWeekIdx] = useState(WEEKS.length - 1)

  const weekTotals = useMemo(() => {
    let p = 0, a = 0, t = 0
    for (let d = 0; d < 7; d++) {
      const x = attendanceFor(weekIdx, d)
      p += x.present; a += x.absent; t += x.total
    }
    return { p, a, t, rate: Math.round((p / Math.max(t, 1)) * 100) }
  }, [weekIdx])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="calendar" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Roster</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Attendance
            </h1>
            <Kicker color={PALETTE.textMuted}>{WEEKS[weekIdx]} · {weekTotals.rate}% present</Kicker>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {WEEKS.map((w, i) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeekIdx(i)}
                style={{
                  padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                  background: i === weekIdx
                    ? `linear-gradient(145deg, rgba(${pillar.accentRGB},0.20), rgba(${pillar.secondaryRGB},0.05))`
                    : 'rgba(255,255,255,0.03)',
                  border: i === weekIdx ? `1px solid rgba(${pillar.accentRGB},0.45)` : '1px solid rgba(255,255,255,0.08)',
                  fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
                  color: i === weekIdx ? 'transparent' : PALETTE.textMuted,
                }}
              >
                {i === weekIdx ? <Shimmer accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB}>{w}</Shimmer> : w}
              </button>
            ))}
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={pillar.accentRGB} trailing={<Kicker color={PALETTE.textMuted}>{weekTotals.p}/{weekTotals.t} present</Kicker>}>
        Week Grid
      </SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
        {DAYS.map((day, i) => {
          const att = attendanceFor(weekIdx, i)
          const ratio = att.present / att.total
          const isLow = ratio < 0.78
          return (
            <HeroFrame key={day} intensity="sm" accentRgb={isLow ? PALETTE.redRGB : pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 130 }}>
                <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>{day}</Kicker>
                <div style={{ fontFamily: FONT.body, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {isLow ? (
                    <span className="loss-text">{att.present}</span>
                  ) : (
                    <Shimmer accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB}>{String(att.present)}</Shimmer>
                  )}
                </div>
                <Kicker size={9} color={PALETTE.textMuted}>of {att.total}</Kicker>
                <div style={{ position: 'relative', height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', marginTop: 'auto' }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${ratio * 100}%`,
                    background: isLow ? `rgb(${PALETTE.redRGB})` : `linear-gradient(90deg, rgb(${pillar.accentRGB}), rgb(${pillar.secondaryRGB}))`,
                    boxShadow: `0 0 8px rgba(${isLow ? PALETTE.redRGB : pillar.accentRGB},0.55)`,
                    borderRadius: 999,
                  }} />
                </div>
                {att.absent > 0 && (
                  <Kicker size={9} color={isLow ? `rgb(${PALETTE.redRGB})` : PALETTE.amberRGB}>
                    {att.absent} absent
                  </Kicker>
                )}
              </div>
            </HeroFrame>
          )
        })}
      </div>

      <SectionHeader accentRgb={pillar.accentRGB}>Currently Out</SectionHeader>

      <HeroFrame intensity="md" accentRgb={PALETTE.redRGB} accentRgb2={pillar.accentRGB}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roster.filter((p) => p.status === 'injured' || p.status === 'limited' || p.status === 'academic').map((p) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10,
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${PALETTE.border}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%',
                background: p.status === 'injured' ? `rgb(${PALETTE.redRGB})` : p.status === 'limited' ? `rgb(${PALETTE.amberRGB})` : `rgb(${PALETTE.cyanRGB})`,
                boxShadow: `0 0 6px ${p.status === 'injured' ? `rgba(${PALETTE.redRGB},0.7)` : 'rgba(255,255,255,0.3)'}` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text }}>{p.name}</div>
                <Kicker size={9} color={PALETTE.textMuted}>#{p.jersey} · {p.position}</Kicker>
              </div>
              <span className={p.status === 'injured' ? 'loss-text' : ''} style={{
                padding: '3px 8px', borderRadius: 999,
                fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: p.status === 'injured' ? undefined : PALETTE.textMuted,
              }}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </HeroFrame>
    </div>
  )
}
