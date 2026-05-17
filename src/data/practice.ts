export interface PracticePeriod {
  id: string
  start: string         // 0:00
  end: string           // 0:15
  label: string         // 'INDIVIDUAL', 'GROUP', 'TEAM'
  drill: string
  description: string
  group: string
  emphasis?: string
}

export interface PracticePlan {
  id: string
  date: string
  title: string
  week: number
  installFocus: string[]
  periods: PracticePeriod[]
}

export const practicePlans: PracticePlan[] = [
  {
    id: 'wk8-tue',
    date: '2026-10-14',
    title: 'Tuesday · Week 8 Install',
    week: 8,
    installFocus: ['Y-Cross variants', 'Bubble Screen vs Quarters', 'Goal-line Iso'],
    periods: [
      { id: 'p1', start: '0:00', end: '0:08', label: 'Pre-Practice', drill: 'Dynamic warm-up + mobility', description: 'Position-specific dynamic stretches.', group: 'All' },
      { id: 'p2', start: '0:08', end: '0:18', label: 'Individual', drill: 'QB footwork — 3, 5, 7 step', description: 'Mirror drops with progression eyes.', group: 'QB / WR', emphasis: 'Footwork clean' },
      { id: 'p3', start: '0:18', end: '0:28', label: 'Individual', drill: 'OL pass pro · sets vs hand shield', description: 'Inside half vs E/T alignments.', group: 'OL' },
      { id: 'p4', start: '0:28', end: '0:38', label: 'Group',      drill: 'Skel · Y-Cross install', description: 'Air → vs air defense → vs scout.', group: 'QB / WR / RB' },
      { id: 'p5', start: '0:38', end: '0:48', label: 'Group',      drill: 'Inside run · I-Form Iso', description: 'Inside-zone tracks vs 4-down look.', group: 'OL / RB / DL / LB' },
      { id: 'p6', start: '0:48', end: '1:03', label: 'Team',       drill: '1s offense vs scout · Cover 3 Buzz', description: '12-play script — Y-Cross, Stick, Bubble Screen, Iso.', group: 'All', emphasis: 'Tempo + communication' },
      { id: 'p7', start: '1:03', end: '1:13', label: 'Team',       drill: 'Red-zone period', description: 'From the 12 → in. 6 plays. Convert.', group: 'All' },
      { id: 'p8', start: '1:13', end: '1:20', label: 'Conditioning', drill: '6 × 60-yard tempos', description: 'On the whistle. Win the start, win the finish.', group: 'All' },
    ],
  },
]

export function getPracticePlan(id: string) {
  return practicePlans.find((p) => p.id === id)
}
