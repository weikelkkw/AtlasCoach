// playSimulation.ts — turns a Play + Defense into rendered movement.
//
// Why this exists: in the raw data, some players (esp. OL, defenders)
// have minimal or generic waypoints. The simulator enhances every player
// with realistic motion based on:
//   - their position (OL pass-pro, QB drops, RB release/run, WR route, etc.)
//   - the play's intent (run, pass, screen, RPO, play-action)
//   - the defense's scheme family (Cover 2, 3, 4, man, blitz)
//   - sport (football for now; other sports pass through unchanged)
//
// Output paths are still in field-normalized coordinates so PlayCanvas
// renders them through the same pipeline.

import type { DefensiveAlignment, Play, PlayerPath } from '@/data/plays'

type Intent = 'run' | 'pass' | 'screen' | 'rpo' | 'play-action' | 'qb-keeper'

const LOS = 0.30
const clamp = (v: number) => Math.max(0.02, Math.min(0.98, v))

// ── Intent detection ─────────────────────────────────────────────────────

function detectIntent(play: Play): Intent {
  const tags = new Set(play.tags.map((t) => t.toLowerCase()))
  if (tags.has('screen')) return 'screen'
  if (tags.has('rpo')) return 'rpo'
  if (tags.has('play-action') || tags.has('pa')) return 'play-action'
  if (tags.has('run') || tags.has('inside-zone') || tags.has('goal-line')) return 'run'
  // Default: pass concept
  return 'pass'
}

// Find the ball-carrier endpoint — used by run-play defender pursuit.
// We treat the offensive player with the longest forward trajectory whose
// action is 'run' as the runner; fallback to anyone marked 'run'.
function ballTarget(play: Play): { x: number; y: number } {
  const runners = play.offense.filter((p) => p.action === 'run')
  if (runners.length > 0) {
    const r = runners[0]
    const last = r.waypoints[r.waypoints.length - 1] ?? r.start
    return { x: last.x, y: last.y }
  }
  // Pass / no run defined — settle near the QB's post-snap location
  const qb = play.offense.find((p) => p.position === 'QB')
  if (qb) {
    const last = qb.waypoints[qb.waypoints.length - 1] ?? qb.start
    return { x: last.x, y: last.y }
  }
  return { x: 0.50, y: 0.28 }
}

// ── Offense enhancement ─────────────────────────────────────────────────

function enhanceOffensivePlayer(p: PlayerPath, play: Play, intent: Intent): PlayerPath {
  // Trust route runners as-is — they're typically the headline of the play
  if (p.action === 'route' && p.waypoints.length > 0) return p

  const pos = p.position
  const start = p.start

  // ── Offensive Line ──────────────────────────────────────────────────
  if (pos === 'OL') {
    if (intent === 'run') {
      // Drive block — push forward 4-6%, lateral toward play side based on x
      const lateral = (start.x - 0.5) * 0.04
      return {
        ...p,
        action: 'block',
        waypoints: [
          { x: clamp(start.x + lateral * 0.5), y: clamp(start.y + 0.06), t: 0.45 },
          { x: clamp(start.x + lateral),       y: clamp(start.y + 0.10), t: 1 },
        ],
      }
    }
    // Pass pro — kick step back, anchor
    const kickback = -0.03
    const lateral = (start.x - 0.5) * 0.012
    return {
      ...p,
      action: 'block',
      waypoints: [
        { x: clamp(start.x - lateral), y: clamp(start.y + 0.02), t: 0.30 },
        { x: clamp(start.x - lateral), y: clamp(start.y + kickback), t: 1 },
      ],
    }
  }

  // ── Quarterback ─────────────────────────────────────────────────────
  if (pos === 'QB') {
    if (intent === 'run' || intent === 'rpo') {
      // Quick mesh / hand-off — ride the back briefly
      return {
        ...p,
        action: 'pass',
        waypoints: [
          { x: start.x, y: clamp(start.y - 0.04), t: 0.30 },
          { x: clamp(start.x - 0.02), y: clamp(start.y - 0.04), t: 1 },
        ],
      }
    }
    if (intent === 'play-action' || intent === 'screen') {
      // Fake & boot or settle
      return {
        ...p,
        action: 'pass',
        waypoints: [
          { x: start.x, y: clamp(start.y - 0.04), t: 0.25 },
          { x: clamp(start.x + 0.06), y: clamp(start.y - 0.06), t: 1 },
        ],
      }
    }
    // Standard 5-step drop
    return {
      ...p,
      action: 'pass',
      waypoints: [
        { x: start.x, y: clamp(start.y - 0.04), t: 0.45 },
        { x: clamp(start.x + 0.01), y: clamp(start.y - 0.06), t: 1 },
      ],
    }
  }

  // ── Running Back ────────────────────────────────────────────────────
  if (pos === 'RB') {
    // Existing run carries — trust them
    if (p.action === 'run' && p.waypoints.length > 0) return p
    if (intent === 'run' || intent === 'rpo') {
      // Iso/sweep — bend the path slightly based on x position bias
      const targetX = start.x > 0.5 ? clamp(start.x + 0.16) : clamp(start.x - 0.16)
      const targetY = clamp(start.y + 0.32)
      return {
        ...p,
        action: 'run',
        waypoints: [
          { x: clamp(start.x + (targetX - start.x) * 0.4), y: clamp(start.y + 0.10), t: 0.35 },
          { x: targetX, y: targetY, t: 1 },
        ],
      }
    }
    if (intent === 'screen') {
      // Settle behind the wall, then catch and follow
      return {
        ...p,
        action: 'route',
        waypoints: [
          { x: clamp(start.x + 0.04), y: clamp(start.y - 0.04), t: 0.40 },
          { x: clamp(start.x + 0.18), y: clamp(start.y + 0.02), t: 1 },
        ],
      }
    }
    // Pass — kick out to chip then check release
    if (p.action === 'block') {
      return {
        ...p,
        waypoints: [
          { x: clamp(start.x + 0.04), y: clamp(start.y + 0.10), t: 0.45 },
          { x: clamp(start.x + 0.08), y: clamp(start.y + 0.12), t: 1 },
        ],
      }
    }
    return {
      ...p,
      action: 'route',
      waypoints: [
        { x: clamp(start.x + 0.04), y: clamp(start.y + 0.08), t: 0.45 },
        { x: clamp(start.x + 0.16), y: clamp(start.y + 0.04), t: 1 },
      ],
    }
  }

  // ── Tight End ───────────────────────────────────────────────────────
  if (pos === 'TE') {
    if (intent === 'run' || intent === 'rpo') {
      // Y-block on the edge defender
      return {
        ...p,
        action: 'block',
        waypoints: [
          { x: clamp(start.x + (start.x > 0.5 ? 0.04 : -0.04)), y: clamp(start.y + 0.08), t: 1 },
        ],
      }
    }
    // Pass — short cross-style by default if no explicit route
    return {
      ...p,
      action: 'route',
      waypoints: [
        { x: clamp(start.x + 0.02), y: clamp(start.y + 0.16), t: 0.50 },
        { x: clamp(start.x - 0.20), y: clamp(start.y + 0.22), t: 1 },
      ],
    }
  }

  // ── WR fallback — short hitch if undefined ──────────────────────────
  if (pos === 'WR') {
    return {
      ...p,
      action: 'route',
      waypoints: [
        { x: start.x, y: clamp(start.y + 0.16), t: 0.55 },
        { x: clamp(start.x + 0.02), y: clamp(start.y + 0.14), t: 1 },
      ],
    }
  }

  return p
}

// ── Defender enhancement ────────────────────────────────────────────────

function defenseFamily(defense: DefensiveAlignment): string {
  // Allow family to be set, otherwise infer from the id
  if (defense.family === 'coverage' || defense.family === 'pressure' || defense.family === 'front') {
    return inferShell(defense)
  }
  return inferShell(defense)
}

// Infer the coverage shell from the defense id — coarse but effective.
function inferShell(defense: DefensiveAlignment): string {
  const id = defense.id.toLowerCase()
  if (id.includes('cover-0')) return 'cover-0'
  if (id.includes('cover-1-robber')) return 'cover-1-robber'
  if (id.includes('cover-1')) return 'cover-1'
  if (id.includes('cover-2-man')) return 'cover-2-man'
  if (id.includes('cover-2') || id === 'tampa-2') return 'cover-2'
  if (id.includes('cover-3') || id === 'cover-3-buzz') return 'cover-3'
  if (id.includes('cover-4') || id.includes('quarters')) return 'cover-4'
  if (id.includes('cover-6')) return 'cover-6'
  if (id.includes('tampa')) return 'cover-2'
  if (id.includes('blitz') || id.includes('pressure') || id.includes('double-a') || id === 'man-blitz') return 'blitz'
  return 'cover-3'
}

function enhanceDefender(d: PlayerPath, shell: string, play: Play, intent: Intent, target: { x: number; y: number }, idx: number): PlayerPath {
  const pos = d.position
  const start = d.start
  const onRun = intent === 'run' || intent === 'rpo'

  // ── Defensive Line ──────────────────────────────────────────────────
  if (pos === 'DL') {
    if (onRun) {
      // Get-off + work to ball
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (target.x - start.x) * 0.20), y: clamp(start.y - 0.05), t: 0.40 },
          { x: clamp(start.x + (target.x - start.x) * 0.45), y: clamp(start.y - 0.10), t: 1 },
        ],
      }
    }
    // Rush the passer — push hard upfield
    return {
      ...d,
      waypoints: [
        { x: clamp(start.x + (0.50 - start.x) * 0.15), y: clamp(start.y - 0.04), t: 0.40 },
        { x: clamp(start.x + (0.50 - start.x) * 0.35), y: clamp(start.y - 0.10), t: 1 },
      ],
    }
  }

  // ── Linebackers ─────────────────────────────────────────────────────
  if (pos === 'LB') {
    if (onRun) {
      // Read + downhill to the gap that fits this defender
      const aim = { x: clamp(start.x + (target.x - start.x) * 0.55), y: clamp(start.y - 0.10) }
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (aim.x - start.x) * 0.4), y: clamp(start.y - 0.04), t: 0.35 },
          { x: aim.x, y: aim.y, t: 1 },
        ],
      }
    }
    // Pass-game LB drops by shell
    if (shell === 'cover-0' || shell === 'cover-1' || shell === 'cover-1-robber' || shell === 'cover-2-man') {
      // Man / spy / wall — short drop, mirror QB
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (start.x < 0.5 ? -0.02 : 0.02)), y: clamp(start.y + 0.08), t: 1 },
        ],
      }
    }
    if (shell === 'blitz') {
      // Blitzing LBs already may have aggressive paths — bump them upfield
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (0.50 - start.x) * 0.20), y: clamp(start.y - 0.08), t: 0.40 },
          { x: clamp(start.x + (0.50 - start.x) * 0.45), y: clamp(start.y - 0.18), t: 1 },
        ],
      }
    }
    // Zone hook drop — open, gain depth
    const lateralBias = start.x < 0.4 ? -0.04 : start.x > 0.6 ? 0.04 : 0
    return {
      ...d,
      waypoints: [
        { x: clamp(start.x + lateralBias * 0.5), y: clamp(start.y + 0.08), t: 0.55 },
        { x: clamp(start.x + lateralBias),       y: clamp(start.y + 0.16), t: 1 },
      ],
    }
  }

  // ── Cornerback ──────────────────────────────────────────────────────
  if (pos === 'CB') {
    if (shell === 'cover-0' || shell === 'cover-1' || shell === 'cover-1-robber' || shell === 'cover-2-man') {
      // Press / man — mirror the closest WR's path
      const target = nearestReceiver(start, play)
      if (target) {
        const last = target.waypoints[target.waypoints.length - 1] ?? target.start
        return {
          ...d,
          waypoints: [
            { x: clamp(start.x + (last.x - start.x) * 0.4), y: clamp(start.y + 0.16), t: 0.45 },
            { x: clamp(last.x + (start.x < 0.5 ? 0.02 : -0.02)), y: clamp(last.y - 0.04), t: 1 },
          ],
        }
      }
      return {
        ...d,
        waypoints: [{ x: start.x, y: clamp(start.y + 0.20), t: 1 }],
      }
    }
    if (shell === 'cover-2' || shell === 'cover-6' && start.x < 0.5) {
      // Flat zone — sink into flat after jam
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (start.x < 0.5 ? 0.02 : -0.02)), y: clamp(start.y + 0.06), t: 0.40 },
          { x: clamp(start.x + (start.x < 0.5 ? 0.03 : -0.03)), y: clamp(start.y + 0.18), t: 1 },
        ],
      }
    }
    // Cover 3 / 4 / 6 field corner — deep responsibility
    return {
      ...d,
      waypoints: [
        { x: clamp(start.x + (start.x < 0.5 ? 0.02 : -0.02)), y: clamp(start.y + 0.18), t: 0.40 },
        { x: start.x, y: clamp(start.y + 0.48), t: 1 },
      ],
    }
  }

  // ── Safeties ────────────────────────────────────────────────────────
  if (pos === 'S') {
    if (onRun) {
      // Fly up to the alley
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (target.x - start.x) * 0.30), y: clamp(start.y - 0.04), t: 0.45 },
          { x: clamp(start.x + (target.x - start.x) * 0.65), y: clamp(start.y - 0.20), t: 1 },
        ],
      }
    }
    if (shell === 'cover-0') {
      // Match underneath
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (start.x < 0.5 ? -0.04 : 0.04)), y: clamp(start.y - 0.08), t: 1 },
        ],
      }
    }
    if (shell === 'cover-1' || shell === 'cover-1-robber') {
      // FS plays the middle of the field deep; SS may robber/man
      if (idx % 2 === 0) {
        return {
          ...d,
          waypoints: [{ x: 0.50, y: clamp(start.y + 0.26), t: 1 }],
        }
      }
      return {
        ...d,
        waypoints: [{ x: clamp(start.x + (start.x < 0.5 ? 0.04 : -0.04)), y: clamp(start.y + 0.04), t: 1 }],
      }
    }
    if (shell === 'cover-2' || shell === 'cover-2-man') {
      // Two-deep splits — open to your side and bail
      const side = start.x < 0.5 ? 0.26 : 0.74
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (side - start.x) * 0.5), y: clamp(start.y + 0.10), t: 0.45 },
          { x: side, y: clamp(start.y + 0.28), t: 1 },
        ],
      }
    }
    if (shell === 'cover-3') {
      // FS to deep middle; SS to curl/buzz or sky
      if (idx % 2 === 0) {
        return {
          ...d,
          waypoints: [{ x: 0.50, y: clamp(start.y + 0.24), t: 1 }],
        }
      }
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (start.x < 0.5 ? 0.04 : -0.04)), y: clamp(start.y - 0.04), t: 0.45 },
          { x: clamp(start.x + (start.x < 0.5 ? 0.06 : -0.06)), y: clamp(start.y - 0.10), t: 1 },
        ],
      }
    }
    if (shell === 'cover-4') {
      // Quarters split — read #2, bail or fit
      const side = start.x < 0.5 ? 0.28 : 0.72
      return {
        ...d,
        waypoints: [
          { x: clamp(start.x + (side - start.x) * 0.3), y: clamp(start.y + 0.06), t: 0.40 },
          { x: side, y: clamp(start.y + 0.22), t: 1 },
        ],
      }
    }
    // Blitz — one S rotates down, one stays middle
    return {
      ...d,
      waypoints: [
        { x: clamp(start.x), y: clamp(start.y + 0.20), t: 1 },
      ],
    }
  }

  return d
}

function nearestReceiver(from: { x: number; y: number }, play: Play): PlayerPath | null {
  const receivers = play.offense.filter((p) =>
    p.side === 'offense' && p.position !== 'OL' && p.position !== 'QB' && p.action !== 'block'
  )
  if (receivers.length === 0) return null
  let best: PlayerPath = receivers[0]
  let bestDist = Infinity
  for (const r of receivers) {
    const dx = r.start.x - from.x
    const dy = r.start.y - from.y
    const dist = dx * dx + dy * dy
    if (dist < bestDist) {
      bestDist = dist
      best = r
    }
  }
  return best
}

// ── Public API ──────────────────────────────────────────────────────────

export function simulatePlay(play: Play, defense: DefensiveAlignment): {
  offense: PlayerPath[]
  defense: DefensiveAlignment
} {
  // Only enhance football for now — other sports keep their existing data.
  if ((play.sport ?? 'football') !== 'football') {
    return { offense: play.offense, defense }
  }

  const intent = detectIntent(play)
  const ball = ballTarget(play)
  const shell = defenseFamily(defense)

  const offense = play.offense.map((p) => enhanceOffensivePlayer(p, play, intent))
  const enhancedDefense: DefensiveAlignment = {
    ...defense,
    players: defense.players.map((d, i) => enhanceDefender(d, shell, play, intent, ball, i)),
  }

  return { offense, defense: enhancedDefense }
}

// Convenience: produce a Play-shaped object with the enhanced offense.
export function simulateAsPlay(play: Play, defense: DefensiveAlignment): { play: Play; defense: DefensiveAlignment } {
  const { offense, defense: enhDef } = simulatePlay(play, defense)
  return {
    play: { ...play, offense },
    defense: enhDef,
  }
}
