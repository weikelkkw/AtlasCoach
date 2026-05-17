'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { PALETTE } from '@/design/constants'

interface Props {
  children: ReactNode
  onClick?: () => void
  title?: string
  size?: number
  accentRgb?: string
  active?: boolean
  style?: CSSProperties
}

export default function IconButton({
  children, onClick, title, size = 36, accentRgb = PALETTE.brassRGB, active, style,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: active
          ? `linear-gradient(145deg, rgba(${accentRgb},0.22), rgba(${accentRgb},0.06))`
          : 'rgba(255,255,255,0.03)',
        border: active
          ? `1px solid rgba(${accentRgb},0.50)`
          : '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(10px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}
