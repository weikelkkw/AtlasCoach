'use client'

import type { CSSProperties } from 'react'
import { FONT, PALETTE } from '@/design/constants'
import Shimmer from './Shimmer'
import Kicker from './Kicker'

interface Bar {
  label: string
  value: number
  isToday?: boolean
  loss?: boolean
}

interface Props {
  bars: Bar[]
  max?: number
  accentRgb?: string
  secondaryRgb?: string
  height?: number
  valueFormatter?: (v: number) => string
  style?: CSSProperties
}

export default function BarChart({
  bars,
  max,
  accentRgb = '232,195,118',
  secondaryRgb = '34,211,238',
  height = 180,
  valueFormatter = (v) => String(v),
  style,
}: Props) {
  const m = max ?? Math.max(1, ...bars.map((b) => b.value))
  const peakIdx = bars.reduce((p, b, i) => b.value > bars[p].value ? i : p, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bars.length}, 1fr)`, gap: 10, alignItems: 'flex-end', height }}>
        {bars.map((b, i) => {
          const h = Math.max(4, (b.value / m) * (height - 30))
          const isPeak = i === peakIdx && !b.loss
          const color = b.loss ? PALETTE.redRGB : accentRgb
          return (
            <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
              {b.isToday && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: `rgb(${secondaryRgb})`,
                  boxShadow: `0 0 8px rgba(${secondaryRgb},0.7)`,
                }} />
              )}
              <div style={{
                width: '100%',
                height: h,
                borderRadius: 6,
                background: b.loss
                  ? `linear-gradient(180deg, rgb(${PALETTE.redRGB}) 0%, rgba(${PALETTE.redRGB},0.18) 100%)`
                  : `linear-gradient(180deg, rgb(${color}) 0%, rgba(${color},0.18) 100%)`,
                boxShadow: isPeak ? `0 0 22px rgba(${color},0.65)` : `0 0 10px rgba(${color},0.25)`,
                border: `1px solid rgba(${color},0.40)`,
              }} />
              <span style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em' }}>
                {b.loss
                  ? <span className="loss-text">{valueFormatter(b.value)}</span>
                  : <Shimmer accentRgb={color} secondaryRgb={secondaryRgb}>{valueFormatter(b.value)}</Shimmer>}
              </span>
              <Kicker size={8} color={b.isToday ? `rgb(${secondaryRgb})` : PALETTE.textMuted}>{b.label}</Kicker>
            </div>
          )
        })}
      </div>
    </div>
  )
}
