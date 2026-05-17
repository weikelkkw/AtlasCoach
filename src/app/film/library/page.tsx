'use client'

import Link from 'next/link'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { FONT, PALETTE } from '@/design/constants'
import { clips, formatSeconds } from '@/data/film'

const FILM_ACCENT = PALETTE.cyanRGB
const FILM_SECONDARY = PALETTE.brassRGB

export default function FilmLibraryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={FILM_ACCENT} accentRgb2={FILM_SECONDARY}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={FILM_ACCENT} size={64}>
            <OutlineIcon name="film" color={`rgb(${FILM_ACCENT})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${FILM_ACCENT},0.85)`}>Cross-cutting · Film</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Film Room
            </h1>
            <Kicker color={PALETTE.textMuted}>{clips.length} clips · {clips.reduce((a, c) => a + c.tags.length, 0)} tags</Kicker>
          </div>
          <PrimaryButton
            accentRgb={FILM_ACCENT}
            secondaryRgb={FILM_SECONDARY}
            icon={<OutlineIcon name="plus" color={`rgba(${FILM_ACCENT},0.95)`} size={13} />}
          >
            Upload Clip
          </PrimaryButton>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={FILM_ACCENT}>Library</SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {clips.map((c) => (
          <Link key={c.id} href={`/film/clip/${c.id}`} style={{ textDecoration: 'none' }}>
            <HeroFrame intensity="sm" accentRgb={FILM_ACCENT} accentRgb2={FILM_SECONDARY}>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}>
                <ThumbnailFrame unit={c.unit} duration={formatSeconds(c.durationSec)} />
                <div>
                  <Kicker size={9} color={PALETTE.textMuted}>Week {c.week} · {c.opponent} · {c.unit}</Kicker>
                  <div style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 700, color: PALETTE.text, marginTop: 2 }}>
                    {c.title}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <MiniTile label="Duration" value={formatSeconds(c.durationSec)} accent={FILM_ACCENT} />
                  <MiniTile label="Tags" value={String(c.tags.length)} accent={FILM_SECONDARY} />
                  <MiniTile label="Unit" value={c.unit} accent={PALETTE.emeraldRGB} />
                </div>
              </div>
            </HeroFrame>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ThumbnailFrame({ unit, duration }: { unit: string; duration: string }) {
  return (
    <div style={{
      position: 'relative',
      height: 150,
      borderRadius: 12,
      background: `linear-gradient(135deg, rgba(${FILM_ACCENT},0.18), rgba(${FILM_SECONDARY},0.06))`,
      border: `1px solid rgba(${FILM_ACCENT},0.25)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage:
        'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '32px 32px' }} />
      <IconPlinth accentRgb={FILM_ACCENT} size={56}>
        <OutlineIcon name={unit === 'special' ? 'whistle' : 'film'} color={`rgb(${FILM_ACCENT})`} size={24} />
      </IconPlinth>
      <span style={{
        position: 'absolute', bottom: 8, right: 8,
        padding: '3px 8px', borderRadius: 999,
        background: 'rgba(0,0,0,0.55)', border: `1px solid rgba(${FILM_ACCENT},0.35)`,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
        color: `rgba(${FILM_ACCENT},0.95)`,
      }}>{duration}</span>
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
        <Shimmer accentRgb={accent} secondaryRgb={FILM_SECONDARY}>{value}</Shimmer>
      </span>
    </div>
  )
}
