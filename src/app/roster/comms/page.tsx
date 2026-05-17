'use client'

import { useState } from 'react'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Avatar from '@/components/ui/Avatar'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { threads, type Thread } from '@/data/comms'

export default function CommsPage() {
  const pillar = PILLARS.roster
  const [activeId, setActiveId] = useState<string>(threads[0].id)
  const active = threads.find((t) => t.id === activeId) ?? threads[0]
  const [draft, setDraft] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1500 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="chat" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Roster</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Comms
            </h1>
            <Kicker color={PALETTE.textMuted}>Team · position groups · parents · staff</Kicker>
          </div>
          <PrimaryButton
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
            icon={<OutlineIcon name="plus" color={`rgba(${pillar.accentRGB},0.95)`} size={13} />}
          >
            New Thread
          </PrimaryButton>
        </div>
      </HeroFrame>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 14, minHeight: 600 }}>
        {/* Thread list */}
        <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {threads.map((t) => <ThreadRow key={t.id} thread={t} active={t.id === activeId} onClick={() => setActiveId(t.id)} />)}
          </div>
        </HeroFrame>

        {/* Active thread */}
        <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 1, background: `rgba(${pillar.accentRGB},0.7)`, boxShadow: `0 0 8px rgba(${pillar.accentRGB},0.5)` }} />
              <div style={{ flex: 1 }}>
                <Kicker color={`rgba(${pillar.accentRGB},0.95)`}>{active.topic}</Kicker>
                <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em' }}>{active.title}</div>
              </div>
              <Kicker color={PALETTE.textMuted}>{active.participants.length} people</Kicker>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
              {active.messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Avatar name={m.from} size={36} accentRgb={pillar.accentRGB} />
                  <HeroFrame intensity="sm" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
                    <div style={{ padding: '10px 14px', maxWidth: 560 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 700, color: PALETTE.text }}>{m.from}</span>
                        <Kicker size={8} color={PALETTE.textMuted}>{m.at}</Kicker>
                      </div>
                      <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, lineHeight: 1.55 }}>{m.body}</div>
                    </div>
                  </HeroFrame>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Message the thread…"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${PALETTE.border}`,
                  color: PALETTE.text,
                  fontFamily: FONT.body,
                  fontSize: 13,
                  outline: 'none',
                  backdropFilter: 'blur(10px) saturate(1.3)',
                  WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                }}
              />
              <PrimaryButton
                accentRgb={pillar.accentRGB}
                secondaryRgb={pillar.secondaryRGB}
                icon={<OutlineIcon name="forward" color={`rgba(${pillar.accentRGB},0.95)`} size={12} />}
                onClick={() => setDraft('')}
              >
                Send
              </PrimaryButton>
            </div>
          </div>
        </HeroFrame>
      </div>
    </div>
  )
}

function ThreadRow({ thread, active, onClick }: { thread: Thread; active: boolean; onClick: () => void }) {
  const pillar = PILLARS.roster
  const topicAccent =
    thread.topic === 'team'     ? PALETTE.brassRGB :
    thread.topic === 'parent'   ? PALETTE.cyanRGB  :
    thread.topic === 'staff'    ? PALETTE.emeraldRGB :
    PALETTE.violetRGB
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '10px 12px',
        borderRadius: 12,
        background: active
          ? `linear-gradient(145deg, rgba(${pillar.accentRGB},0.16), rgba(${pillar.secondaryRGB},0.04))`
          : 'rgba(255,255,255,0.02)',
        border: active ? `1px solid rgba(${pillar.accentRGB},0.40)` : '1px solid transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <IconPlinth accentRgb={topicAccent} size={36} withBrackets={false}>
        <OutlineIcon
          name={thread.topic === 'parent' ? 'roster' : thread.topic === 'staff' ? 'whistle' : 'chat'}
          color={`rgb(${topicAccent})`}
          size={16}
        />
      </IconPlinth>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {thread.title}
          </span>
          {thread.unread > 0 && (
            <span style={{
              padding: '2px 7px',
              borderRadius: 999,
              background: `rgba(${pillar.accentRGB},0.20)`,
              border: `1px solid rgba(${pillar.accentRGB},0.45)`,
              fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.16em',
              color: 'transparent',
            }}>
              <Shimmer accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB}>{String(thread.unread)}</Shimmer>
            </span>
          )}
        </div>
        <Kicker size={8} color={PALETTE.textMuted}>{thread.lastAt}</Kicker>
      </div>
    </button>
  )
}
