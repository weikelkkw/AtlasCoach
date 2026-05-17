'use client'

import { useState } from 'react'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import FieldSurface from '@/components/playcanvas/FieldSurface'
import { FONT, PALETTE } from '@/design/constants'
import type { Sport } from '@/data/routes'

const SPORTS: { id: Sport; label: string; icon: string; status: 'live' | 'beta' | 'soon' }[] = [
  { id: 'football',   label: 'Football',   icon: 'football',   status: 'live' },
  { id: 'basketball', label: 'Basketball', icon: 'basketball', status: 'live' },
  { id: 'soccer',     label: 'Soccer',     icon: 'soccer',     status: 'live' },
  { id: 'hockey',     label: 'Hockey',     icon: 'hockey',     status: 'live' },
  { id: 'baseball',   label: 'Baseball',   icon: 'baseball',   status: 'live' },
  { id: 'lacrosse',   label: 'Lacrosse',   icon: 'lacrosse',   status: 'live' },
]

export default function SettingsSportPage() {
  const [active, setActive] = useState<Sport>('football')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={PALETTE.brassRGB} size={64}>
            <OutlineIcon name="whistle" color={`rgb(${PALETTE.brassRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${PALETTE.brassRGB},0.85)`}>Settings · Sport</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Active Sport
            </h1>
            <Kicker color={PALETTE.textMuted}>Switches the play canvas, route library, and analytics dashboards.</Kicker>
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={PALETTE.brassRGB}>Choose Sport</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {SPORTS.map((s) => {
          const live = s.status !== 'soon'
          const isActive = s.id === active && live
          return (
            <button
              key={s.id}
              type="button"
              disabled={!live}
              onClick={() => live && setActive(s.id)}
              style={{
                cursor: live ? 'pointer' : 'not-allowed',
                background: 'transparent', border: 'none', padding: 0, textAlign: 'left',
              }}
            >
              <HeroFrame intensity="sm" accentRgb={isActive ? PALETTE.brassRGB : PALETTE.textFaint.slice(4, -1)} accentRgb2={PALETTE.cyanRGB}>
                <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IconPlinth accentRgb={live ? PALETTE.brassRGB : PALETTE.violetRGB} size={48}>
                    <OutlineIcon name={s.icon} color={`rgb(${live ? PALETTE.brassRGB : PALETTE.violetRGB})`} size={22} />
                  </IconPlinth>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 700, color: PALETTE.text }}>{s.label}</div>
                    <Kicker size={9} color={live ? `rgba(${PALETTE.emeraldRGB},0.95)` : PALETTE.textMuted}>{s.status}</Kicker>
                  </div>
                  {isActive && <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: `rgb(${PALETTE.brassRGB})`,
                    boxShadow: `0 0 8px rgba(${PALETTE.brassRGB},0.7)`,
                  }} />}
                </div>
              </HeroFrame>
            </button>
          )
        })}
      </div>

      <SectionHeader accentRgb={PALETTE.brassRGB}>Preview Surface</SectionHeader>
      <HeroFrame intensity="md" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: 18, display: 'flex', justifyContent: 'center' }}>
          <FieldSurface
            sport={active}
            width={640}
            height={420}
            accentRgb={PALETTE.brassRGB}
            secondaryRgb={PALETTE.cyanRGB}
          />
        </div>
      </HeroFrame>
    </div>
  )
}
