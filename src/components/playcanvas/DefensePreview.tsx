'use client'

// DefensePreview — renders a defensive alignment alone (no offense) on a
// mini football surface. Used by the defense library cards and detail page.

import FieldSurface from './FieldSurface'
import PlayerChip, { SharedChipDefs } from './PlayerChip'
import type { DefensiveAlignment } from '@/data/plays'
import { PALETTE } from '@/design/constants'

interface Props {
  defense: DefensiveAlignment
  width?: number
  height?: number
  showLabels?: boolean
  compact?: boolean
}

export default function DefensePreview({
  defense,
  width = 320,
  height = 180,
  showLabels = false,
  compact = true,
}: Props) {
  const sport = defense.sport ?? 'football'
  return (
    <FieldSurface
      sport={sport}
      width={width}
      height={height}
      accentRgb={PALETTE.violetRGB}
      secondaryRgb={PALETTE.brassRGB}
      compact={compact}
    >
      <SharedChipDefs />
      {defense.players.map((p) => (
        <PlayerChip
          key={p.id}
          cx={p.start.x * width}
          cy={(1 - p.start.y) * height}
          label={p.label}
          position={showLabels ? p.position : undefined}
          side="defense"
          size={compact ? 16 : 28}
          showPosition={showLabels && !compact}
        />
      ))}
    </FieldSurface>
  )
}
