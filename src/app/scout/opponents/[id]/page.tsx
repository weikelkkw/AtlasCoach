'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import FieldSurface from '@/components/playcanvas/FieldSurface'
import { FONT, PALETTE } from '@/design/constants'
import { getOpponent } from '@/data/opponents'

const SCOUT_ACCENT = PALETTE.amberRGB
const SCOUT_SECONDARY = PALETTE.brassRGB

export default function OpponentDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const o = useMemo(() => getOpponent(id), [id])
  const [mode, setMode] = useState<'run' | 'pass'>('run')
  if (!o) notFound()

  const zones = mode === 'run' ? o.runHotZones : o.passHotZones

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1500 }}>
      {/* Hero */}
      <HeroFrame intensity="lg" accentRgb={SCOUT_ACCENT} accentRgb2={SCOUT_SECONDARY}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 22 }}>
          <IconPlinth accentRgb={SCOUT_ACCENT} size={84}>
            <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 600, color: `rgba(${SCOUT_ACCENT},0.95)` }}>
              {o.short.slice(0, 2).toUpperCase()}
            </span>
          </IconPlinth>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Kicker color={`rgba(${SCOUT_ACCENT},0.85)`}>
              <Link href="/scout/opponents" style={{ color: 'inherit', textDecoration: 'none' }}>Scout</Link>
              {'  /  '}Opponent
            </Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 38, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0' }}>
              {o.name}
            </h1>
            <Kicker color={PALETTE.textMuted}>{o.record.w}–{o.record.l}{o.nextGame ? `  ·  ${o.nextGame}` : ''}</Kicker>
          </div>
        </div>
      </HeroFrame>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Kpi label="Top 1st-10 Concept" value={o.tendencies[0]?.topConcept ?? '—'} accent={SCOUT_ACCENT} secondary={SCOUT_SECONDARY} />
        <Kpi label="Red Zone" value={`${(o.tendencies.find((t) => t.situation === 'Red Zone')?.rate ?? 52)}%`} accent={PALETTE.brassRGB} secondary={SCOUT_ACCENT} />
        <Kpi label="3rd-Long Concept" value={o.tendencies.find((t) => t.situation === '3rd-long')?.topConcept ?? 'Mesh'} accent={PALETTE.cyanRGB} secondary={SCOUT_ACCENT} />
        <Kpi label="Key Player" value={o.keyPlayers[0] ? `#${o.keyPlayers[0].jersey} ${o.keyPlayers[0].name.split(' ').pop()}` : '—'} accent={PALETTE.violetRGB} secondary={SCOUT_ACCENT} />
      </div>

      {/* Heatmap + key players */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <HeroFrame intensity="md" accentRgb={SCOUT_ACCENT} accentRgb2={SCOUT_SECONDARY}>
          <div style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Kicker color={PALETTE.textSub}>Tendency Heatmap</Kicker>
              <span style={{ flex: 1 }} />
              {(['run', 'pass'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: mode === m
                      ? `linear-gradient(145deg, rgba(${SCOUT_ACCENT},0.20), rgba(${SCOUT_SECONDARY},0.04))`
                      : 'rgba(255,255,255,0.03)',
                    border: mode === m ? `1px solid rgba(${SCOUT_ACCENT},0.45)` : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
                    color: mode === m ? 'transparent' : PALETTE.textMuted,
                  }}
                >
                  {mode === m ? <Shimmer accentRgb={SCOUT_ACCENT} secondaryRgb={SCOUT_SECONDARY}>{m}</Shimmer> : m}
                </button>
              ))}
            </div>
            <FieldSurface sport="football" width={520} height={360} accentRgb={SCOUT_ACCENT} secondaryRgb={SCOUT_SECONDARY}>
              <g>
                {zones.map((z, i) => (
                  <g key={i}>
                    <defs>
                      <radialGradient id={`hot-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={`rgba(${SCOUT_ACCENT},${0.45 * z.intensity})`} />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                    <circle cx={z.x * 520} cy={(1 - z.y) * 360} r={50 + 30 * z.intensity} fill={`url(#hot-${i})`} />
                    <circle cx={z.x * 520} cy={(1 - z.y) * 360} r={4} fill={`rgb(${SCOUT_ACCENT})`}
                      style={{ filter: `drop-shadow(0 0 6px rgba(${SCOUT_ACCENT},0.8))` }} />
                    <text x={z.x * 520} y={(1 - z.y) * 360 + 18} textAnchor="middle"
                      fontFamily="var(--font-syncopate), sans-serif" fontSize={9} fontWeight={700} letterSpacing="0.16em"
                      fill={`rgba(${SCOUT_ACCENT},0.9)`}>
                      {Math.round(z.intensity * 100)}%
                    </text>
                  </g>
                ))}
              </g>
            </FieldSurface>
          </div>
        </HeroFrame>

        <HeroFrame intensity="md" accentRgb={PALETTE.violetRGB} accentRgb2={SCOUT_ACCENT}>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Kicker color={PALETTE.textSub}>Key Players</Kicker>
            {o.keyPlayers.map((kp) => (
              <div key={kp.jersey} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${PALETTE.border}`,
              }}>
                <IconPlinth accentRgb={PALETTE.violetRGB} size={36} withBrackets={false}>
                  <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: `rgba(${PALETTE.violetRGB},0.95)` }}>#{kp.jersey}</span>
                </IconPlinth>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text }}>{kp.name}</div>
                  <Kicker size={9} color={PALETTE.textMuted}>{kp.position}</Kicker>
                </div>
              </div>
            ))}
          </div>
        </HeroFrame>
      </div>

      <SectionHeader accentRgb={SCOUT_ACCENT} trailing={<Kicker color={PALETTE.textMuted}>Top {o.topPlays.length}</Kicker>}>
        Top Plays
      </SectionHeader>
      <HeroFrame intensity="md" accentRgb={SCOUT_ACCENT} accentRgb2={SCOUT_SECONDARY}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {o.topPlays.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '36px 1.5fr 1fr 1fr 1fr', gap: 12, alignItems: 'center',
              padding: '10px 14px', borderRadius: 12,
              background: i === 0
                ? `linear-gradient(145deg, rgba(${SCOUT_ACCENT},0.14), rgba(${SCOUT_SECONDARY},0.03))`
                : 'rgba(255,255,255,0.025)',
              border: `1px solid ${PALETTE.border}`,
            }}>
              <span style={{ fontFamily: FONT.label, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: `rgba(${SCOUT_ACCENT},0.95)` }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text }}>{p.name}</div>
                <Kicker size={9} color={PALETTE.textMuted}>{p.formation}</Kicker>
              </div>
              <MiniTile label="Rate" value={`${p.rate}%`} accent={SCOUT_ACCENT} />
              <MiniTile label="Yds/Play" value={p.yardsPerPlay.toFixed(1)} accent={PALETTE.emeraldRGB} />
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${p.rate * 3.5}%`,
                  background: `linear-gradient(90deg, rgb(${SCOUT_ACCENT}), rgb(${SCOUT_SECONDARY}))`,
                  boxShadow: `0 0 8px rgba(${SCOUT_ACCENT},0.5)`,
                  borderRadius: 999,
                }} />
              </div>
            </div>
          ))}
        </div>
      </HeroFrame>
    </div>
  )
}

function Kpi({ label, value, accent, secondary }: { label: string; value: string; accent: string; secondary: string }) {
  return (
    <HeroFrame intensity="sm" accentRgb={accent} accentRgb2={secondary}>
      <div style={{ padding: 16 }}>
        <Kicker size={9} color={`rgba(${accent},0.95)`}>{label}</Kicker>
        <div style={{ fontFamily: FONT.body, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.1, minWidth: 0 }}>
          <Shimmer accentRgb={accent} secondaryRgb={secondary}>{value}</Shimmer>
        </div>
      </div>
    </HeroFrame>
  )
}

function MiniTile({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      padding: '6px 10px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
