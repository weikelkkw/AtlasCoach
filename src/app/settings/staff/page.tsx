'use client'

import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Avatar from '@/components/ui/Avatar'
import Kicker from '@/components/ui/Kicker'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE } from '@/design/constants'
import { team } from '@/data/team'

export default function SettingsStaffPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>
      <HeroFrame intensity="lg" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={PALETTE.violetRGB} size={64}>
            <OutlineIcon name="roster" color={`rgb(${PALETTE.violetRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${PALETTE.violetRGB},0.85)`}>Settings · Staff</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Coaching Staff
            </h1>
            <Kicker color={PALETTE.textMuted}>{team.staff.length} on staff · invite-only access</Kicker>
          </div>
          <PrimaryButton accentRgb={PALETTE.violetRGB} secondaryRgb={PALETTE.brassRGB}
            icon={<OutlineIcon name="plus" color={`rgba(${PALETTE.violetRGB},0.95)`} size={13} />}>
            Invite Coach
          </PrimaryButton>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={PALETTE.violetRGB}>Roster</SectionHeader>
      <HeroFrame intensity="md" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {team.staff.map((s) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${PALETTE.border}`,
            }}>
              <Avatar name={s.name} size={48} accentRgb={PALETTE.violetRGB} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text }}>{s.name}</div>
                <Kicker size={9} color={PALETTE.textMuted}>{s.role}</Kicker>
              </div>
              <SecondaryButton icon={<OutlineIcon name="settings" color={PALETTE.textSub} size={12} />}>Permissions</SecondaryButton>
            </div>
          ))}
        </div>
      </HeroFrame>
    </div>
  )
}
