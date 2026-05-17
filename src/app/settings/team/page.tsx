'use client'

import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { FONT, PALETTE } from '@/design/constants'
import { team } from '@/data/team'

export default function SettingsTeamPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>
      <HeroFrame intensity="lg" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={PALETTE.brassRGB} size={64}>
            <OutlineIcon name="settings" color={`rgb(${PALETTE.brassRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${PALETTE.brassRGB},0.85)`}>Settings · Team</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Team Identity
            </h1>
          </div>
          <PrimaryButton accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.cyanRGB}>Save Changes</PrimaryButton>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={PALETTE.brassRGB}>Branding</SectionHeader>
      <HeroFrame intensity="md" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Field label="Team Name" value={team.name} />
          <Field label="Mascot" value={team.mascot} />
          <Field label="Short Name" value={team.short} />
          <Field label="Subdomain" value="coastalprep.atlas.coach" prefix={<OutlineIcon name="share" color={PALETTE.textMuted} size={12} />} />
          <Field label="Primary Accent" value="#e8c376" colorSwatch="232,195,118" />
          <Field label="Secondary Accent" value="#22d3ee" colorSwatch="34,211,238" />
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={PALETTE.brassRGB}>Season</SectionHeader>
      <HeroFrame intensity="md" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
          <Field label="Season" value={team.season} />
          <Field label="Record" value={`${team.record.wins}–${team.record.losses}`} />
          <Field label="Conference" value="Coastal Prep Athletic Conference" />
        </div>
      </HeroFrame>
    </div>
  )
}

function Field({ label, value, colorSwatch, prefix }: { label: string; value: string; colorSwatch?: string; prefix?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Kicker color={PALETTE.textMuted}>{label}</Kicker>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${PALETTE.border}`,
        backdropFilter: 'blur(10px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
      }}>
        {prefix}
        {colorSwatch && (
          <span style={{
            width: 16, height: 16, borderRadius: 4,
            background: `rgb(${colorSwatch})`,
            boxShadow: `0 0 8px rgba(${colorSwatch},0.6)`,
          }} />
        )}
        <span style={{ flex: 1, fontFamily: FONT.body, fontSize: 14, fontWeight: 500, color: PALETTE.text }}>
          {value}
        </span>
      </div>
    </div>
  )
}
