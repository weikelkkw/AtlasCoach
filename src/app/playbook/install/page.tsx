'use client'

import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { plays } from '@/data/plays'

const WEEKS = Array.from({ length: 12 }).map((_, i) => i + 1)

function installFor(week: number, idx: number) {
  // Deterministic per (week, play) seed
  const seed = (week * 17 + idx * 13) % 100
  if (week <= 4) return seed % 5 === 0 ? 'planned' : 'installed'
  if (week <= 8) return seed < 30 ? 'teaching' : 'installed'
  return seed < 25 ? 'teaching' : seed < 60 ? 'installed' : 'planned'
}

export default function InstallPlanPage() {
  const pillar = PILLARS.playbook

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1500 }}>
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="calendar" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Playbook</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Install Plan
            </h1>
            <Kicker color={PALETTE.textMuted}>12-week season · {plays.length} plays</Kicker>
          </div>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={pillar.accentRGB}>Season Grid</SectionHeader>

      <HeroFrame intensity="md" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: 16, overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
            <thead>
              <tr>
                <th style={th(200)}><Kicker color={PALETTE.textMuted}>Play</Kicker></th>
                {WEEKS.map((w) => (
                  <th key={w} style={th(56)}>
                    <Kicker color={`rgba(${pillar.accentRGB},0.95)`}>W{w}</Kicker>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plays.map((p, idx) => (
                <tr key={p.id}>
                  <td style={td(true)}>
                    <div style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 700, color: PALETTE.text }}>{p.name}</div>
                    <Kicker size={8} color={PALETTE.textMuted}>{p.formation}</Kicker>
                  </td>
                  {WEEKS.map((w) => {
                    const s = installFor(w, idx)
                    return (
                      <td key={w} style={td()}>
                        <Cell status={s} accent={pillar.accentRGB} secondary={pillar.secondaryRGB} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HeroFrame>

      <SectionHeader accentRgb={pillar.accentRGB}>Legend</SectionHeader>
      <div style={{ display: 'flex', gap: 12, fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase' }}>
        <LegendDot color={pillar.accentRGB} label="Installed" />
        <LegendDot color={PALETTE.cyanRGB} label="Teaching" />
        <LegendDot color={PALETTE.violetRGB} label="Planned" />
      </div>
    </div>
  )
}

function th(w: number): React.CSSProperties {
  return { padding: '6px 8px', textAlign: 'left', borderBottom: `1px solid ${PALETTE.border}`, minWidth: w }
}
function td(label = false): React.CSSProperties {
  return {
    padding: label ? '10px 8px' : '6px',
    borderBottom: `1px solid ${PALETTE.divider}`,
    minWidth: label ? 200 : 56,
  }
}

function Cell({ status, accent, secondary }: { status: string; accent: string; secondary: string }) {
  const color = status === 'installed' ? accent : status === 'teaching' ? PALETTE.cyanRGB : PALETTE.violetRGB
  const filled = status === 'installed' ? 1 : status === 'teaching' ? 0.55 : 0.20
  return (
    <div style={{
      width: '100%', height: 22, borderRadius: 6,
      background: `linear-gradient(145deg, rgba(${color},${0.20 * filled + 0.06}), rgba(${color},${0.05 * filled + 0.02}))`,
      border: `1px solid rgba(${color},${0.20 + filled * 0.30})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: `rgb(${color})`,
        boxShadow: `0 0 ${6 * filled + 2}px rgba(${color},${0.5 + filled * 0.4})`,
        opacity: filled,
      }} />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: `rgb(${color})`, boxShadow: `0 0 6px rgba(${color},0.6)` }} />
      <span>{label}</span>
    </span>
  )
}
