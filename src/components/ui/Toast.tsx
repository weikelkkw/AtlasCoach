'use client'

// Toast system — brass-shimmer pills anchored bottom-right.
// usage:  const { push } = useToast(); push({ title: 'Play saved', variant: 'success' })

import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import OutlineIcon from '@/components/OutlineIcon'
import { FONT, PALETTE } from '@/design/constants'

type Variant = 'success' | 'info' | 'warning' | 'error'

interface ToastPayload {
  title: string
  body?: string
  variant?: Variant
  icon?: string
  ttlMs?: number
}

interface ToastItem extends Required<Omit<ToastPayload, 'body' | 'icon'>> {
  id: number
  body?: string
  icon?: string
}

interface ToastCtx {
  push: (t: ToastPayload) => void
}

const Ctx = createContext<ToastCtx | null>(null)

const ACCENT: Record<Variant, { a: string; b: string; icon: string }> = {
  success: { a: PALETTE.emeraldRGB, b: PALETTE.brassRGB, icon: 'sparkle' },
  info:    { a: PALETTE.cyanRGB,    b: PALETTE.brassRGB, icon: 'bell' },
  warning: { a: PALETTE.amberRGB,   b: PALETTE.brassRGB, icon: 'bell' },
  error:   { a: PALETTE.redRGB,     b: PALETTE.brassRGB, icon: 'back' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const push = useCallback((t: ToastPayload) => {
    const id = ++counterRef.current
    const item: ToastItem = {
      id,
      title: t.title,
      body: t.body,
      variant: t.variant ?? 'success',
      ttlMs: t.ttlMs ?? 3200,
      icon: t.icon,
    }
    setItems((prev) => [...prev, item])
    if (item.ttlMs > 0) {
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id))
      }, item.ttlMs)
    }
  }, [])

  const ctxValue = useMemo<ToastCtx>(() => ({ push }), [push])

  return (
    <Ctx.Provider value={ctxValue}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {items.map((it) => {
            const accent = ACCENT[it.variant]
            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 12, x: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                style={{
                  pointerEvents: 'auto',
                  minWidth: 260,
                  maxWidth: 360,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: 'rgba(8,8,16,0.85)',
                  border: `1px solid rgba(${accent.a},0.45)`,
                  boxShadow: `0 14px 32px -10px rgba(${accent.a},0.45), 0 0 0 1px rgba(255,255,255,0.04)`,
                  backdropFilter: 'blur(14px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `linear-gradient(145deg, rgba(${accent.a},0.22), rgba(${accent.b},0.05))`,
                  border: `1px solid rgba(${accent.a},0.40)`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <OutlineIcon name={it.icon ?? accent.icon} color={`rgba(${accent.a},0.95)`} size={14} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em',
                    textTransform: 'uppercase', color: `rgba(${accent.a},0.95)`,
                  }}>
                    {it.title}
                  </div>
                  {it.body && (
                    <div style={{ marginTop: 4, fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub, lineHeight: 1.5 }}>
                      {it.body}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) return { push: () => {} }
  return ctx
}
