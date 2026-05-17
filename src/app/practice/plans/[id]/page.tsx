'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SecondaryButton from '@/components/ui/SecondaryButton'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { getPracticePlan } from '@/data/practice'

export default function PracticePlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const plan = useMemo(() => getPracticePlan(id), [id])
  const pillar = PILLARS.practice

  if (!plan) notFound()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 22, maxWidth: 1500 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
        <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
          <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <IconPlinth accentRgb={pillar.accentRGB} size={64}>
              <OutlineIcon name="clipboard" color={`rgb(${pillar.accentRGB})`} size={28} />
            </IconPlinth>
            <div style={{ flex: 1 }}>
              <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>
                <Link href="/practice/plans" style={{ color: 'inherit', textDecoration: 'none' }}>Practice</Link>
                {'  /  '}Plans
              </Kicker>
              <h1 style={{ fontFamily: FONT.display, fontSize: 32, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0' }}>
                {plan.title}
              </h1>
              <Kicker color={PALETTE.textMuted}>{plan.date} · Week {plan.week} · {plan.periods.length} periods</Kicker>
            </div>
            <SecondaryButton icon={<OutlineIcon name="share" color={PALETTE.textSub} size={12} />}>Share</SecondaryButton>
            <PrimaryButton
              accentRgb={pillar.accentRGB}
              secondaryRgb={pillar.secondaryRGB}
              icon={<OutlineIcon name="download" color={`rgba(${pillar.accentRGB},0.95)`} size={13} />}
            >
              Print Wristband
            </PrimaryButton>
          </div>
        </HeroFrame>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* Vertical brass divider */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 14,
              bottom: 14,
              width: 1,
              background: `linear-gradient(180deg, rgba(${pillar.accentRGB},0.0), rgba(${pillar.accentRGB},0.75) 12%, rgba(${pillar.accentRGB},0.75) 88%, rgba(${pillar.accentRGB},0.0))`,
              boxShadow: `0 0 12px rgba(${pillar.accentRGB},0.4)`,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {plan.periods.map((period, i) => (
              <div key={period.id} style={{ position: 'relative' }}>
                {/* Period dot */}
                <span
                  style={{
                    position: 'absolute',
                    left: -23,
                    top: 28,
                    width: 10, height: 10, borderRadius: '50%',
                    background: `rgb(${pillar.accentRGB})`,
                    boxShadow: `0 0 8px rgba(${pillar.accentRGB},0.7), 0 0 18px rgba(${pillar.accentRGB},0.4)`,
                  }}
                />
                <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
                  <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: 18, alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Kicker size={9} color={`rgba(${pillar.accentRGB},0.95)`}>{period.start} – {period.end}</Kicker>
                      <span style={{ fontFamily: FONT.label, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: PALETTE.text }}>
                        {period.label}
                      </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em' }}>
                        {period.drill}
                      </div>
                      <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub, marginTop: 4, lineHeight: 1.55 }}>
                        {period.description}
                      </div>
                      {period.emphasis && (
                        <div style={{ marginTop: 8 }}>
                          <Kicker size={9} color={`rgba(${PALETTE.emeraldRGB},0.95)`}>Emphasis · {period.emphasis}</Kicker>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconPlinth accentRgb={pillar.accentRGB} size={64}>
                        <span style={{ fontFamily: FONT.body, fontSize: 20, fontWeight: 700, color: `rgba(${pillar.accentRGB},0.95)` }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </IconPlinth>
                    </div>
                  </div>
                </HeroFrame>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right rail */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 1, background: `rgba(${pillar.accentRGB},0.7)`, boxShadow: `0 0 8px rgba(${pillar.accentRGB},0.5)` }} />
              <Kicker color={PALETTE.textSub}>Install Focus</Kicker>
            </div>
            {plan.installFocus.map((f) => (
              <div
                key={f}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${PALETTE.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: `rgb(${pillar.accentRGB})`, boxShadow: `0 0 6px rgba(${pillar.accentRGB},0.7)` }} />
                <span style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.text, fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </HeroFrame>

        <HeroFrame intensity="md" accentRgb={PALETTE.emeraldRGB} accentRgb2={pillar.accentRGB}>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Kicker color={PALETTE.textSub}>Total Time</Kicker>
            <span style={{ fontFamily: FONT.body, fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>
              <Shimmer accentRgb={PALETTE.emeraldRGB} secondaryRgb={pillar.accentRGB}>1:20</Shimmer>
            </span>
            <Kicker color={PALETTE.textMuted}>Tuesday Practice</Kicker>
          </div>
        </HeroFrame>
      </aside>
    </div>
  )
}
