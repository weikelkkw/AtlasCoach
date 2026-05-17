'use client'

import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  accentRgb?: string
  secondaryRgb?: string
  style?: CSSProperties
  className?: string
}

export default function Shimmer({
  children,
  accentRgb = '232,195,118',
  secondaryRgb = '34,211,238',
  style,
  className,
}: Props) {
  return (
    <span
      className={`oaxii-shimmer-text ${className ?? ''}`}
      style={{
        ['--shim-a' as string]: accentRgb,
        ['--shim-b' as string]: secondaryRgb,
        ...style,
      } as CSSProperties}
    >
      {children}
    </span>
  )
}
