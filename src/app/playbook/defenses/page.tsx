'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import FilterPills from '@/components/ui/FilterPills'
import EmptyState from '@/components/ui/EmptyState'
import DefensePreview from '@/components/playcanvas/DefensePreview'
import DefenseImportModal from '@/components/defenses/DefenseImportModal'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { defenses, type DefensiveAlignment } from '@/data/plays'
import { useCustomDefenses } from '@/lib/defenseStore'
import { useToast } from '@/components/ui/Toast'
import type { Sport } from '@/data/routes'

const SPORTS: (Sport | 'all')[] = ['all', 'football', 'basketball', 'soccer', 'hockey', 'baseball', 'lacrosse']
const FAMILIES = ['all', 'front', 'coverage', 'pressure', 'sub-package']

export default function DefensesPage() {
  const pillar = PILLARS.playbook
  const [sport, setSport] = useState<string>('all')
  const [family, setFamily] = useState<string>('all')
  const [importOpen, setImportOpen] = useState(false)
  const { custom, remove } = useCustomDefenses()
  const { push } = useToast()

  const all: DefensiveAlignment[] = useMemo(() => {
    // Custom first, seeded after — dedupe by id so a custom override wins
    const seen = new Set<string>()
    const out: DefensiveAlignment[] = []
    for (const d of [...custom, ...defenses]) {
      if (seen.has(d.id)) continue
      seen.add(d.id)
      out.push(d)
    }
    return out
  }, [custom])

  const filtered = useMemo(() => {
    return all.filter((d) => {
      if (sport !== 'all' && (d.sport ?? 'football') !== sport) return false
      if (family !== 'all' && (d.family ?? 'coverage') !== family) return false
      return true
    })
  }, [all, sport, family])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      <HeroFrame intensity="lg" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={PALETTE.violetRGB} size={64}>
            <OutlineIcon name="depth" color={`rgb(${PALETTE.violetRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${PALETTE.violetRGB},0.85)`}>Playbook · Defense Library</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Defenses <span style={{ color: PALETTE.textMuted, fontStyle: 'italic' }}>{`/ ${all.length}`}</span>
            </h1>
            <Kicker color={PALETTE.textMuted}>
              Fronts · coverages · pressures across {SPORTS.length - 1} sports
              {custom.length > 0 && <> · <span style={{ color: `rgba(${PALETTE.violetRGB},0.95)` }}>{custom.length} custom</span></>}
            </Kicker>
          </div>
          <SecondaryButton
            icon={<OutlineIcon name="download" color={PALETTE.textSub} size={12} />}
            onClick={() => {
              const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = 'atlas-coach-defenses.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Export All
          </SecondaryButton>
          <PrimaryButton
            accentRgb={PALETTE.violetRGB}
            secondaryRgb={PALETTE.brassRGB}
            icon={<OutlineIcon name="plus" color={`rgba(${PALETTE.violetRGB},0.95)`} size={13} />}
            onClick={() => setImportOpen(true)}
          >
            Import Defense
          </PrimaryButton>
        </div>
      </HeroFrame>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FilterRow label="Sport" options={SPORTS as string[]} value={sport} onChange={setSport} />
        <FilterRow label="Family" options={FAMILIES} value={family} onChange={setFamily} />
      </div>

      <SectionHeader accentRgb={PALETTE.violetRGB} trailing={<Kicker color={PALETTE.textMuted}>{filtered.length} shown</Kicker>}>
        Library
      </SectionHeader>

      {filtered.length === 0 ? (
        <EmptyState
          icon="depth"
          kicker="No defenses match"
          title="Widen the filter, or import a custom defense"
          body="Atlas ships with 22+ real schemes. Anything you import lands here too and becomes selectable in the play animator."
          accent={PALETTE.violetRGB}
          secondary={PALETTE.brassRGB}
          cta={
            <PrimaryButton
              accentRgb={PALETTE.violetRGB}
              secondaryRgb={PALETTE.brassRGB}
              icon={<OutlineIcon name="plus" color={`rgba(${PALETTE.violetRGB},0.95)`} size={12} />}
              onClick={() => setImportOpen(true)}
            >
              Import Defense
            </PrimaryButton>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((d) => (
            <DefenseCard
              key={d.id}
              defense={d}
              onDelete={d.custom ? () => {
                remove(d.id)
                push({ title: 'Defense removed', body: `${d.label} removed from your library.`, variant: 'info', icon: 'back' })
              } : undefined}
            />
          ))}
        </div>
      )}

      <DefenseImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}

function FilterRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 90, flexShrink: 0 }}>
        <Kicker color={PALETTE.textMuted}>{label}</Kicker>
      </div>
      <FilterPills
        accentRgb={PALETTE.violetRGB}
        secondaryRgb={PALETTE.brassRGB}
        value={value}
        onChange={onChange}
        options={options.map((o) => ({ value: o, label: o === 'all' ? 'All' : o }))}
      />
    </div>
  )
}

function DefenseCard({ defense: d, onDelete }: { defense: DefensiveAlignment; onDelete?: () => void }) {
  const family = d.family ?? 'coverage'
  const familyColor =
    family === 'pressure' ? PALETTE.redRGB :
    family === 'front'    ? PALETTE.brassRGB :
    family === 'sub-package' ? PALETTE.cyanRGB :
    PALETTE.violetRGB

  return (
    <Link href={`/playbook/defenses/${d.id}`} style={{ textDecoration: 'none' }}>
      <HeroFrame intensity="sm" accentRgb={PALETTE.violetRGB} accentRgb2={PALETTE.brassRGB}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', position: 'relative' }}>
          <DefensePreview defense={d} width={310} height={170} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 22, left: 22, display: 'flex', gap: 6, zIndex: 8 }}>
            <span style={{
              padding: '3px 9px', borderRadius: 999,
              background: 'rgba(5,5,12,0.65)',
              border: `1px solid rgba(${familyColor},0.40)`,
              backdropFilter: 'blur(10px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
              fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.20em',
              textTransform: 'uppercase', color: `rgba(${familyColor},0.95)`,
            }}>{family}</span>
            {d.custom && (
              <span style={{
                padding: '3px 9px', borderRadius: 999,
                background: 'rgba(5,5,12,0.65)',
                border: `1px solid rgba(${PALETTE.emeraldRGB},0.40)`,
                backdropFilter: 'blur(10px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.20em',
                textTransform: 'uppercase', color: `rgba(${PALETTE.emeraldRGB},0.95)`,
              }}>Custom</span>
            )}
          </div>

          <div>
            <div style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700, color: PALETTE.text, letterSpacing: '-0.01em' }}>
              {d.label}
            </div>
            <Kicker size={9} color={PALETTE.textMuted}>
              {(d.sport ?? 'football').toUpperCase()} {d.personnel ? `· ${d.personnel}` : ''}
            </Kicker>
          </div>

          <div style={{
            fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub, lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {d.description}
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete() }}
              style={{
                position: 'absolute', top: 22, right: 22, zIndex: 9,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(5,5,12,0.65)',
                border: `1px solid rgba(${PALETTE.redRGB},0.35)`,
                backdropFilter: 'blur(10px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                color: '#fca5a5', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </HeroFrame>
    </Link>
  )
}
