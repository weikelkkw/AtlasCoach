'use client'

import type { ReactNode } from 'react'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import { FONT, PALETTE } from '@/design/constants'

interface Props {
  icon: string
  kicker?: string
  title: string
  body?: string
  accent?: string
  secondary?: string
  cta?: ReactNode
}

export default function EmptyState({
  icon,
  kicker,
  title,
  body,
  accent = PALETTE.brassRGB,
  secondary = PALETTE.cyanRGB,
  cta,
}: Props) {
  return (
    <HeroFrame intensity="md" accentRgb={accent} accentRgb2={secondary}>
      <div style={{
        padding: 36,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
      }}>
        <IconPlinth accentRgb={accent} size={64}>
          <OutlineIcon name={icon} color={`rgb(${accent})`} size={28} />
        </IconPlinth>
        {kicker && <Kicker color={`rgba(${accent},0.95)`}>{kicker}</Kicker>}
        <div style={{
          fontFamily: FONT.display, fontSize: 24, fontWeight: 500,
          color: PALETTE.text, letterSpacing: '-0.01em',
        }}>{title}</div>
        {body && (
          <div style={{
            maxWidth: 420, fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, lineHeight: 1.6,
          }}>
            {body}
          </div>
        )}
        {cta && <div style={{ marginTop: 8 }}>{cta}</div>}
      </div>
    </HeroFrame>
  )
}
