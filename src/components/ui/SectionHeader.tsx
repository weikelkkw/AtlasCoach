'use client'

import type { CSSProperties, ReactNode } from 'react'
import { FONT, PALETTE } from '@/design/constants'

interface Props {
  children: ReactNode
  accentRgb?: string
  trailing?: ReactNode
  style?: CSSProperties
}

export default function SectionHeader({
  children,
  accentRgb = '232,195,118',
  trailing,
  style,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        margin: '20px 0 14px',
        ...style,
      }}
    >
      <span
        style={{
          width: 24,
          height: 1,
          background: `linear-gradient(90deg, rgba(${accentRgb},0.9), rgba(${accentRgb},0.4))`,
          boxShadow: `0 0 8px rgba(${accentRgb},0.5)`,
        }}
      />
      <span
        style={{
          fontFamily: FONT.label,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: PALETTE.textSub,
        }}
      >
        {children}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)',
        }}
      />
      {trailing ? <div style={{ marginLeft: 8 }}>{trailing}</div> : null}
    </div>
  )
}
