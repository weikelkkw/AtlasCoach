'use client'

import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE } from '@/design/constants'

const TIERS = [
  { id: 'youth',   label: 'Youth · Club',           price: 14,  per: '/mo',     features: ['1 team', 'Basic playbook', 'Roster', 'Schedule'], accent: PALETTE.cyanRGB,    current: false },
  { id: 'hs',      label: 'High School',            price: 39,  per: '/mo · team', features: ['Full play animator', 'Film integration', 'Parent comms', 'Stats dashboards'], accent: PALETTE.brassRGB, current: true },
  { id: 'college', label: 'College · Elite',        price: 249, per: '/mo · team', features: ['Scouting + tendencies', 'Multi-team admin', 'White-label film hosting', 'API access'], accent: PALETTE.emeraldRGB, current: false },
  { id: 'ad',      label: 'Athletic Department',    price: null, per: 'Contract',   features: ['Multi-sport, multi-team', 'Compliance kit', 'Custom branding', 'SLAs + onboarding'], accent: PALETTE.violetRGB, current: false },
]

export default function BillingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.emeraldRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={PALETTE.brassRGB} size={64}>
            <OutlineIcon name="trophy" color={`rgb(${PALETTE.brassRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${PALETTE.brassRGB},0.85)`}>Settings · Billing</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Plan & Billing
            </h1>
            <Kicker color={PALETTE.textMuted}>Currently on High School · $39 / mo / team</Kicker>
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={PALETTE.brassRGB}>Plans</SectionHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        {TIERS.map((t) => (
          <HeroFrame key={t.id} intensity="md" accentRgb={t.accent} accentRgb2={PALETTE.brassRGB}>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Kicker color={`rgba(${t.accent},0.95)`}>{t.label}</Kicker>
                {t.current && (
                  <span style={{
                    padding: '3px 8px', borderRadius: 999,
                    background: `rgba(${PALETTE.emeraldRGB},0.18)`,
                    border: `1px solid rgba(${PALETTE.emeraldRGB},0.40)`,
                    fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                    color: 'transparent',
                  }}>
                    <Shimmer accentRgb={PALETTE.emeraldRGB} secondaryRgb={PALETTE.brassRGB}>Current</Shimmer>
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: FONT.display, fontSize: 48, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  <Shimmer accentRgb={t.accent} secondaryRgb={PALETTE.brassRGB}>
                    {t.price === null ? 'Custom' : `$${t.price}`}
                  </Shimmer>
                </span>
                <Kicker color={PALETTE.textMuted}>{t.per}</Kicker>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {t.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: `rgb(${t.accent})`, boxShadow: `0 0 6px rgba(${t.accent},0.6)` }} />
                    <span style={{ fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub }}>{f}</span>
                  </div>
                ))}
              </div>
              <PrimaryButton
                accentRgb={t.accent}
                secondaryRgb={PALETTE.brassRGB}
                icon={<OutlineIcon name="forward" color={`rgba(${t.accent},0.95)`} size={12} />}
              >
                {t.current ? 'Manage' : t.price === null ? 'Contact Sales' : 'Upgrade'}
              </PrimaryButton>
            </div>
          </HeroFrame>
        ))}
      </div>
    </div>
  )
}
