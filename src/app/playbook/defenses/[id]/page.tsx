'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import ResponsiveStage from '@/components/playcanvas/ResponsiveStage'
import DefensePreview from '@/components/playcanvas/DefensePreview'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { defenses, plays, type DefensiveAlignment } from '@/data/plays'
import { useCustomDefenses } from '@/lib/defenseStore'
import { useToast } from '@/components/ui/Toast'

export default function DefenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { custom, remove } = useCustomDefenses()
  const { push } = useToast()

  const defense = useMemo<DefensiveAlignment | undefined>(() => {
    return custom.find((d) => d.id === id) ?? defenses.find((d) => d.id === id)
  }, [custom, id])

  if (!defense) notFound()

  const usedBy = plays.filter((p) => p.defaultDefenseId === defense.id)
  const family = defense.family ?? 'coverage'
  const familyColor =
    family === 'pressure' ? PALETTE.redRGB :
    family === 'front'    ? PALETTE.brassRGB :
    family === 'sub-package' ? PALETTE.cyanRGB :
    PALETTE.violetRGB

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1500 }}>
      {/* Hero */}
      <HeroFrame intensity="lg" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/playbook/defenses" style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 12px', borderRadius: 999,
                background: `rgba(${PALETTE.violetRGB},0.10)`,
                border: `1px solid rgba(${PALETTE.violetRGB},0.30)`,
                fontFamily: FONT.label, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: `rgba(${PALETTE.violetRGB},0.95)`,
              }}>
                <OutlineIcon name="back" color={`rgba(${PALETTE.violetRGB},0.95)`} size={11} />
                Defenses
              </span>
            </Link>
            <span style={{
              padding: '3px 10px', borderRadius: 999,
              background: `rgba(${familyColor},0.12)`,
              border: `1px solid rgba(${familyColor},0.35)`,
              fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: `rgba(${familyColor},0.95)`,
            }}>{family}</span>
            {defense.custom && (
              <span style={{
                padding: '3px 10px', borderRadius: 999,
                background: `rgba(${PALETTE.emeraldRGB},0.12)`,
                border: `1px solid rgba(${PALETTE.emeraldRGB},0.35)`,
                fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: `rgba(${PALETTE.emeraldRGB},0.95)`,
              }}>Custom</span>
            )}
            <span style={{ flex: 1 }} />
            {defense.custom && (
              <SecondaryButton
                icon={<OutlineIcon name="back" color="#fca5a5" size={12} />}
                onClick={() => {
                  remove(defense.id)
                  push({ title: 'Defense removed', body: `${defense.label} removed from your library.`, variant: 'info', icon: 'back' })
                  history.back()
                }}
              >
                Remove
              </SecondaryButton>
            )}
          </div>
          <div>
            <h1 style={{
              fontFamily: FONT.display, fontSize: 44, fontWeight: 500,
              color: PALETTE.text, letterSpacing: '-0.01em', margin: 0, lineHeight: 1.05,
            }}>
              {defense.label}
            </h1>
            <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 14, color: PALETTE.textSub, lineHeight: 1.55, maxWidth: 800 }}>
              {defense.description}
            </div>
          </div>
        </div>
      </HeroFrame>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
        {/* Canvas */}
        <HeroFrame intensity="lg" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
          <div style={{ padding: 18 }}>
            <ResponsiveStage aspectRatio={16 / 9} minHeight={320} maxHeight={620}>
              {(w, h) => (
                <DefensePreview defense={defense} width={w} height={h} compact={false} showLabels />
              )}
            </ResponsiveStage>
          </div>
        </HeroFrame>

        {/* Detail rail */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HeroFrame intensity="md" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <RailHeader accent={PALETTE.violetRGB}>Details</RailHeader>
              <DetailRow label="Sport" value={(defense.sport ?? 'football').toUpperCase()} accent={PALETTE.violetRGB} />
              <DetailRow label="Family" value={(defense.family ?? 'coverage').toUpperCase()} accent={familyColor} />
              {defense.personnel && <DetailRow label="Personnel" value={defense.personnel} accent={PALETTE.brassRGB} />}
              <DetailRow label="Players" value={String(defense.players.length)} accent={PALETTE.cyanRGB} />
            </div>
          </HeroFrame>

          {defense.bestVs && defense.bestVs.length > 0 && (
            <HeroFrame intensity="md" accentRgb={PALETTE.emeraldRGB} accentRgb2={PALETTE.violetRGB}>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RailHeader accent={PALETTE.emeraldRGB}>Best Against</RailHeader>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {defense.bestVs.map((v) => (
                    <span key={v} style={{
                      padding: '4px 10px', borderRadius: 999,
                      background: `rgba(${PALETTE.emeraldRGB},0.14)`,
                      border: `1px solid rgba(${PALETTE.emeraldRGB},0.35)`,
                      fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: `rgba(${PALETTE.emeraldRGB},0.95)`,
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            </HeroFrame>
          )}

          {defense.weakness && (
            <HeroFrame intensity="md" accentRgb={PALETTE.amberRGB} accentRgb2={PALETTE.brassRGB}>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <RailHeader accent={PALETTE.amberRGB}>Weakness</RailHeader>
                <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, lineHeight: 1.55 }}>
                  {defense.weakness}
                </div>
              </div>
            </HeroFrame>
          )}
        </aside>
      </div>

      {usedBy.length > 0 && (
        <>
          <SectionHeader accentRgb={PALETTE.brassRGB} trailing={<Kicker color={PALETTE.textMuted}>{usedBy.length} plays</Kicker>}>
            Plays Using This Defense
          </SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {usedBy.map((p) => (
              <Link key={p.id} href={`/playbook/plays/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${PALETTE.border}`,
                  cursor: 'pointer',
                }}>
                  <IconPlinth accentRgb={PILLARS.playbook.accentRGB} size={36} withBrackets={false}>
                    <OutlineIcon name="play-diagram" color={`rgb(${PILLARS.playbook.accentRGB})`} size={16} />
                  </IconPlinth>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text }}>{p.name}</div>
                    <Kicker size={9} color={PALETTE.textMuted}>{p.formation} · {p.personnel}</Kicker>
                  </div>
                  <span style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700 }}>
                    <Shimmer accentRgb={PILLARS.playbook.accentRGB} secondaryRgb={PALETTE.cyanRGB}>{`${p.stats.efficiency}%`}</Shimmer>
                  </span>
                  <OutlineIcon name="forward" color={PALETTE.textFaint} size={14} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
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

function DetailRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Kicker size={9} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <Shimmer accentRgb={accent} secondaryRgb={PALETTE.brassRGB}>{value}</Shimmer>
      </span>
    </div>
  )
}
