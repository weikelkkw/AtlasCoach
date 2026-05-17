import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import { FONT, PALETTE } from '@/design/constants'

const ACCENT_BY_PILLAR: Record<string, { a: string; b: string }> = {
  film:      { a: PALETTE.cyanRGB,    b: PALETTE.brassRGB },
  scout:     { a: PALETTE.amberRGB,   b: PALETTE.brassRGB },
  analytics: { a: PALETTE.emeraldRGB, b: PALETTE.brassRGB },
  settings:  { a: PALETTE.violetRGB,  b: PALETTE.brassRGB },
}

interface Props {
  pillar: keyof typeof ACCENT_BY_PILLAR
  title: string
  kicker: string
  body: string
  icon: string
}

export default function ComingSoon({ pillar, title, kicker, body, icon }: Props) {
  const accent = ACCENT_BY_PILLAR[pillar] ?? { a: PALETTE.brassRGB, b: PALETTE.cyanRGB }
  return (
    <div style={{ maxWidth: 980 }}>
      <HeroFrame intensity="lg" accentRgb={accent.a} accentRgb2={accent.b}>
        <div style={{ padding: '40px 36px', display: 'flex', alignItems: 'center', gap: 26 }}>
          <IconPlinth accentRgb={accent.a} size={96}>
            <OutlineIcon name={icon} color={`rgb(${accent.a})`} size={42} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${accent.a},0.85)`}>{kicker}</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 44, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '6px 0 12px' }}>
              {title}
            </h1>
            <div style={{ fontFamily: FONT.body, fontSize: 14, color: PALETTE.textSub, lineHeight: 1.65, maxWidth: 620 }}>
              {body}
            </div>
            <div style={{ marginTop: 18 }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: `linear-gradient(145deg, rgba(${accent.a},0.18), rgba(${accent.b},0.06))`,
                border: `1px solid rgba(${accent.a},0.4)`,
                fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
              }}>
                <Shimmer accentRgb={accent.a} secondaryRgb={accent.b}>Coming in Phase 2</Shimmer>
              </span>
            </div>
          </div>
        </div>
      </HeroFrame>
    </div>
  )
}
