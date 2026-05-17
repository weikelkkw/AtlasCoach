'use client'

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Avatar from '@/components/ui/Avatar'
import SectionHeader from '@/components/ui/SectionHeader'
import Shimmer from '@/components/ui/Shimmer'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { roster, POSITION_LABEL, POSITION_SIDE, type Player, type Position } from '@/data/roster'

const OFFENSE_GROUPS: Position[] = ['QB', 'RB', 'WR', 'TE', 'OL']
const DEFENSE_GROUPS: Position[] = ['DL', 'LB', 'CB', 'S']

export default function DepthChartPage() {
  const pillar = PILLARS.roster

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1500 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="depth" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Roster</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Depth Chart
            </h1>
            <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub }}>
              Drag any player to reorder. Sticks instantly across every install plan, wristband, and roster view.
            </div>
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={PALETTE.brassRGB}>Offense</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {OFFENSE_GROUPS.map((pos) => <PositionColumn key={pos} position={pos} />)}
      </div>

      <SectionHeader accentRgb={PALETTE.violetRGB}>Defense</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {DEFENSE_GROUPS.map((pos) => <PositionColumn key={pos} position={pos} />)}
      </div>
    </div>
  )
}

function PositionColumn({ position }: { position: Position }) {
  const initial = roster
    .filter((p) => p.position === position)
    .sort((a, b) => a.depth - b.depth || a.jersey - b.jersey)
  const [order, setOrder] = useState<Player[]>(initial)
  const side = POSITION_SIDE[position]
  const accent = side === 'offense' ? PALETTE.brassRGB : side === 'defense' ? PALETTE.violetRGB : PALETTE.emeraldRGB

  return (
    <HeroFrame intensity="md" accentRgb={accent} accentRgb2={PALETTE.cyanRGB}>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconPlinth accentRgb={accent} size={36}>
            <span style={{ fontFamily: FONT.label, fontSize: 11, fontWeight: 700, color: `rgba(${accent},0.95)`, letterSpacing: '0.08em' }}>{position}</span>
          </IconPlinth>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text }}>{POSITION_LABEL[position]}</div>
            <Kicker size={9} color={PALETTE.textMuted}>{order.length} players</Kicker>
          </div>
        </div>
        <Reorder.Group axis="y" values={order} onReorder={setOrder} style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
          {order.map((p, i) => (
            <Reorder.Item
              key={p.id}
              value={p}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px',
                borderRadius: 12,
                background: i === 0
                  ? `linear-gradient(145deg, rgba(${accent},0.16), rgba(${PALETTE.cyanRGB},0.04))`
                  : 'rgba(255,255,255,0.03)',
                border: i === 0 ? `1px solid rgba(${accent},0.40)` : `1px solid ${PALETTE.border}`,
                cursor: 'grab',
              }}
              whileDrag={{ scale: 1.04, boxShadow: `0 12px 30px -10px rgba(${accent},0.6)` }}
            >
              <Avatar name={p.name} size={36} accentRgb={accent} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </div>
                <Kicker size={9} color={PALETTE.textMuted}>#{p.jersey} · {p.classYear}</Kicker>
              </div>
              <span style={{ fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'transparent' }}>
                <Shimmer accentRgb={accent} secondaryRgb={PALETTE.cyanRGB}>{i === 0 ? '1' : `${i + 1}`}</Shimmer>
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </HeroFrame>
  )
}
