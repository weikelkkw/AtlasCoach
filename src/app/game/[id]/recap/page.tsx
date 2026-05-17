'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import BarChart from '@/components/ui/BarChart'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { schedule } from '@/data/schedule'

export default function RecapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const game = useMemo(() => schedule.find((g) => g.id === id), [id])
  const pillar = PILLARS.game
  if (!game) notFound()
  const won = (game.result?.us ?? 0) > (game.result?.them ?? 0)
  const quarterScores = useMemo(() => {
    const total = game.result?.us ?? 0
    // Deterministic split
    const s = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return [Math.round(total * 0.18 + (s % 3)), Math.round(total * 0.28), Math.round(total * 0.24), Math.round(total * 0.30)]
  }, [id, game.result])
  const theirScores = useMemo(() => {
    const total = game.result?.them ?? 0
    const s = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return [Math.round(total * 0.22 + (s % 2)), Math.round(total * 0.32), Math.round(total * 0.18), Math.round(total * 0.28)]
  }, [id, game.result])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '26px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={84}>
            <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 600, color: `rgba(${pillar.accentRGB},0.95)` }}>W{game.week}</span>
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>
              <Link href="/game/upcoming" style={{ color: 'inherit', textDecoration: 'none' }}>Schedule</Link>
              {'  /  '}Recap
            </Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 38, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0' }}>
              vs {game.opponent}
            </h1>
            <Kicker color={PALETTE.textMuted}>{game.home ? 'HOME' : 'AWAY'} · {new Date(game.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Kicker>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <ScoreBlock label="Coastal Prep" value={String(game.result?.us ?? 0)} accent={pillar.accentRGB} highlight={won} />
            <span style={{ fontFamily: FONT.display, fontSize: 28, color: PALETTE.textFaint }}>—</span>
            <ScoreBlock label={game.opponent.split(' ')[0]} value={String(game.result?.them ?? 0)} accent={PALETTE.violetRGB} highlight={!won} loss={!won} />
          </div>
        </div>
      </HeroFrame>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <Kpi label="Yds/Play" value="6.4" accent={pillar.accentRGB} />
        <Kpi label="3rd Conv" value="6/12" accent={PALETTE.brassRGB} />
        <Kpi label="Red Zone TD" value="3/4" accent={PALETTE.brassRGB} />
        <Kpi label="TOP" value="33:14" accent={PALETTE.cyanRGB} />
        <Kpi label="Turnovers" value="0" accent={won ? PALETTE.emeraldRGB : PALETTE.redRGB} loss={!won} />
      </div>

      {/* Scoring by quarter */}
      <SectionHeader accentRgb={pillar.accentRGB}>Scoring · By Quarter</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
          <div style={{ padding: 18 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.95)`}>Coastal Prep</Kicker>
            <div style={{ marginTop: 14 }}>
              <BarChart bars={quarterScores.map((v, i) => ({ label: `Q${i + 1}`, value: v }))}
                accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} height={160} />
            </div>
          </div>
        </HeroFrame>
        <HeroFrame intensity="md" accentRgb={PALETTE.violetRGB} accentRgb2={pillar.accentRGB}>
          <div style={{ padding: 18 }}>
            <Kicker color={`rgba(${PALETTE.violetRGB},0.95)`}>{game.opponent}</Kicker>
            <div style={{ marginTop: 14 }}>
              <BarChart bars={theirScores.map((v, i) => ({ label: `Q${i + 1}`, value: v, loss: !won }))}
                accentRgb={PALETTE.violetRGB} secondaryRgb={pillar.accentRGB} height={160} />
            </div>
          </div>
        </HeroFrame>
      </div>

      {/* Play-by-play */}
      <SectionHeader accentRgb={pillar.accentRGB}>Drive Summary</SectionHeader>
      <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { drive: 1, start: 'Own 25', result: 'TD',     yards: 75, plays: 11, time: '5:42' },
            { drive: 2, start: 'Own 32', result: 'Punt',   yards: 18, plays: 5,  time: '2:18' },
            { drive: 3, start: 'Own 41', result: 'FG',     yards: 42, plays: 9,  time: '4:55' },
            { drive: 4, start: 'Opp 38', result: 'TD',     yards: 38, plays: 6,  time: '2:42' },
            { drive: 5, start: 'Own 20', result: 'Punt',   yards: 12, plays: 4,  time: '1:48' },
            { drive: 6, start: 'Own 28', result: 'TD',     yards: 72, plays: 10, time: '4:14' },
          ].map((d) => (
            <div key={d.drive} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px 60px 70px', gap: 12, alignItems: 'center',
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${PALETTE.border}`,
            }}>
              <Kicker color={PALETTE.textMuted}>{String(d.drive).padStart(2, '0')}</Kicker>
              <div>
                <Kicker size={9} color={PALETTE.textMuted}>Start</Kicker>
                <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text }}>{d.start}</div>
              </div>
              <ResultPill result={d.result} />
              <MiniStat label="Yds" value={String(d.yards)} accent={pillar.accentRGB} />
              <MiniStat label="Plays" value={String(d.plays)} accent={PALETTE.cyanRGB} />
              <MiniStat label="TOP" value={d.time} accent={PALETTE.brassRGB} />
            </div>
          ))}
        </div>
      </HeroFrame>
    </div>
  )
}

function ScoreBlock({ label, value, accent, highlight, loss }: { label: string; value: string; accent: string; highlight: boolean; loss?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Kicker size={9} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.display, fontSize: 56, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {loss ? (
          <span className="loss-text">{value}</span>
        ) : (
          <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
        )}
      </span>
      {highlight && (
        <Kicker size={9} color={loss ? '#fca5a5' : `rgba(${PALETTE.emeraldRGB},0.95)`}>
          {loss ? 'L' : 'W'}
        </Kicker>
      )}
    </div>
  )
}

function Kpi({ label, value, accent, loss }: { label: string; value: string; accent: string; loss?: boolean }) {
  return (
    <HeroFrame intensity="sm" accentRgb={accent} accentRgb2={PALETTE.brassRGB}>
      <div style={{ padding: 16 }}>
        <Kicker size={9} color={`rgba(${accent},0.95)`}>{label}</Kicker>
        <div style={{ fontFamily: FONT.body, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>
          {loss ? <span className="loss-text">{value}</span> : <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>}
        </div>
      </div>
    </HeroFrame>
  )
}

function ResultPill({ result }: { result: string }) {
  const positive = result === 'TD' || result === 'FG'
  const accent = result === 'TD' ? PALETTE.brassRGB : result === 'FG' ? PALETTE.cyanRGB : PALETTE.amberRGB
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 999,
      background: `rgba(${accent},${positive ? 0.18 : 0.08})`,
      border: `1px solid rgba(${accent},${positive ? 0.45 : 0.25})`,
      fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
      color: 'transparent', textAlign: 'center',
    }}>
      <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{result}</Shimmer>
    </span>
  )
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
