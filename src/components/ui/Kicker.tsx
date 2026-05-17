'use client'

import type { CSSProperties, ReactNode } from 'react'
import { FONT, PALETTE } from '@/design/constants'

export default function Kicker({
  children,
  color,
  size = 11,
  spacing = '0.24em',
  style,
}: {
  children: ReactNode
  color?: string
  size?: number
  spacing?: string
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        fontFamily: FONT.label,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: spacing,
        textTransform: 'uppercase',
        color: color ?? PALETTE.textSub,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
