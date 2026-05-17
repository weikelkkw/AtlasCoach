'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Avatar from '@/components/ui/Avatar'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import FilterPills from '@/components/ui/FilterPills'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { roster, POSITION_LABEL, POSITION_SIDE, type Player, type Position } from '@/data/roster'

const POSITIONS: (Position | 'all')[] = ['all', 'QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P']
const STATUSES = ['all', 'active', 'injured', 'limited', 'academic']
const CLASSES = ['all', 'Sr', 'Jr', 'So', 'Fr']

export default function RosterPlayersPage() {
  const pillar = PILLARS.roster
  const [position, setPosition] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [classYear, setClassYear] = useState<string>('all')

  const filtered = useMemo(() => {
    return roster
      .filter((p) => (position === 'all' || p.position === position))
      .filter((p) => (status === 'all' || p.status === status))
      .filter((p) => (classYear === 'all' || p.classYear === classYear))
      .sort((a, b) => a.depth - b.depth || a.jersey - b.jersey)
  }, [position, status, classYear])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      {/* Header */}
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="roster" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Roster</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Players <span style={{ color: PALETTE.textMuted, fontStyle: 'italic' }}>{`/ ${roster.length}`}</span>
            </h1>
            <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub }}>
              Active roster · Coastal Prep Mariners · 2026 season
            </div>
          </div>
          <Link href="/roster/depth-chart" style={{ textDecoration: 'none' }}>
            <PrimaryButton
              accentRgb={pillar.accentRGB}
              secondaryRgb={pillar.secondaryRGB}
              icon={<OutlineIcon name="depth" color={`rgba(${pillar.accentRGB},0.95)`} size={13} />}
            >
              Depth Chart
            </PrimaryButton>
          </Link>
        </div>
      </HeroFrame>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FilterPills
          accentRgb={pillar.accentRGB}
          secondaryRgb={pillar.secondaryRGB}
          value={position}
          onChange={setPosition}
          options={POSITIONS.map((p) => ({ value: p, label: p === 'all' ? 'All Positions' : p }))}
        />
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <FilterPills
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
            value={status}
            onChange={setStatus}
            options={STATUSES.map((s) => ({ value: s, label: s === 'all' ? 'All Status' : s }))}
          />
          <FilterPills
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
            value={classYear}
            onChange={setClassYear}
            options={CLASSES.map((c) => ({ value: c, label: c === 'all' ? 'All Class' : c }))}
          />
        </div>
      </div>

      <SectionHeader accentRgb={pillar.accentRGB} trailing={<Kicker color={PALETTE.textMuted}>{filtered.length} shown</Kicker>}>
        Active Roster
      </SectionHeader>

      <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((p) => <PlayerRow key={p.id} player={p} />)}
          {filtered.length === 0 && (
            <div style={{ padding: 28, textAlign: 'center', color: PALETTE.textMuted, fontFamily: FONT.body, fontSize: 13 }}>
              No players match these filters.
            </div>
          )}
        </div>
      </HeroFrame>
    </div>
  )
}

function PlayerRow({ player }: { player: Player }) {
  const pillar = PILLARS.roster
  const side = POSITION_SIDE[player.position]
  const sideColor =
    side === 'offense' ? PALETTE.brassRGB :
    side === 'defense' ? PALETTE.violetRGB :
    PALETTE.emeraldRGB
  const injured = player.status === 'injured'

  return (
    <Link href={`/roster/players/${player.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr repeat(4, 110px) 32px',
          alignItems: 'center',
          gap: 14,
          padding: '10px 14px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.025)',
          border: `1px solid ${PALETTE.border}`,
          cursor: 'pointer',
          transition: 'background 200ms ease, border-color 200ms ease',
        }}
      >
        <Avatar name={player.name} size={48} accentRgb={sideColor} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {player.name}
          </div>
          <Kicker size={9} color={PALETTE.textMuted}>
            #{player.jersey} · {POSITION_LABEL[player.position]} · {player.classYear}
          </Kicker>
        </div>
        <Tile label="Position" value={player.position} accent={sideColor} />
        <Tile label="Grade" value={String(player.grade)} accent={player.grade >= 85 ? PALETTE.emeraldRGB : PALETTE.amberRGB} loss={player.grade < 75} />
        <Tile label="Snaps" value={String(player.snaps)} accent={pillar.accentRGB} />
        <Tile label="Status" value={player.status} accent={injured ? PALETTE.redRGB : PALETTE.emeraldRGB} loss={injured} />
        <OutlineIcon name="next" color={PALETTE.textFaint} size={14} />
      </div>
    </Link>
  )
}

function Tile({ label, value, accent, loss }: { label: string; value: string; accent: string; loss?: boolean }) {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
      display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0,
    }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span
        className={loss ? 'loss-text' : ''}
        style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}
      >
        {loss ? value : <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>}
      </span>
    </div>
  )
}
