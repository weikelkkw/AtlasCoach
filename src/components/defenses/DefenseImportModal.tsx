'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import { useToast } from '@/components/ui/Toast'
import { FONT, PALETTE } from '@/design/constants'
import { validateDefense, useCustomDefenses } from '@/lib/defenseStore'

const TEMPLATE = `{
  "id": "my-cover-3-cloud",
  "label": "Cover 3 Cloud",
  "shortName": "C3 Cloud",
  "description": "Three-deep zone with the corner playing the flat (cloud); safety rotates over the top.",
  "sport": "football",
  "family": "coverage",
  "personnel": "4-3",
  "players": [
    { "label": "E",  "position": "DL", "start": { "x": 0.34, "y": 0.34 } },
    { "label": "3T", "position": "DL", "start": { "x": 0.44, "y": 0.34 } },
    { "label": "1T", "position": "DL", "start": { "x": 0.54, "y": 0.34 } },
    { "label": "E",  "position": "DL", "start": { "x": 0.66, "y": 0.34 } },
    { "label": "W",  "position": "LB", "start": { "x": 0.32, "y": 0.46 } },
    { "label": "M",  "position": "LB", "start": { "x": 0.50, "y": 0.46 } },
    { "label": "S",  "position": "LB", "start": { "x": 0.66, "y": 0.46 } },
    { "label": "C",  "position": "CB", "start": { "x": 0.14, "y": 0.40 } },
    { "label": "C",  "position": "CB", "start": { "x": 0.86, "y": 0.40 } },
    { "label": "F",  "position": "S",  "start": { "x": 0.50, "y": 0.66 } },
    { "label": "S",  "position": "S",  "start": { "x": 0.78, "y": 0.46 } }
  ]
}`

interface Props {
  open: boolean
  onClose: () => void
}

export default function DefenseImportModal({ open, onClose }: Props) {
  const [text, setText] = useState(TEMPLATE)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { add } = useCustomDefenses()
  const { push } = useToast()

  useEffect(() => {
    if (open) { setError(null); setText(TEMPLATE) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleImport = () => {
    setError(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      return
    }
    const result = validateDefense(parsed)
    if (!result.ok) {
      setError(result.error)
      return
    }
    add(result.defense)
    push({
      title: 'Defense imported',
      body: `${result.defense.label} — added to your library.`,
      variant: 'success',
      icon: 'sparkle',
    })
    onClose()
  }

  const handleFile = async (file: File) => {
    const text = await file.text()
    setText(text)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '8vh 20px 20px',
            overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 720 }}
          >
            <HeroFrame intensity="lg" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <IconPlinth accentRgb={PALETTE.violetRGB} size={48}>
                    <OutlineIcon name="download" color={`rgb(${PALETTE.violetRGB})`} size={22} />
                  </IconPlinth>
                  <div style={{ flex: 1 }}>
                    <Kicker color={`rgba(${PALETTE.violetRGB},0.95)`}>Import Defense</Kicker>
                    <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em' }}>
                      Paste JSON or upload a file
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 9px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                    color: PALETTE.textMuted,
                  }}>ESC</span>
                </div>

                <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, lineHeight: 1.6 }}>
                  Defenses are JSON with <span style={{ color: `rgb(${PALETTE.violetRGB})` }}>id, label, shortName, description, players[]</span>.
                  Each player needs a <span style={{ color: `rgb(${PALETTE.brassRGB})` }}>label, position, start: &#123; x, y &#125;</span>
                  in field-normalized coordinates (LOS sits at y=0.30, attacking endzone is y=1).
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                  style={{ display: 'none' }}
                />

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  spellCheck={false}
                  style={{
                    width: '100%',
                    minHeight: 320,
                    padding: 14,
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.45)',
                    border: `1px solid ${PALETTE.border}`,
                    color: PALETTE.text,
                    fontFamily: 'ui-monospace, SF Mono, Menlo, monospace',
                    fontSize: 12,
                    lineHeight: 1.55,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />

                {error && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: `rgba(${PALETTE.redRGB},0.10)`,
                    border: `1px solid rgba(${PALETTE.redRGB},0.40)`,
                    fontFamily: FONT.body, fontSize: 12,
                    color: '#fca5a5',
                    lineHeight: 1.5,
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ flex: 1 }} />
                  <SecondaryButton
                    icon={<OutlineIcon name="download" color={PALETTE.textSub} size={12} />}
                    onClick={() => fileRef.current?.click()}
                  >
                    Choose File
                  </SecondaryButton>
                  <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                  <PrimaryButton
                    accentRgb={PALETTE.violetRGB}
                    secondaryRgb={PALETTE.brassRGB}
                    icon={<OutlineIcon name="plus" color={`rgba(${PALETTE.violetRGB},0.95)`} size={12} />}
                    onClick={handleImport}
                  >
                    <Shimmer accentRgb={PALETTE.violetRGB} secondaryRgb={PALETTE.brassRGB}>Import</Shimmer>
                  </PrimaryButton>
                </div>
              </div>
            </HeroFrame>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
