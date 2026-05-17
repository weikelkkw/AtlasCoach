'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Avatar from '@/components/ui/Avatar'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SecondaryButton from '@/components/ui/SecondaryButton'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { roster, POSITION_LABEL, POSITION_SIDE } from '@/data/roster'

const TABS = ['Overview', 'Film', 'Stats', 'Notes', 'Comms', 'Academics'] as const

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const player = useMemo(() => roster.find((p) => p.id === id), [id])
  const [tab, setTab] = useState<typeof TABS[number]>('Overview')
  const pillar = PILLARS.roster

  if (!player) notFound()

  const side = POSITION_SIDE[player.position]
  const sideColor = side === 'offense' ? PALETTE.brassRGB : side === 'defense' ? PALETTE.violetRGB : PALETTE.emeraldRGB

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1400 }}>
      {/* Hero header */}
      <HeroFrame intensity="lg" accentRgb={sideColor} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '26px 28px', display: 'flex', alignItems: 'center', gap: 22 }}>
          <Avatar name={player.name} size={96} accentRgb={sideColor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Kicker color={`rgba(${sideColor},0.85)`}>
              <Link href="/roster/players" style={{ color: 'inherit', textDecoration: 'none' }}>Roster</Link>
              {'  /  '}{POSITION_LABEL[player.position]}
            </Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 40, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0' }}>
              {player.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Kicker color={PALETTE.textSub}>#{player.jersey}</Kicker>
              <span style={{ width: 4, height: 4, borderRadius: 4, background: PALETTE.textFaint }} />
              <Kicker color={PALETTE.textSub}>{player.position} · {player.classYear}</Kicker>
              <span style={{ width: 4, height: 4, borderRadius: 4, background: PALETTE.textFaint }} />
              <Kicker color={player.status === 'injured' ? `rgb(${PALETTE.redRGB})` : `rgba(${PALETTE.emeraldRGB},0.95)`}>
                {player.status}
              </Kicker>
            </div>
          </div>
          <SecondaryButton icon={<OutlineIcon name="chat" color={PALETTE.textSub} size={12} />}>Message</SecondaryButton>
          <SecondaryButton icon={<OutlineIcon name="note" color={PALETTE.textSub} size={12} />}>Add Note</SecondaryButton>
        </div>
      </HeroFrame>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Kpi label="Height" value={player.height} accent={sideColor} secondary={pillar.secondaryRGB} />
        <Kpi label="Weight" value={`${player.weight} lb`} accent={sideColor} secondary={pillar.secondaryRGB} />
        <Kpi label="40-yard" value={player.fortyTime.toFixed(2)} accent={PALETTE.cyanRGB} secondary={sideColor} />
        <Kpi label="Snap Count" value={String(player.snaps)} accent={PALETTE.emeraldRGB} secondary={sideColor} />
      </div>

      {/* Tab strip */}
      <HeroFrame intensity="sm" accentRgb={sideColor} accentRgb2={pillar.secondaryRGB}>
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
                    ? `linear-gradient(145deg, rgba(${sideColor},0.18), rgba(${pillar.secondaryRGB},0.06))`
                    : 'transparent',
                  border: active ? `1px solid rgba(${sideColor},0.4)` : '1px solid transparent',
                  cursor: 'pointer',
                  fontFamily: FONT.label,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: active ? 'transparent' : PALETTE.textMuted,
                }}
              >
                {active ? <Shimmer accentRgb={sideColor} secondaryRgb={pillar.secondaryRGB}>{t}</Shimmer> : t}
              </button>
            )
          })}
        </div>
      </HeroFrame>

      {/* Tab body */}
      {tab === 'Overview' && <OverviewTab player={player} sideColor={sideColor} />}
      {tab === 'Film'     && <PlaceholderTab title="Film" body="Game film clips this player appears in, tagged by play and outcome." icon="film" accent={PALETTE.cyanRGB} />}
      {tab === 'Stats'    && <PlaceholderTab title="Stats" body="Per-game production, charted weekly with shimmer values." icon="analytics" accent={PALETTE.emeraldRGB} />}
      {tab === 'Notes'    && <PlaceholderTab title="Notes" body="Coaching journal — markdown entries tagged by date and coach." icon="note" accent={sideColor} />}
      {tab === 'Comms'    && <PlaceholderTab title="Comms" body="Threaded messages with player + parents." icon="chat" accent={PALETTE.cyanRGB} />}
      {tab === 'Academics'&& <PlaceholderTab title="Academics" body="GPA, eligibility, missing-assignment flags." icon="note" accent={PALETTE.amberRGB} />}
    </div>
  )
}

function Kpi({ label, value, accent, secondary }: { label: string; value: string; accent: string; secondary: string }) {
  return (
    <HeroFrame intensity="sm" accentRgb={accent} accentRgb2={secondary}>
      <div style={{ padding: 16 }}>
        <Kicker size={9} color={`rgba(${accent},0.95)`}>{label}</Kicker>
        <div style={{ fontFamily: FONT.body, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>
          <Shimmer accentRgb={accent} secondaryRgb={secondary}>{value}</Shimmer>
        </div>
      </div>
    </HeroFrame>
  )
}

function OverviewTab({ player, sideColor }: { player: typeof roster[number]; sideColor: string }) {
  const pillar = PILLARS.roster
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
      <HeroFrame intensity="md" accentRgb={sideColor} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 1, background: `rgba(${sideColor},0.7)`, boxShadow: `0 0 8px rgba(${sideColor},0.5)` }} />
            <Kicker color={PALETTE.textSub}>This Week</Kicker>
          </div>
          {[
            { label: 'Practice Reps', value: '42', sub: '+8 vs Tuesday', accent: PALETTE.emeraldRGB },
            { label: 'Weekly Grade', value: String(player.grade), sub: player.grade >= 85 ? 'On pace' : 'Trending down', accent: player.grade >= 85 ? PALETTE.emeraldRGB : PALETTE.amberRGB },
            { label: 'Install Plays', value: '6', sub: 'Y-Cross, Stick, Iso +3', accent: PALETTE.cyanRGB },
            { label: 'Film Assignments', value: '4', sub: '2 outstanding', accent: PALETTE.amberRGB },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${PALETTE.border}`,
              }}
            >
              <IconPlinth accentRgb={r.accent} size={36} withBrackets={false}>
                <span style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: `rgb(${r.accent})` }}>{r.value}</span>
              </IconPlinth>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text }}>{r.label}</div>
                <Kicker size={9} color={PALETTE.textMuted}>{r.sub}</Kicker>
              </div>
              <Shimmer accentRgb={r.accent} secondaryRgb={sideColor}>
                <span style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700 }}>{r.value}</span>
              </Shimmer>
            </div>
          ))}
        </div>
      </HeroFrame>

      <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={sideColor}>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 1, background: `rgba(${pillar.accentRGB},0.7)`, boxShadow: `0 0 8px rgba(${pillar.accentRGB},0.5)` }} />
            <Kicker color={PALETTE.textSub}>Depth Chart</Kicker>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: FONT.display, fontSize: 42, fontWeight: 500, lineHeight: 1, color: PALETTE.text }}>
              <Shimmer accentRgb={pillar.accentRGB} secondaryRgb={sideColor}>{`#${player.depth}`}</Shimmer>
            </span>
            <Kicker color={PALETTE.textMuted}>{POSITION_LABEL[player.position]}</Kicker>
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, lineHeight: 1.55 }}>
            {player.depth === 1
              ? 'Starter. Plays the full game in base sets.'
              : player.depth === 2
                ? 'Primary backup. Sees the field in subpackages.'
                : 'Developmental. Reps in scout and special teams.'}
          </div>
        </div>
      </HeroFrame>
    </div>
  )
}

function PlaceholderTab({ title, body, icon, accent }: { title: string; body: string; icon: string; accent: string }) {
  return (
    <HeroFrame intensity="md" accentRgb={accent} accentRgb2={PALETTE.brassRGB}>
      <div style={{ padding: 36, display: 'flex', alignItems: 'center', gap: 18 }}>
        <IconPlinth accentRgb={accent} size={56}>
          <OutlineIcon name={icon} color={`rgb(${accent})`} size={24} />
        </IconPlinth>
        <div>
          <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 500, color: PALETTE.text }}>{title}</div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, marginTop: 4, maxWidth: 520, lineHeight: 1.55 }}>{body}</div>
        </div>
      </div>
    </HeroFrame>
  )
}
