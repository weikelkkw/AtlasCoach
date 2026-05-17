'use client'

import { useState } from 'react'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import BarChart from '@/components/ui/BarChart'
import { FONT, PALETTE } from '@/design/constants'
import { roster } from '@/data/roster'
import { plays } from '@/data/plays'
import { schedule } from '@/data/schedule'

const ANALYTICS_ACCENT = PALETTE.emeraldRGB
const ANALYTICS_SECONDARY = PALETTE.brassRGB

const TABS = ['Offense', 'Defense', 'Workload', 'Install'] as const

export default function AnalyticsPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('Offense')
  const todayWeek = 8

  const offenseBars = schedule.filter((g) => g.status === 'played').map((g) => ({
    label: `W${g.week}`,
    value: g.result?.us ?? 0,
    isToday: g.week === todayWeek - 1,
  }))
  const defenseBars = schedule.filter((g) => g.status === 'played').map((g) => ({
    label: `W${g.week}`,
    value: g.result?.them ?? 0,
    isToday: g.week === todayWeek - 1,
    loss: (g.result?.them ?? 0) > (g.result?.us ?? 0),
  }))
  const workloadBars = roster
    .filter((p) => p.snaps > 0)
    .sort((a, b) => b.snaps - a.snaps)
    .slice(0, 10)
    .map((p) => ({ label: `#${p.jersey}`, value: p.snaps, loss: p.snaps > 400 }))
  const installBars = ['Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'].map((w, i) => ({
    label: w,
    value: 32 + i * 8,
    isToday: i === 4,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={ANALYTICS_ACCENT} size={64}>
            <OutlineIcon name="analytics" color={`rgb(${ANALYTICS_ACCENT})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${ANALYTICS_ACCENT},0.85)`}>Cross-cutting · Analytics</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Analytics
            </h1>
            <Kicker color={PALETTE.textMuted}>Season-to-date · Week {todayWeek - 1} of 12</Kicker>
          </div>
        </div>
      </HeroFrame>

      <HeroFrame intensity="sm" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
        <div style={{ padding: '8px 10px', display: 'flex', gap: 6 }}>
          {TABS.map((t) => {
            const active = t === tab
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 12,
                  background: active
                    ? `linear-gradient(145deg, rgba(${ANALYTICS_ACCENT},0.18), rgba(${ANALYTICS_SECONDARY},0.05))`
                    : 'transparent',
                  border: active ? `1px solid rgba(${ANALYTICS_ACCENT},0.40)` : '1px solid transparent',
                  cursor: 'pointer',
                  fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: active ? 'transparent' : PALETTE.textMuted,
                }}
              >
                {active ? <Shimmer accentRgb={ANALYTICS_ACCENT} secondaryRgb={ANALYTICS_SECONDARY}>{t}</Shimmer> : t}
              </button>
            )
          })}
        </div>
      </HeroFrame>

      {tab === 'Offense' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <Kpi label="PPG" value="32.1" accent={ANALYTICS_ACCENT} />
            <Kpi label="Yds/Play" value="6.4" accent={ANALYTICS_ACCENT} />
            <Kpi label="3rd Conv %" value="48" accent={PALETTE.brassRGB} />
            <Kpi label="Red Zone TD %" value="71" accent={PALETTE.brassRGB} />
          </div>
          <SectionHeader accentRgb={ANALYTICS_ACCENT}>Points · By Week</SectionHeader>
          <HeroFrame intensity="md" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
            <div style={{ padding: 24 }}>
              <BarChart bars={offenseBars} accentRgb={ANALYTICS_ACCENT} secondaryRgb={ANALYTICS_SECONDARY} height={220} />
            </div>
          </HeroFrame>
          <SectionHeader accentRgb={ANALYTICS_ACCENT}>Top Concepts · Production</SectionHeader>
          <HeroFrame intensity="md" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plays.filter((p) => p.sport === 'football' || !p.sport).slice(0, 6).map((p, i) => (
                <ConceptRow key={p.id} rank={i + 1} name={p.name} formation={p.formation} runs={p.stats.runs} eff={p.stats.efficiency} />
              ))}
            </div>
          </HeroFrame>
        </>
      )}

      {tab === 'Defense' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <Kpi label="PPG Allowed" value="17.3" accent={ANALYTICS_ACCENT} />
            <Kpi label="Yds/Play Allowed" value="4.8" accent={ANALYTICS_ACCENT} />
            <Kpi label="Sacks · Season" value="22" accent={PALETTE.violetRGB} />
            <Kpi label="Takeaways" value="14" accent={PALETTE.brassRGB} />
          </div>
          <SectionHeader accentRgb={ANALYTICS_ACCENT}>Points Allowed · By Week</SectionHeader>
          <HeroFrame intensity="md" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
            <div style={{ padding: 24 }}>
              <BarChart bars={defenseBars} accentRgb={ANALYTICS_ACCENT} secondaryRgb={ANALYTICS_SECONDARY} height={220} />
            </div>
          </HeroFrame>
        </>
      )}

      {tab === 'Workload' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <Kpi label="Total Snaps · Top 10" value={String(workloadBars.slice(0, 10).reduce((a, b) => a + b.value, 0))} accent={ANALYTICS_ACCENT} />
            <Kpi label="Avg Snap · Starter" value="385" accent={PALETTE.brassRGB} />
            <Kpi label="At Risk (>400)" value={String(workloadBars.filter((b) => b.value > 400).length)} accent={PALETTE.redRGB} />
          </div>
          <SectionHeader accentRgb={ANALYTICS_ACCENT}>Top 10 Snap Counts</SectionHeader>
          <HeroFrame intensity="md" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
            <div style={{ padding: 24 }}>
              <BarChart bars={workloadBars} accentRgb={ANALYTICS_ACCENT} secondaryRgb={ANALYTICS_SECONDARY} height={220} />
              <div style={{ marginTop: 12, fontFamily: FONT.body, fontSize: 12, color: PALETTE.textMuted }}>
                Red bars cross the 400-snap injury-risk threshold. Rotate or rest.
              </div>
            </div>
          </HeroFrame>
        </>
      )}

      {tab === 'Install' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <Kpi label="Plays Installed" value={String(plays.filter((p) => p.installStatus === 'installed').length)} accent={ANALYTICS_ACCENT} />
            <Kpi label="Teaching" value={String(plays.filter((p) => p.installStatus === 'teaching').length)} accent={PALETTE.cyanRGB} />
            <Kpi label="Planned" value={String(plays.filter((p) => p.installStatus === 'planned').length)} accent={PALETTE.violetRGB} />
            <Kpi label="Install Fidelity" value="72%" accent={PALETTE.brassRGB} />
          </div>
          <SectionHeader accentRgb={ANALYTICS_ACCENT}>Install Progress · By Week</SectionHeader>
          <HeroFrame intensity="md" accentRgb={ANALYTICS_ACCENT} accentRgb2={ANALYTICS_SECONDARY}>
            <div style={{ padding: 24 }}>
              <BarChart bars={installBars} accentRgb={ANALYTICS_ACCENT} secondaryRgb={ANALYTICS_SECONDARY} height={220}
                valueFormatter={(v) => `${v}%`} />
            </div>
          </HeroFrame>
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <HeroFrame intensity="sm" accentRgb={accent} accentRgb2={ANALYTICS_SECONDARY}>
      <div style={{ padding: 16 }}>
        <Kicker size={9} color={`rgba(${accent},0.95)`}>{label}</Kicker>
        <div style={{ fontFamily: FONT.body, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>
          <Shimmer accentRgb={accent} secondaryRgb={ANALYTICS_SECONDARY}>{value}</Shimmer>
        </div>
      </div>
    </HeroFrame>
  )
}

function ConceptRow({ rank, name, formation, runs, eff }: { rank: number; name: string; formation: string; runs: number; eff: number }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '36px 1.5fr 1fr 1fr 2fr', gap: 12, alignItems: 'center',
      padding: '10px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
    }}>
      <span style={{ fontFamily: FONT.label, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: `rgba(${ANALYTICS_ACCENT},0.95)` }}>
        {String(rank).padStart(2, '0')}
      </span>
      <div>
        <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text }}>{name}</div>
        <Kicker size={9} color={PALETTE.textMuted}>{formation}</Kicker>
      </div>
      <span style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700 }}>
        <Shimmer accentRgb={ANALYTICS_ACCENT} secondaryRgb={ANALYTICS_SECONDARY}>{String(runs)}</Shimmer>{' '}
        <span style={{ color: PALETTE.textMuted, fontSize: 11, letterSpacing: '0.18em', fontFamily: FONT.label }}>RUNS</span>
      </span>
      <span style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700 }}>
        <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={ANALYTICS_ACCENT}>{`${eff}%`}</Shimmer>{' '}
        <span style={{ color: PALETTE.textMuted, fontSize: 11, letterSpacing: '0.18em', fontFamily: FONT.label }}>EFF</span>
      </span>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${eff}%`,
          background: `linear-gradient(90deg, rgb(${ANALYTICS_ACCENT}), rgb(${PALETTE.brassRGB}))`,
          boxShadow: `0 0 8px rgba(${ANALYTICS_ACCENT},0.5)`,
          borderRadius: 999,
        }} />
      </div>
    </div>
  )
}
