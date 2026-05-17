'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { FONT, PALETTE } from '@/design/constants'

interface Props {
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  style?: CSSProperties
}

export default function SecondaryButton({ children, icon, onClick, style }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      style={{
        padding: '8px 14px',
        borderRadius: 999,
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        fontFamily: FONT.label,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(10px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
        color: PALETTE.textSub,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      {icon ? <span style={{ display: 'inline-flex' }}>{icon}</span> : null}
      <span>{children}</span>
    </motion.button>
  )
}
