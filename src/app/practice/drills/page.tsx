'use client'

import { useState, useMemo } from 'react'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import FilterPills from '@/components/ui/FilterPills'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { drills } from '@/data/drills'

const CATEGORIES = ['all', 'individual', 'group', 'team', 'special']

export default function DrillsPage() {
  const pillar = PILLARS.practice
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => drills.filter((d) => cat === 'all' || d.category === cat), [cat])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="play-diagram" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Practice</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Drill Library
            </h1>
            <Kicker color={PALETTE.textMuted}>{drills.length} drills · {filtered.length} shown</Kicker>
          </div>
          <PrimaryButton
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
            icon={<OutlineIcon name="plus" color={`rgba(${pillar.accentRGB},0.95)`} size={13} />}
          >
            New Drill
          </PrimaryButton>
        </div>
      </HeroFrame>

      <FilterPills
        accentRgb={pillar.accentRGB}
        secondaryRgb={pillar.secondaryRGB}
        value={cat}
        onChange={setCat}
        options={CATEGORIES.map((c) => ({ value: c, label: c === 'all' ? 'All' : c }))}
      />

      <SectionHeader accentRgb={pillar.accentRGB}>All Drills</SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filtered.map((d) => (
          <HeroFrame key={d.id} intensity="sm" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IconPlinth accentRgb={pillar.accentRGB} size={42}>
                  <OutlineIcon name="play-diagram" color={`rgb(${pillar.accentRGB})`} size={18} />
                </IconPlinth>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Kicker size={9} color={PALETTE.textMuted}>{d.category} · {d.position}</Kicker>
                  <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.name}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub, lineHeight: 1.55 }}>
                {d.description}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <MiniTile label="Min" value={`${d.durationMin}`} accent={PALETTE.cyanRGB} />
                <MiniTile label="Emphasis" value={d.emphasis} accent={PALETTE.brassRGB} />
              </div>
            </div>
          </HeroFrame>
        ))}
      </div>
    </div>
  )
}

function MiniTile({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
      display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0,
    }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
