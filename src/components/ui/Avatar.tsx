'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { staffAvatarFor, monogramFor } from '@/lib/avatars'
import { FONT, PALETTE } from '@/design/constants'

interface Props {
  name: string
  size?: number
  accentRgb?: string
  style?: CSSProperties
}

export default function Avatar({
  name,
  size = 46,
  accentRgb = '167,139,250',
  style,
}: Props) {
  const url = staffAvatarFor(name)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        flexShrink: 0,
        border: `1px solid rgba(${accentRgb},0.55)`,
        boxShadow: `0 0 0 2px rgba(${accentRgb},0.10), 0 4px 10px -3px rgba(${accentRgb},0.45)`,
        overflow: 'hidden',
        background: `linear-gradient(145deg, rgba(${accentRgb},0.20), rgba(${accentRgb},0.04))`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {url ? (
        <Image
          src={url}
          alt={name}
          width={size}
          height={size}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          unoptimized
        />
      ) : (
        <span
          style={{
            fontFamily: FONT.label,
            fontSize: Math.max(10, Math.round(size * 0.32)),
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: PALETTE.text,
          }}
        >
          {monogramFor(name)}
        </span>
      )}
    </div>
  )
}
