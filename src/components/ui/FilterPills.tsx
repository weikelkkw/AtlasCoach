'use client'

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { FONT, PALETTE } from '@/design/constants'

interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  value: string
  onChange: (v: string) => void
  accentRgb?: string
  secondaryRgb?: string
  style?: CSSProperties
}

export default function FilterPills({
  options,
  value,
  onChange,
  accentRgb = '232,195,118',
  secondaryRgb = '34,211,238',
  style,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        ...style,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            style={{
              padding: '5px 11px',
              borderRadius: 999,
              cursor: 'pointer',
              background: active
                ? `linear-gradient(145deg, rgba(${accentRgb},0.18), rgba(${secondaryRgb},0.06))`
                : 'rgba(255,255,255,0.03)',
              border: active
                ? `1px solid rgba(${accentRgb},0.45)`
                : '1px solid rgba(255,255,255,0.08)',
              fontFamily: FONT.label,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: active ? 'transparent' : PALETTE.textMuted,
              backdropFilter: 'blur(10px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {active ? (
              <span
                className="oaxii-shimmer-text"
                style={{
                  ['--shim-a' as string]: accentRgb,
                  ['--shim-b' as string]: secondaryRgb,
                } as CSSProperties}
              >
                {opt.label}
              </span>
            ) : (
              opt.label
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
