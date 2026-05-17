'use client'

import Link from 'next/link'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { schedule } from '@/data/schedule'

export default function UpcomingPage() {
  const pillar = PILLARS.game
  const upcoming = schedule.filter((g) => g.status === 'upcoming')
  const played = schedule.filter((g) => g.status === 'played')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="whistle" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Game</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Schedule
            </h1>
            <Kicker color={PALETTE.textMuted}>{played.length} played · {upcoming.length} upcoming</Kicker>
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={pillar.accentRGB}>Upcoming</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {upcoming.map((g) => (
          <HeroFrame key={g.id} intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
            <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '64px 1fr 1fr auto', gap: 18, alignItems: 'center' }}>
              <IconPlinth accentRgb={pillar.accentRGB} size={56}>
                <span style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 600, color: `rgba(${pillar.accentRGB},0.95)` }}>W{g.week}</span>
              </IconPlinth>
              <div>
                <Kicker color={PALETTE.textMuted}>{g.home ? 'HOME' : 'AWAY'} · {formatDate(g.date)}</Kicker>
                <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', marginTop: 2 }}>
                  vs {g.opponent}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <MiniTile label="Kickoff" value={formatTime(g.date)} accent={pillar.accentRGB} />
                <MiniTile label="Venue" value={g.home ? 'Atlas Field' : 'Away'} accent={PALETTE.cyanRGB} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/scout/opponents/bayshore`} style={{ textDecoration: 'none' }}>
                  <PrimaryButton accentRgb={PALETTE.amberRGB} secondaryRgb={pillar.accentRGB}
                    icon={<OutlineIcon name="scout" color={`rgba(${PALETTE.amberRGB},0.95)`} size={12} />}>
                    Scout
                  </PrimaryButton>
                </Link>
                <Link href={`/game/live/${g.id}`} style={{ textDecoration: 'none' }}>
                  <PrimaryButton accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB}
                    icon={<OutlineIcon name="whistle" color={`rgba(${pillar.accentRGB},0.95)`} size={12} />}>
                    Wristband
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </HeroFrame>
        ))}
      </div>

      <SectionHeader accentRgb={pillar.accentRGB}>Played</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {played.map((g) => {
          const won = (g.result?.us ?? 0) > (g.result?.them ?? 0)
          return (
            <Link key={g.id} href={`/game/${g.id}/recap`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: 14, alignItems: 'center',
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${PALETTE.border}`,
                cursor: 'pointer',
              }}>
                <Kicker color={PALETTE.textMuted}>W{g.week}</Kicker>
                <div>
                  <Kicker size={9} color={PALETTE.textMuted}>{g.home ? 'HOME' : 'AWAY'} · {formatDate(g.date)}</Kicker>
                  <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text }}>
                    vs {g.opponent}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: won ? `rgba(${PALETTE.emeraldRGB},0.16)` : `rgba(${PALETTE.redRGB},0.16)`,
                  border: won ? `1px solid rgba(${PALETTE.emeraldRGB},0.40)` : `1px solid rgba(${PALETTE.redRGB},0.40)`,
                  fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                  color: won ? 'transparent' : '#fca5a5',
                }} className={won ? '' : 'loss-text'}>
                  {won ? <Shimmer accentRgb={PALETTE.emeraldRGB} secondaryRgb={pillar.accentRGB}>W</Shimmer> : 'L'}
                </span>
                <span style={{ fontFamily: FONT.body, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>
                  {won
                    ? <Shimmer accentRgb={pillar.accentRGB} secondaryRgb={PALETTE.emeraldRGB}>{`${g.result?.us} – ${g.result?.them}`}</Shimmer>
                    : <span className="loss-text">{`${g.result?.us} – ${g.result?.them}`}</span>}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function MiniTile({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      padding: '6px 12px',
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

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
