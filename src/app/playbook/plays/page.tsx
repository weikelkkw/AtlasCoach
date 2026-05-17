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
import FilterPills from '@/components/ui/FilterPills'
import EmptyState from '@/components/ui/EmptyState'
import PlayCanvas from '@/components/playcanvas/PlayCanvas'
import { simulateAsPlay } from '@/lib/playSimulation'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { plays, defenses, getDefense, type Play } from '@/data/plays'
import type { Sport } from '@/data/routes'

const SPORTS: (Sport | 'all')[] = ['all', 'football', 'basketball', 'soccer', 'hockey', 'baseball', 'lacrosse']
const FORMATIONS = ['all', 'Spread Right', 'Trips Right', 'I-Form', 'Horns', 'Spread', '4-3-3', 'Low Cycle', 'First & Third', '2-1-3']
const SITUATIONS = ['all', 'open', 'short', 'long', 'redzone', '2min']
const STATUSES = ['all', 'installed', 'teaching', 'planned']
const TAGS = ['all', 'pass', 'run', 'screen', 'rpo', 'play-action', 'quick-game', 'set', 'cycle', 'press', 'crease']

const SPORT_ICON: Record<Sport, string> = {
  football: 'football', basketball: 'basketball', soccer: 'soccer',
  hockey: 'hockey', baseball: 'baseball', lacrosse: 'lacrosse',
}

export default function PlaysPage() {
  const pillar = PILLARS.playbook
  const [sport, setSport] = useState<string>('all')
  const [formation, setFormation] = useState('all')
  const [situation, setSituation] = useState('all')
  const [status, setStatus] = useState('all')
  const [tag, setTag] = useState('all')

  const filtered = useMemo(() => {
    return plays.filter((p) => {
      if (sport !== 'all' && (p.sport ?? 'football') !== sport) return false
      if (formation !== 'all' && p.formation !== formation) return false
      if (situation !== 'all' && p.situation !== situation) return false
      if (status !== 'all' && p.installStatus !== status) return false
      if (tag !== 'all' && !p.tags.includes(tag)) return false
      return true
    })
  }, [sport, formation, situation, status, tag])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400 }}>
      {/* Header */}
      <HeroFrame intensity="lg" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <IconPlinth accentRgb={pillar.accentRGB} size={64}>
            <OutlineIcon name="play-diagram" color={`rgb(${pillar.accentRGB})`} size={28} />
          </IconPlinth>
          <div style={{ flex: 1 }}>
            <Kicker color={`rgba(${pillar.accentRGB},0.85)`}>Pillar · Playbook</Kicker>
            <h1 style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 500, color: PALETTE.text, letterSpacing: '-0.01em', margin: '4px 0 0' }}>
              Plays <span style={{ color: PALETTE.textMuted, fontStyle: 'italic' }}>{`/ ${plays.length}`}</span>
            </h1>
            <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 13, color: PALETTE.textSub }}>
              Design, animate, organize, install.
            </div>
          </div>
          <Link href="/playbook/defenses" style={{ textDecoration: 'none' }}>
            <PrimaryButton
              accentRgb={PALETTE.violetRGB}
              secondaryRgb={pillar.accentRGB}
              icon={<OutlineIcon name="depth" color={`rgba(${PALETTE.violetRGB},0.95)`} size={13} />}
            >
              Defense Library
            </PrimaryButton>
          </Link>
          <PrimaryButton
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
            icon={<OutlineIcon name="plus" color={`rgba(${pillar.accentRGB},0.95)`} size={13} />}
          >
            New Play
          </PrimaryButton>
        </div>
      </HeroFrame>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FilterRow label="Sport"     options={SPORTS as string[]} value={sport} onChange={setSport} accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} />
        <FilterRow label="Formation" options={FORMATIONS} value={formation} onChange={setFormation} accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} />
        <FilterRow label="Situation" options={SITUATIONS} value={situation} onChange={setSituation} accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} />
        <FilterRow label="Tag" options={TAGS} value={tag} onChange={setTag} accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} />
        <FilterRow label="Install" options={STATUSES} value={status} onChange={setStatus} accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} />
      </div>

      <SectionHeader accentRgb={pillar.accentRGB} trailing={<Kicker color={PALETTE.textMuted}>{filtered.length} shown</Kicker>}>
        Play Library
      </SectionHeader>

      {filtered.length === 0 ? (
        <EmptyState
          icon="play-diagram"
          kicker="No plays match"
          title="Try widening the filters"
          body="Clear a filter pill above or switch sports. Your full library has plays across football, basketball, soccer, hockey, baseball, and lacrosse."
          accent={pillar.accentRGB}
          secondary={pillar.secondaryRGB}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((p) => (
            <PlayCard key={p.id} play={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterRow({
  label, options, value, onChange, accentRgb, secondaryRgb,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; accentRgb: string; secondaryRgb: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 90, flexShrink: 0 }}>
        <Kicker color={PALETTE.textMuted}>{label}</Kicker>
      </div>
      <FilterPills
        accentRgb={accentRgb}
        secondaryRgb={secondaryRgb}
        value={value}
        onChange={onChange}
        options={options.map((o) => ({ value: o, label: o === 'all' ? 'All' : o }))}
      />
    </div>
  )
}

function PlayCard({ play }: { play: Play }) {
  const pillar = PILLARS.playbook
  const rawDefense = getDefense(play.defaultDefenseId) ?? defenses[0]
  const { play: simPlay, defense: simDefense } = simulateAsPlay(play, rawDefense)
  const sport = (play.sport ?? 'football') as Sport
  return (
    <Link href={`/playbook/plays/${play.id}`} style={{ textDecoration: 'none' }}>
      <HeroFrame intensity="sm" accentRgb={pillar.accentRGB} accentRgb2={pillar.secondaryRGB}>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', position: 'relative' }}>
          <PlayCanvas
            play={simPlay}
            defense={simDefense}
            t={0.0}
            width={290}
            height={150}
            showLabels={false}
            compact
            accentRgb={pillar.accentRGB}
            secondaryRgb={pillar.secondaryRGB}
          />
          {/* Sport badge */}
          <div style={{
            position: 'absolute', top: 22, right: 22,
            padding: '4px 9px', borderRadius: 999,
            background: 'rgba(5,5,12,0.65)',
            border: `1px solid rgba(${pillar.accentRGB},0.40)`,
            backdropFilter: 'blur(10px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
            display: 'flex', alignItems: 'center', gap: 6,
            zIndex: 8,
          }}>
            <OutlineIcon name={SPORT_ICON[sport]} color={`rgba(${pillar.accentRGB},0.95)`} size={11} />
            <span style={{
              fontFamily: FONT.label, fontSize: 8, fontWeight: 700,
              letterSpacing: '0.20em', textTransform: 'uppercase',
              color: `rgba(${pillar.accentRGB},0.95)`,
            }}>{sport}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700, color: PALETTE.text, letterSpacing: '-0.01em' }}>
              {play.name}
            </div>
            <Kicker size={9} color={PALETTE.textMuted}>
              {play.formation} · {play.personnel} · {play.installStatus}
            </Kicker>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <MiniStat label="Runs" value={String(play.stats.runs)} accentRgb={pillar.accentRGB} secondaryRgb={pillar.secondaryRGB} />
            <MiniStat label="Eff" value={`${play.stats.efficiency}%`} accentRgb={pillar.accentRGB} secondaryRgb={PALETTE.emeraldRGB} />
            <MiniStat label="Last" value={play.stats.lastUsed.replace('Week ', 'W')} accentRgb={pillar.accentRGB} secondaryRgb={PALETTE.cyanRGB} />
          </div>
        </div>
      </HeroFrame>
    </Link>
  )
}

function MiniStat({ label, value, accentRgb, secondaryRgb }: { label: string; value: string; accentRgb: string; secondaryRgb: string }) {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${PALETTE.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0,
    }}>
      <Kicker size={8} color={PALETTE.textMuted}>{label}</Kicker>
      <span style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <Shimmer accentRgb={accentRgb} secondaryRgb={secondaryRgb}>{value}</Shimmer>
      </span>
    </div>
  )
}
