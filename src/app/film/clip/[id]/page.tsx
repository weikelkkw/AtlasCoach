'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Avatar from '@/components/ui/Avatar'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SecondaryButton from '@/components/ui/SecondaryButton'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { FONT, PALETTE } from '@/design/constants'
import { getClip, formatSeconds } from '@/data/film'

const FILM_ACCENT = PALETTE.cyanRGB
const FILM_SECONDARY = PALETTE.brassRGB

export default function ClipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const clip = useMemo(() => getClip(id), [id])
  const [activeTag, setActiveTag] = useState<string | null>(null)

  if (!clip) notFound()
  const tagAt = activeTag != null ? clip.tags.find((t) => t.id === activeTag) : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, maxWidth: 1500 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
        {/* Header */}
        <HeroFrame intensity="sm" accentRgb={FILM_ACCENT} accentRgb2={FILM_SECONDARY}>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Kicker color={PALETTE.textMuted}>
                <Link href="/film/library" style={{ color: 'inherit', textDecoration: 'none' }}>Film</Link>
                {'  /  '}<span style={{ color: PALETTE.textSub }}>Week {clip.week}</span>
                {'  /  '}<span style={{ color: `rgba(${FILM_ACCENT},0.95)` }}>{clip.opponent}</span>
              </Kicker>
              <div style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', marginTop: 2 }}>
                {clip.title}
              </div>
            </div>
            <SecondaryButton icon={<OutlineIcon name="download" color={PALETTE.textSub} size={12} />}>Export</SecondaryButton>
            <SecondaryButton icon={<OutlineIcon name="share" color={PALETTE.textSub} size={12} />}>Share</SecondaryButton>
            <PrimaryButton
              accentRgb={FILM_ACCENT}
              secondaryRgb={FILM_SECONDARY}
              icon={<OutlineIcon name="plus" color={`rgba(${FILM_ACCENT},0.95)`} size={12} />}
            >
              Tag Frame
            </PrimaryButton>
          </div>
        </HeroFrame>

        {/* Player */}
        <HeroFrame intensity="lg" accentRgb={FILM_ACCENT} accentRgb2={FILM_SECONDARY}>
          <div style={{ padding: 18 }}>
            <div style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              background: `linear-gradient(135deg, rgba(${FILM_ACCENT},0.10), rgba(${FILM_SECONDARY},0.05))`,
              border: `1px solid rgba(${FILM_ACCENT},0.20)`,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '44px 44px' }} />
              <IconPlinth accentRgb={FILM_ACCENT} size={96}>
                <OutlineIcon name="play" color={`rgb(${FILM_ACCENT})`} size={48} />
              </IconPlinth>
              {tagAt && (
                <div style={{
                  position: 'absolute', bottom: 14, left: 14,
                  padding: '8px 14px', borderRadius: 12,
                  background: 'rgba(0,0,0,0.55)',
                  border: `1px solid rgba(${FILM_ACCENT},0.30)`,
                  backdropFilter: 'blur(10px) saturate(1.3)',
                  WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <Kicker color={`rgba(${FILM_ACCENT},0.95)`}>{formatSeconds(tagAt.atSec)}</Kicker>
                  <span style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.text, fontWeight: 700 }}>{tagAt.play}</span>
                  <Kicker color={PALETTE.textMuted}>{tagAt.player}</Kicker>
                </div>
              )}
            </div>

            {/* Tag rail */}
            <div style={{ marginTop: 16, position: 'relative', height: 28 }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 13, height: 2,
                background: 'rgba(255,255,255,0.08)', borderRadius: 999,
              }} />
              {clip.tags.map((tag) => {
                const pct = (tag.atSec / clip.durationSec) * 100
                const loss = tag.result === 'loss' || tag.result === 'sack'
                const accent = loss ? PALETTE.redRGB : tag.result === 'td' ? PALETTE.brassRGB : FILM_ACCENT
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setActiveTag(tag.id)}
                    title={`${formatSeconds(tag.atSec)} · ${tag.play} · ${tag.player}`}
                    style={{
                      position: 'absolute',
                      left: `calc(${pct}% - 7px)`,
                      top: 6,
                      width: 14, height: 14, borderRadius: '50%',
                      background: `rgb(${accent})`,
                      boxShadow: `0 0 8px rgba(${accent},0.6), 0 0 18px rgba(${accent},0.3)`,
                      border: 'none', cursor: 'pointer',
                      transform: activeTag === tag.id ? 'scale(1.4)' : undefined,
                      transition: 'transform 200ms cubic-bezier(0.2,0.8,0.2,1)',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </HeroFrame>
      </div>

      {/* Tag list */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <HeroFrame intensity="md" accentRgb={FILM_ACCENT} accentRgb2={FILM_SECONDARY}>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 720, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 1, background: `rgba(${FILM_ACCENT},0.7)`, boxShadow: `0 0 8px rgba(${FILM_ACCENT},0.5)` }} />
              <Kicker color={PALETTE.textSub}>Tags · {clip.tags.length}</Kicker>
            </div>
            {clip.tags.length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', color: PALETTE.textMuted, fontFamily: FONT.body, fontSize: 12 }}>
                No tags yet. Drop a marker on the timeline to start a breakdown.
              </div>
            )}
            {clip.tags.map((tag) => {
              const loss = tag.result === 'loss' || tag.result === 'sack'
              const accent = loss ? PALETTE.redRGB : tag.result === 'td' ? PALETTE.brassRGB : FILM_ACCENT
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setActiveTag(tag.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: activeTag === tag.id
                      ? `linear-gradient(145deg, rgba(${accent},0.16), rgba(${FILM_SECONDARY},0.04))`
                      : 'rgba(255,255,255,0.025)',
                    border: activeTag === tag.id
                      ? `1px solid rgba(${accent},0.45)`
                      : `1px solid ${PALETTE.border}`,
                    display: 'flex', flexDirection: 'column', gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={tag.player} size={28} accentRgb={accent} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tag.player}
                      </div>
                      <Kicker size={8} color={PALETTE.textMuted}>{formatSeconds(tag.atSec)} · {tag.play}</Kicker>
                    </div>
                    <span className={loss ? 'loss-text' : ''} style={{
                      padding: '3px 8px', borderRadius: 999,
                      fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: loss ? undefined : 'transparent',
                    }}>
                      {loss ? `${tag.result}${tag.yards != null ? ` ${tag.yards}` : ''}` :
                        <Shimmer accentRgb={accent} secondaryRgb={FILM_SECONDARY}>{`${tag.result}${tag.yards != null ? ` +${tag.yards}` : ''}`}</Shimmer>}
                    </span>
                  </div>
                  <div style={{ fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub, lineHeight: 1.55 }}>
                    {tag.note}
                  </div>
                  <Kicker size={8} color={PALETTE.textFaint}>— {tag.coach}</Kicker>
                </button>
              )
            })}
          </div>
        </HeroFrame>
      </aside>
    </div>
  )
}
