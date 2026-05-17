'use client'

import type { CSSProperties, ReactNode } from 'react'

interface Props {
  accentRgb?: string
  size?: number
  children: ReactNode
  withBrackets?: boolean
  style?: CSSProperties
}

export default function IconPlinth({
  accentRgb = '232,195,118',
  size = 44,
  children,
  withBrackets = true,
  style,
}: Props) {
  const r = Math.round(size * 0.28)
  const bracketLen = Math.max(6, Math.round(size * 0.18))
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: r,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(145deg, rgba(${accentRgb},0.20), rgba(${accentRgb},0.04))`,
        border: `1px solid rgba(${accentRgb},0.32)`,
        boxShadow: `inset 0 0 18px rgba(${accentRgb},0.10), 0 6px 14px -6px rgba(0,0,0,0.6)`,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: r,
          background: `radial-gradient(circle at 30% 25%, rgba(${accentRgb},0.30), transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
      {withBrackets ? (
        <>
          {[
            { top: 4, left: 4, w: bracketLen, h: 1 },
            { top: 4, left: 4, w: 1, h: bracketLen },
            { top: 4, right: 4, w: bracketLen, h: 1 },
            { top: 4, right: 4, w: 1, h: bracketLen },
            { bottom: 4, left: 4, w: bracketLen, h: 1 },
            { bottom: 4, left: 4, w: 1, h: bracketLen },
            { bottom: 4, right: 4, w: bracketLen, h: 1 },
            { bottom: 4, right: 4, w: 1, h: bracketLen },
          ].map((p, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                width: p.w, height: p.h,
                background: `rgba(${accentRgb},0.55)`,
                boxShadow: `0 0 4px rgba(${accentRgb},0.4)`,
              }}
            />
          ))}
        </>
      ) : null}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </div>
  )
}
