'use client'

import Link from 'next/link'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE } from '@/design/constants'
import { opponents } from '@/data/opponents'

const SCOUT_ACCENT = PALETTE.amberRGB
const SCOUT_SECONDARY = PALETTE.brassRGB

export default function ScoutOpponentsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={SCOUT_ACCENT} accentRgb2={SCOUT_SECONDARY}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={SCOUT_ACCENT} size={64}>
            <OutlineIcon name="scout" color={`rgb(${SCOUT_ACCENT})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${SCOUT_ACCENT},0.85)`}>Cross-cutting · Scouting</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Opponents
            </h1>
            <Kicker color={PALETTE.textMuted}>{opponents.length} dossiers · season scouting</Kicker>
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={SCOUT_ACCENT}>Upcoming Dossiers</SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {opponents.map((o) => (
          <Link key={o.id} href={`/scout/opponents/${o.id}`} style={{ textDecoration: 'none' }}>
            <HeroFrame intensity="sm" accentRgb={SCOUT_ACCENT} accentRgb2={SCOUT_SECONDARY}>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IconPlinth accentRgb={SCOUT_ACCENT} size={48}>
                    <span style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 600, color: `rgba(${SCOUT_ACCENT},0.95)` }}>
                      {o.short.slice(0, 2).toUpperCase()}
                    </span>
                  </IconPlinth>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700, color: PALETTE.text }}>{o.name}</div>
                    <Kicker size={9} color={PALETTE.textMuted}>{o.record.w}–{o.record.l} {o.nextGame ? `· ${o.nextGame}` : ''}</Kicker>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  <MiniTile label="Tendencies" value={String(o.tendencies.length)} accent={SCOUT_ACCENT} />
                  <MiniTile label="Top Plays" value={String(o.topPlays.length)} accent={SCOUT_SECONDARY} />
                </div>
              </div>
            </HeroFrame>
          </Link>
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
      <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
