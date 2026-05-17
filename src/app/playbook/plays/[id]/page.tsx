'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import IconButton from '@/components/ui/IconButton'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import PlayAnimator from '@/components/playcanvas/PlayAnimator'
import PlayCanvas from '@/components/playcanvas/PlayCanvas'
import PlayDesigner from '@/components/playcanvas/PlayDesigner'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { getPlay, getDefense, defenses } from '@/data/plays'
import { useEditedPlay } from '@/lib/playStore'
import { useToast } from '@/components/ui/Toast'
import { simulateAsPlay } from '@/lib/playSimulation'

export default function PlayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const original = useMemo(() => getPlay(id), [id])
  const { current: play, isEdited, saveEdit, revert } = useEditedPlay(original)
  const pillar = PILLARS.playbook
  const [mode, setMode] = useState<'simulate' | 'design'>('simulate')
  const { push } = useToast()

  if (!play) notFound()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1500 }}>
      {/* ─── Hero header ─────────────────────────────────────────────── */}
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top row: back link + breadcrumb pill + action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <Link href="/playbook/plays" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <IconButton title="Back to playbook" accentRgb={pillar.accentRGB} size={32}>
                <OutlineIcon name="back" color={`rgba(${pillar.accentRGB},0.95)`} size={14} />
              </IconButton>
            </Link>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                borderRadius: 999,
                background: `rgba(${pillar.accentRGB},0.10)`,
                border: `1px solid rgba(${pillar.accentRGB},0.30)`,
                minWidth: 0,
                flexShrink: 1,
                overflow: 'hidden',
              }}
            >
              <OutlineIcon name="play-diagram" color={`rgba(${pillar.accentRGB},0.95)`} size={11} />
              <span
                style={{
                  fontFamily: FONT.label,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: `rgba(${pillar.accentRGB},0.95)`,
                  whiteSpace: 'nowrap',
                }}
              >
                Playbook
              </span>
              <span style={{ color: PALETTE.textFaint, fontFamily: FONT.label, fontSize: 9, letterSpacing: '0.18em' }}>·</span>
              <span
                style={{
                  fontFamily: FONT.label,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: PALETTE.textSub,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                }}
              >
                {play.formation}
              </span>
            </div>

            <span style={{ flex: 1 }} />

            {/* Action buttons — compact icons */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <IconButton title="Duplicate" accentRgb={pillar.accentRGB}>
                <OutlineIcon name="play-diagram" color={PALETTE.textSub} size={15} />
              </IconButton>
              <IconButton title="Export MP4" accentRgb={pillar.accentRGB}>
                <OutlineIcon name="download" color={PALETTE.textSub} size={15} />
              </IconButton>
              <IconButton title="Share link" accentRgb={pillar.accentRGB}>
                <OutlineIcon name="share" color={PALETTE.textSub} size={15} />
              </IconButton>
              <PrimaryButton
                accentRgb={pillar.accentRGB}
                secondaryRgb={pillar.secondaryRGB}
                icon={<OutlineIcon name={mode === 'design' ? 'play' : 'sparkle'} color={`rgba(${pillar.accentRGB},0.95)`} size={12} />}
                onClick={() => setMode((m) => (m === 'design' ? 'simulate' : 'design'))}
              >
                {mode === 'design' ? 'Simulate' : 'Design Mode'}
              </PrimaryButton>
            </div>
          </div>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap', minWidth: 0 }}>
            <h1
              style={{
                fontFamily: FONT.display,
                fontSize: 40,
                fontWeight: 500,
                color: PALETTE.text,
                letterSpacing: '-0.01em',
                margin: 0,
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                flexShrink: 1,
              }}
            >
              {play.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <MetaPill label="Personnel" value={play.personnel} accent={pillar.accentRGB} />
              <MetaPill label="Situation" value={play.situation} accent={PALETTE.cyanRGB} />
              <StatusPill status={play.installStatus} accent={pillar.accentRGB} secondary={pillar.secondaryRGB} />
            </div>
          </div>

          {/* Tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Kicker color={PALETTE.textMuted}>Tags</Kicker>
            {play.tags.map((t) => (
              <span
                key={t}
                style={{
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  fontFamily: FONT.label,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: PALETTE.textSub,
                  whiteSpace: 'nowrap',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </HeroFrame>

      {/* ─── Main body: canvas + rail (responsive flex) ──────────────── */}
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 720px', minWidth: 0 }}>
          {mode === 'simulate'
            ? <PlayAnimator
                play={play}
                onPrimaryChange={(id) => {
                  const next = { ...play, primaryRouteId: id }
                  saveEdit(next)
                }}
              />
            : <PlayDesigner
                play={play}
                defense={getDefense(play.defaultDefenseId) ?? defenses[0]}
                onSave={(next) => {
                  saveEdit(next)
                  setMode('simulate')
                  push({
                    title: 'Play saved',
                    body: `${next.name} — changes persist across reload.`,
                    variant: 'success',
                    icon: 'sparkle',
                  })
                }}
                onExit={() => setMode('simulate')}
              />
          }
          {isEdited && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px', borderRadius: 12,
              background: `linear-gradient(145deg, rgba(${PALETTE.brassRGB},0.12), rgba(${PALETTE.cyanRGB},0.04))`,
              border: `1px solid rgba(${PALETTE.brassRGB},0.30)`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: `rgb(${PALETTE.brassRGB})`,
                boxShadow: `0 0 6px rgba(${PALETTE.brassRGB},0.7)`,
              }} />
              <span style={{ fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.20em', color: `rgba(${PALETTE.brassRGB},0.95)` }}>
                Edited locally
              </span>
              <span style={{ flex: 1 }} />
              <button
                type="button"
                onClick={() => {
                  revert()
                  push({ title: 'Reverted', body: 'Play restored to the seed version.', variant: 'info', icon: 'back' })
                }}
                style={{
                  padding: '5px 10px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  cursor: 'pointer',
                  fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: PALETTE.textSub,
                }}
              >
                Revert
              </button>
            </div>
          )}
        </div>

        <aside style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {/* Variants */}
          <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <RailHeader accent={pillar.accentRGB}>Variants</RailHeader>
              {play.variants.length === 0 && (
                <div style={{
                  padding: 14, borderRadius: 12,
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px dashed rgba(${pillar.accentRGB},0.30)`,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <IconPlinth accentRgb={pillar.accentRGB} size={32} withBrackets={false}>
                    <OutlineIcon name="plus" color={`rgb(${pillar.accentRGB})`} size={14} />
                  </IconPlinth>
                  <div style={{ flex: 1, fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub, lineHeight: 1.55 }}>
                    No variants yet — design one against a new defense to stress-test it.
                  </div>
                </div>
              )}
              {play.variants.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {play.variants.map((v) => {
                    const d = getDefense(v.vs) ?? defenses[0]
                    const sim = simulateAsPlay(play, d)
                    return (
                      <div
                        key={v.id}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: 8,
                          padding: 10, borderRadius: 12,
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${PALETTE.border}`,
                        }}
                      >
                        {/* Wide readable preview */}
                        <div style={{ position: 'relative' }}>
                          <PlayCanvas
                            play={sim.play}
                            defense={sim.defense}
                            t={0.6}
                            width={256}
                            height={144}
                            compact
                            showLabels={false}
                            accentRgb={pillar.accentRGB}
                            secondaryRgb={pillar.secondaryRGB}
                          />
                          <span style={{
                            position: 'absolute', top: 6, left: 6,
                            padding: '3px 8px', borderRadius: 999,
                            background: 'rgba(5,5,12,0.65)',
                            border: `1px solid rgba(${PALETTE.violetRGB},0.40)`,
                            backdropFilter: 'blur(8px) saturate(1.3)',
                            WebkitBackdropFilter: 'blur(8px) saturate(1.3)',
                            fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.18em',
                            color: `rgba(${PALETTE.violetRGB},0.95)`, textTransform: 'uppercase',
                          }}>vs {d.shortName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%',
                            background: `rgb(${pillar.accentRGB})`,
                            boxShadow: `0 0 6px rgba(${pillar.accentRGB},0.7)` }} />
                          <span style={{
                            fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text,
                            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {v.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </HeroFrame>

          {/* Production */}
          <HeroFrame intensity="md" accentRgb={PALETTE.emeraldRGB} accentRgb2={pillar.accentRGB}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <RailHeader accent={PALETTE.emeraldRGB}>Production</RailHeader>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <ProdTile label="Runs" value={String(play.stats.runs)} accent={PALETTE.emeraldRGB} />
                <ProdTile label="Eff" value={`${play.stats.efficiency}%`} accent={PALETTE.brassRGB} />
                <ProdTile label="Last" value={play.stats.lastUsed.replace('Week ', 'W')} accent={PALETTE.cyanRGB} />
              </div>
            </div>
          </HeroFrame>

          {/* AI Notes */}
          <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconPlinth accentRgb={pillar.accentRGB} size={28} withBrackets={false}>
                  <OutlineIcon name="sparkle" color={`rgb(${pillar.accentRGB})`} size={14} />
                </IconPlinth>
                <Kicker color={PALETTE.textSub}>AI Notes</Kicker>
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub, lineHeight: 1.55 }}>
                Bayshore&rsquo;s Mike LB is 78% reactive on Y-cross. <span style={{ color: `rgb(${pillar.accentRGB})` }}>Pre-snap motion the H</span> to hold him a beat; window opens by 11 yards downfield.
              </div>
            </div>
          </HeroFrame>
        </aside>
      </div>
    </div>
  )
}

function MetaPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Kicker size={9} color={PALETTE.textMuted}>{label}</Kicker>
      <span
        style={{
          padding: '3px 10px',
          borderRadius: 999,
          background: `rgba(${accent},0.10)`,
          border: `1px solid rgba(${accent},0.30)`,
          fontFamily: FONT.body,
          fontSize: 12,
          fontWeight: 700,
          color: `rgba(${accent},0.95)`,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function StatusPill({ status, accent, secondary }: { status: string; accent: string; secondary: string }) {
  return (
    <span
      style={{
        padding: '4px 11px',
        borderRadius: 999,
        background: `linear-gradient(145deg, rgba(${accent},0.18), rgba(${secondary},0.04))`,
        border: `1px solid rgba(${accent},0.45)`,
        fontFamily: FONT.label,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: 'transparent',
      }}
    >
      <Shimmer accentRgb={accent} secondaryRgb={secondary}>{status}</Shimmer>
    </span>
  )
}

function RailHeader({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 24, height: 1, background: `rgba(${accent},0.7)`, boxShadow: `0 0 8px rgba(${accent},0.5)` }} />
      <Kicker color={PALETTE.textSub}>{children}</Kicker>
    </div>
  )
}

function ProdTile({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      padding: '10px 8px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
      display: 'flex', flexDirection: 'column', gap: 4,
      textAlign: 'center',
    }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
