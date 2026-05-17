'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { FONT } from '@/design/constants'

interface Props {
  children: ReactNode
  accentRgb?: string
  secondaryRgb?: string
  icon?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  style?: CSSProperties
  ariaLabel?: string
}

export default function PrimaryButton({
  children,
  accentRgb = '232,195,118',
  secondaryRgb = '34,211,238',
  icon,
  onClick,
  type = 'button',
  style,
  ariaLabel,
}: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      style={{
        padding: '9px 16px',
        borderRadius: 999,
        cursor: 'pointer',
        background: `linear-gradient(145deg, rgba(${accentRgb},0.18), rgba(${secondaryRgb},0.06))`,
        border: `1px solid rgba(${accentRgb},0.40)`,
        fontFamily: FONT.label,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(14px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
        boxShadow: `0 10px 26px -12px rgba(${accentRgb},0.55), inset 0 1px 0 rgba(255,255,255,0.10)`,
        color: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      {icon ? <span style={{ color: `rgba(${accentRgb},0.95)`, display: 'inline-flex' }}>{icon}</span> : null}
      <span
        className="oaxii-shimmer-text"
        style={{
          ['--shim-a' as string]: accentRgb,
          ['--shim-b' as string]: secondaryRgb,
        } as CSSProperties}
      >
        {children}
      </span>
    </motion.button>
  )
}
