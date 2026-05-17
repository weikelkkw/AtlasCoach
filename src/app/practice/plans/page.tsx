'use client'

import Link from 'next/link'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { practicePlans } from '@/data/practice'

export default function PracticePlansPage() {
  const pillar = PILLARS.practice
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="clipboard" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Practice</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Practice Plans
            </h1>
            <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub }}>
              Periods, drills, install scripts.
            </div>
          </div>
          <PrimaryButton
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
            icon={<OutlineIcon name="plus" color={`rgba(${pillar.accentRGB},0.95)`} size={13} />}
          >
            New Plan
          </PrimaryButton>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={pillar.accentRGB}>This Week</SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
        {practicePlans.map((p) => (
          <Link key={p.id} href={`/practice/plans/${p.id}`} style={{ textDecoration: 'none' }}>
            <HeroFrame intensity="sm" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IconPlinth accentRgb={pillar.accentRGB} size={42}>
                    <OutlineIcon name="clipboard" color={`rgb(${pillar.accentRGB})`} size={18} />
                  </IconPlinth>
                  <div style={{ flex: 1 }}>
                    <Kicker size={9} color={PALETTE.textMuted}>{p.date}</Kicker>
                    <div style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700, color: PALETTE.text }}>{p.title}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <MiniStat label="Periods" value={String(p.periods.length)} accent={pillar.accentRGB} />
                  <MiniStat label="Week" value={String(p.week)} accent={PALETTE.brassRGB} />
                  <MiniStat label="Focus" value={`${p.installFocus.length}`} accent={PALETTE.cyanRGB} />
                </div>
              </div>
            </HeroFrame>
          </Link>
        ))}
      </div>
    </div>
  )
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
      display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0,
    }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
