// Route templates — pre-built movement patterns players can be assigned.
// dx / dy are deltas from the player's start (normalized field units 0-1).
// t is when (along the play timeline) the player reaches that waypoint.

export type Sport = 'football' | 'basketball' | 'soccer' | 'hockey' | 'baseball' | 'lacrosse'

export interface RouteTemplate {
  id: string
  label: string
  short: string
  sport: Sport
  category: 'route' | 'block' | 'run' | 'cut' | 'screen' | 'movement'
  description: string
  waypoints: { dx: number; dy: number; t: number }[]
}

// ── Football ─────────────────────────────────────────────────────────────
//
// Field is portrait: y=0 backfield, y=1 endzone. We define right-side variants;
// the designer flips dx for left-of-center players.

const FOOTBALL_ROUTES: RouteTemplate[] = [
  { id: 'go',       label: 'Go',       short: 'GO',  sport: 'football', category: 'route', description: 'Sprint vertical. Take the top off.',
    waypoints: [{ dx: 0,    dy: 0.55, t: 1 }] },
  { id: 'slant',    label: 'Slant',    short: 'SL',  sport: 'football', category: 'route', description: '3 steps vertical, break inside on 45°.',
    waypoints: [{ dx: 0, dy: 0.06, t: 0.30 }, { dx: -0.18, dy: 0.20, t: 1 }] },
  { id: 'fade',     label: 'Fade',     short: 'FD',  sport: 'football', category: 'route', description: 'Vertical release, drift to the sideline at 18.',
    waypoints: [{ dx: 0, dy: 0.18, t: 0.45 }, { dx: 0.10, dy: 0.50, t: 1 }] },
  { id: 'post',     label: 'Post',     short: 'PO',  sport: 'football', category: 'route', description: '12 yards vertical, break to the inside post.',
    waypoints: [{ dx: 0, dy: 0.28, t: 0.55 }, { dx: -0.20, dy: 0.55, t: 1 }] },
  { id: 'corner',   label: 'Corner',   short: 'CN',  sport: 'football', category: 'route', description: '10 yards vertical, break to the corner at 45°.',
    waypoints: [{ dx: 0, dy: 0.24, t: 0.55 }, { dx: 0.18, dy: 0.50, t: 1 }] },
  { id: 'hitch',    label: 'Hitch',    short: 'HT',  sport: 'football', category: 'route', description: '5 yards, snap back to the QB.',
    waypoints: [{ dx: 0, dy: 0.16, t: 0.55 }, { dx: 0.02, dy: 0.13, t: 1 }] },
  { id: 'comeback', label: 'Comeback', short: 'CB',  sport: 'football', category: 'route', description: '15 yards vertical, comeback to 12.',
    waypoints: [{ dx: 0, dy: 0.40, t: 0.65 }, { dx: 0.04, dy: 0.32, t: 1 }] },
  { id: 'dig',      label: 'Dig',      short: 'DG',  sport: 'football', category: 'route', description: '12 yards vertical, square to the inside.',
    waypoints: [{ dx: 0, dy: 0.30, t: 0.60 }, { dx: -0.30, dy: 0.30, t: 1 }] },
  { id: 'out',      label: 'Out',      short: 'OT',  sport: 'football', category: 'route', description: '10 yards vertical, sharp out to the sideline.',
    waypoints: [{ dx: 0, dy: 0.24, t: 0.60 }, { dx: 0.22, dy: 0.24, t: 1 }] },
  { id: 'in',       label: 'In',       short: 'IN',  sport: 'football', category: 'route', description: '6 yards vertical, square inside.',
    waypoints: [{ dx: 0, dy: 0.16, t: 0.55 }, { dx: -0.20, dy: 0.16, t: 1 }] },
  { id: 'curl',     label: 'Curl',     short: 'CR',  sport: 'football', category: 'route', description: '10 yards, curl back to the inside.',
    waypoints: [{ dx: 0, dy: 0.22, t: 0.55 }, { dx: -0.05, dy: 0.18, t: 1 }] },
  { id: 'wheel',    label: 'Wheel',    short: 'WH',  sport: 'football', category: 'route', description: 'Out of the backfield, wheel up the sideline.',
    waypoints: [{ dx: 0.18, dy: 0.08, t: 0.30 }, { dx: 0.22, dy: 0.50, t: 1 }] },
  { id: 'drag',     label: 'Drag',     short: 'DR',  sport: 'football', category: 'route', description: 'Shallow cross under the linebackers.',
    waypoints: [{ dx: -0.20, dy: 0.06, t: 0.45 }, { dx: -0.45, dy: 0.10, t: 1 }] },
  { id: 'screen',   label: 'Screen',   short: 'SC',  sport: 'football', category: 'screen', description: 'Settle, catch behind the LOS, follow the wall.',
    waypoints: [{ dx: 0.04, dy: -0.06, t: 0.40 }, { dx: 0.18, dy: -0.02, t: 1 }] },
  { id: 'flat',     label: 'Flat',     short: 'FL',  sport: 'football', category: 'route', description: 'Quick to the flat, just past the LOS.',
    waypoints: [{ dx: 0.18, dy: 0.04, t: 1 }] },
  { id: 'block-pass', label: 'Pass Block', short: 'PB', sport: 'football', category: 'block', description: 'Hold up the rusher — kick-step and anchor.',
    waypoints: [{ dx: 0, dy: 0.04, t: 1 }] },
  { id: 'block-run',  label: 'Run Block',  short: 'RB', sport: 'football', category: 'block', description: 'Drive block — fire off and finish.',
    waypoints: [{ dx: 0, dy: 0.10, t: 1 }] },
  { id: 'pull',     label: 'Pull',     short: 'PL',  sport: 'football', category: 'block', description: 'Skip-pull and lead through the hole.',
    waypoints: [{ dx: 0.12, dy: 0.02, t: 0.40 }, { dx: 0.18, dy: 0.12, t: 1 }] },
  { id: 'iso-run',  label: 'Iso Run',  short: 'IS',  sport: 'football', category: 'run', description: 'Tracks behind the lead block.',
    waypoints: [{ dx: 0, dy: 0.14, t: 0.40 }, { dx: 0.06, dy: 0.30, t: 1 }] },
  { id: 'sweep',    label: 'Sweep',    short: 'SW',  sport: 'football', category: 'run', description: 'Bounce outside the tackle, get the edge.',
    waypoints: [{ dx: 0.16, dy: 0.06, t: 0.40 }, { dx: 0.24, dy: 0.22, t: 1 }] },
  { id: 'qb-pass',  label: 'QB Pass',  short: 'QP',  sport: 'football', category: 'movement', description: 'Drop back and deliver from the pocket.',
    waypoints: [{ dx: 0, dy: -0.05, t: 0.40 }, { dx: 0, dy: -0.04, t: 1 }] },
  { id: 'qb-rollout-r', label: 'Rollout Right', short: 'RR', sport: 'football', category: 'movement', description: 'Boot right, throw on the run.',
    waypoints: [{ dx: 0.18, dy: -0.02, t: 1 }] },
  { id: 'qb-rollout-l', label: 'Rollout Left',  short: 'RL', sport: 'football', category: 'movement', description: 'Boot left, throw on the run.',
    waypoints: [{ dx: -0.18, dy: -0.02, t: 1 }] },
]

// ── Basketball ───────────────────────────────────────────────────────────

const BASKETBALL_ROUTES: RouteTemplate[] = [
  { id: 'b-cut',         label: 'Cut to Basket',  short: 'CT',  sport: 'basketball', category: 'cut', description: 'Aggressive cut to the rim.',
    waypoints: [{ dx: 0, dy: 0.30, t: 1 }] },
  { id: 'b-v-cut',       label: 'V-Cut',          short: 'VC',  sport: 'basketball', category: 'cut', description: 'Set up defender, snap back.',
    waypoints: [{ dx: -0.04, dy: 0.06, t: 0.4 }, { dx: 0.06, dy: -0.04, t: 1 }] },
  { id: 'b-curl',        label: 'Curl off Screen',short: 'CL',  sport: 'basketball', category: 'cut', description: 'Tight curl off the down screen.',
    waypoints: [{ dx: 0.04, dy: 0.12, t: 0.5 }, { dx: -0.08, dy: 0.22, t: 1 }] },
  { id: 'b-flare',       label: 'Flare',          short: 'FL',  sport: 'basketball', category: 'cut', description: 'Flare to the corner off the screen.',
    waypoints: [{ dx: 0.18, dy: -0.04, t: 1 }] },
  { id: 'b-backdoor',    label: 'Backdoor',       short: 'BD',  sport: 'basketball', category: 'cut', description: 'Sell flare, slip backdoor.',
    waypoints: [{ dx: 0.06, dy: -0.04, t: 0.4 }, { dx: -0.14, dy: 0.22, t: 1 }] },
  { id: 'b-ucla',        label: 'UCLA Cut',       short: 'UC',  sport: 'basketball', category: 'cut', description: 'UCLA cut off the high post.',
    waypoints: [{ dx: 0.06, dy: 0.08, t: 0.4 }, { dx: 0, dy: 0.28, t: 1 }] },
  { id: 'b-screen-ball', label: 'Ball Screen',    short: 'BS',  sport: 'basketball', category: 'screen', description: 'Set ball screen at the top.',
    waypoints: [{ dx: 0, dy: -0.10, t: 0.6 }, { dx: 0.02, dy: -0.12, t: 1 }] },
  { id: 'b-screen-down', label: 'Down Screen',    short: 'DS',  sport: 'basketball', category: 'screen', description: 'Down screen on the wing.',
    waypoints: [{ dx: 0, dy: -0.14, t: 1 }] },
  { id: 'b-pop',         label: 'Pick & Pop',     short: 'PP',  sport: 'basketball', category: 'movement', description: 'Set screen, pop to the arc.',
    waypoints: [{ dx: -0.02, dy: -0.06, t: 0.5 }, { dx: -0.10, dy: -0.10, t: 1 }] },
  { id: 'b-roll',        label: 'Pick & Roll',    short: 'PR',  sport: 'basketball', category: 'movement', description: 'Set screen, roll hard.',
    waypoints: [{ dx: -0.02, dy: -0.06, t: 0.5 }, { dx: 0.04, dy: 0.20, t: 1 }] },
]

// ── Soccer ───────────────────────────────────────────────────────────────

const SOCCER_ROUTES: RouteTemplate[] = [
  { id: 's-forward',   label: 'Forward Run',  short: 'FR', sport: 'soccer', category: 'movement', description: 'Straight run between the lines.',
    waypoints: [{ dx: 0, dy: 0.25, t: 1 }] },
  { id: 's-diagonal',  label: 'Diagonal Run', short: 'DR', sport: 'soccer', category: 'movement', description: 'Diagonal run across the back four.',
    waypoints: [{ dx: 0.12, dy: 0.22, t: 1 }] },
  { id: 's-curved',    label: 'Curved Run',   short: 'CR', sport: 'soccer', category: 'movement', description: 'Curved run in behind the line.',
    waypoints: [{ dx: 0.06, dy: 0.10, t: 0.4 }, { dx: 0.14, dy: 0.28, t: 1 }] },
  { id: 's-overlap',   label: 'Overlap',      short: 'OL', sport: 'soccer', category: 'movement', description: 'Overlap the winger to the byline.',
    waypoints: [{ dx: 0.18, dy: 0.18, t: 1 }] },
  { id: 's-underlap',  label: 'Underlap',     short: 'UL', sport: 'soccer', category: 'movement', description: 'Inside run behind the inside-forward.',
    waypoints: [{ dx: -0.10, dy: 0.22, t: 1 }] },
  { id: 's-dropdeep',  label: 'Drop Deep',    short: 'DD', sport: 'soccer', category: 'movement', description: 'Drop deep to receive feet.',
    waypoints: [{ dx: 0, dy: -0.12, t: 1 }] },
  { id: 's-press',     label: 'Press Trigger', short: 'PT', sport: 'soccer', category: 'movement', description: 'Trigger pressure on the ball carrier.',
    waypoints: [{ dx: 0, dy: -0.18, t: 1 }] },
  { id: 's-checkout',  label: 'Check Out',    short: 'CO', sport: 'soccer', category: 'movement', description: 'Pull wide to stretch the back line.',
    waypoints: [{ dx: 0.16, dy: 0, t: 1 }] },
]

// ── Hockey ───────────────────────────────────────────────────────────────

const HOCKEY_ROUTES: RouteTemplate[] = [
  { id: 'h-cycle',     label: 'Cycle Low',    short: 'CY', sport: 'hockey', category: 'movement', description: 'Carry the puck low and cycle to the corner.',
    waypoints: [{ dx: 0.04, dy: 0.18, t: 0.4 }, { dx: -0.14, dy: 0.22, t: 1 }] },
  { id: 'h-dump',      label: 'Dump & Chase', short: 'DC', sport: 'hockey', category: 'movement', description: 'Dump in deep and race the D for puck recovery.',
    waypoints: [{ dx: 0, dy: 0.30, t: 1 }] },
  { id: 'h-net-drive', label: 'Net Drive',    short: 'ND', sport: 'hockey', category: 'movement', description: 'Drive hard to the front of the net for tip.',
    waypoints: [{ dx: 0.04, dy: 0.22, t: 1 }] },
  { id: 'h-cross',     label: 'Crossing',     short: 'CR', sport: 'hockey', category: 'cut', description: 'F1/F2 cross at the blue line to confuse coverage.',
    waypoints: [{ dx: 0.18, dy: 0.10, t: 1 }] },
  { id: 'h-d-pinch',   label: 'D Pinch',      short: 'DP', sport: 'hockey', category: 'movement', description: 'D pinches the wall to keep the play alive.',
    waypoints: [{ dx: -0.10, dy: 0.20, t: 1 }] },
  { id: 'h-screen',    label: 'Screen Goalie',short: 'SC', sport: 'hockey', category: 'screen', description: 'Set the screen on the goalie at the top of the crease.',
    waypoints: [{ dx: 0, dy: 0.18, t: 1 }] },
  { id: 'h-back',      label: 'Backcheck',    short: 'BC', sport: 'hockey', category: 'movement', description: 'High forward backchecks to support D on turnover.',
    waypoints: [{ dx: 0, dy: -0.30, t: 1 }] },
  { id: 'h-stretch',   label: 'Stretch Pass', short: 'ST', sport: 'hockey', category: 'movement', description: 'Stretch through the neutral zone for a long pass.',
    waypoints: [{ dx: 0, dy: 0.42, t: 1 }] },
]

// ── Baseball ─────────────────────────────────────────────────────────────

const BASEBALL_ROUTES: RouteTemplate[] = [
  { id: 'ba-steal',   label: 'Steal Second',  short: 'ST', sport: 'baseball', category: 'movement', description: 'Read pitcher, break on first move home.',
    waypoints: [{ dx: -0.24, dy: 0.24, t: 1 }] },
  { id: 'ba-bunt',    label: 'Sac Bunt',      short: 'BU', sport: 'baseball', category: 'movement', description: 'Square early, drop bunt down third-base line.',
    waypoints: [{ dx: -0.04, dy: 0.08, t: 1 }] },
  { id: 'ba-double',  label: 'Double-Steal',  short: 'DS', sport: 'baseball', category: 'movement', description: 'Runners on first and third — double-steal.',
    waypoints: [{ dx: 0.20, dy: 0.10, t: 1 }] },
  { id: 'ba-pickoff', label: 'Pickoff Move',  short: 'PO', sport: 'baseball', category: 'movement', description: 'Snap throw to first to hold runner.',
    waypoints: [{ dx: 0.18, dy: -0.04, t: 1 }] },
  { id: 'ba-cutoff',  label: 'Cutoff Throw',  short: 'CO', sport: 'baseball', category: 'movement', description: 'Outfielder cuts the throw at the relay man.',
    waypoints: [{ dx: 0, dy: -0.30, t: 1 }] },
  { id: 'ba-tag-up',  label: 'Tag & Score',   short: 'TU', sport: 'baseball', category: 'movement', description: 'Tag from third on fly ball, score on contact.',
    waypoints: [{ dx: 0.22, dy: -0.20, t: 1 }] },
]

// ── Lacrosse ─────────────────────────────────────────────────────────────

const LACROSSE_ROUTES: RouteTemplate[] = [
  { id: 'l-pick',    label: 'Pick & Roll',  short: 'PR', sport: 'lacrosse', category: 'screen', description: 'Set the pick, roll to the cage.',
    waypoints: [{ dx: 0.04, dy: 0.12, t: 0.5 }, { dx: -0.10, dy: 0.22, t: 1 }] },
  { id: 'l-dodge',   label: 'Dodge from X', short: 'DG', sport: 'lacrosse', category: 'movement', description: 'Dodge from behind the cage to GLE.',
    waypoints: [{ dx: 0.12, dy: 0.04, t: 0.5 }, { dx: 0.18, dy: -0.04, t: 1 }] },
  { id: 'l-crease',  label: 'Crease Cut',   short: 'CC', sport: 'lacrosse', category: 'cut', description: 'Crease attacker cuts to the doorstep.',
    waypoints: [{ dx: -0.06, dy: 0.10, t: 1 }] },
  { id: 'l-clear',   label: 'Clear · Outlet',short: 'CL', sport: 'lacrosse', category: 'movement', description: 'D-mid outlets the ball to start the clear.',
    waypoints: [{ dx: 0.10, dy: 0.30, t: 1 }] },
  { id: 'l-ride',    label: 'Ride Press',   short: 'RD', sport: 'lacrosse', category: 'movement', description: 'Press the clear, force a 10-second violation.',
    waypoints: [{ dx: 0, dy: -0.20, t: 1 }] },
  { id: 'l-skip',    label: 'Skip Pass',    short: 'SK', sport: 'lacrosse', category: 'movement', description: 'Skip pass across the top to reverse the slide.',
    waypoints: [{ dx: -0.30, dy: 0, t: 1 }] },
  { id: 'l-roll',    label: 'Roll Back',    short: 'RB', sport: 'lacrosse', category: 'cut', description: 'Roll back on the long-pole — change directions.',
    waypoints: [{ dx: -0.10, dy: 0, t: 0.5 }, { dx: 0.12, dy: 0.08, t: 1 }] },
]

const ALL_ROUTES: RouteTemplate[] = [
  ...FOOTBALL_ROUTES,
  ...BASKETBALL_ROUTES,
  ...SOCCER_ROUTES,
  ...HOCKEY_ROUTES,
  ...BASEBALL_ROUTES,
  ...LACROSSE_ROUTES,
]

export function routesFor(sport: Sport): RouteTemplate[] {
  return ALL_ROUTES.filter((r) => r.sport === sport)
}

export function routeById(id: string): RouteTemplate | undefined {
  return ALL_ROUTES.find((r) => r.id === id)
}

export function applyRouteTemplate(
  start: { x: number; y: number },
  tpl: RouteTemplate,
  options: { mirror?: boolean } = {},
): { x: number; y: number; t: number }[] {
  const m = options.mirror ? -1 : 1
  return tpl.waypoints.map((wp) => ({
    x: clamp01(start.x + wp.dx * m),
    y: clamp01(start.y + wp.dy),
    t: wp.t,
  }))
}

function clamp01(v: number): number {
  return Math.max(0.02, Math.min(0.98, v))
}
