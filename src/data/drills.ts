export interface Drill {
  id: string
  name: string
  category: 'individual' | 'group' | 'team' | 'special'
  position: string
  durationMin: number
  emphasis: string
  description: string
}

export const drills: Drill[] = [
  { id: 'd-01', name: 'Mirror Drops 3/5/7',         category: 'individual', position: 'QB',     durationMin: 8,  emphasis: 'Footwork', description: 'QB takes proper drops vs. air with progression eyes.' },
  { id: 'd-02', name: 'Hot Reads vs. Pressure',     category: 'individual', position: 'QB',     durationMin: 10, emphasis: 'Decision', description: 'QB IDs the blitzer pre-snap, throws the hot in rhythm.' },
  { id: 'd-03', name: 'Stalk Block Vs Press',       category: 'individual', position: 'WR',     durationMin: 8,  emphasis: 'Hands', description: 'WR sustains the stalk block on a press CB.' },
  { id: 'd-04', name: 'Inside Zone Tracks',         category: 'group',      position: 'OL/RB',  durationMin: 12, emphasis: 'Vision', description: 'RB tracks the OL combo block, hits the cutback.' },
  { id: 'd-05', name: 'Pass Pro Sets — Half',       category: 'individual', position: 'OL',     durationMin: 10, emphasis: 'Anchor', description: 'OL kick-step vs hand shield, inside-half balance.' },
  { id: 'd-06', name: '7-on-7 Red Zone',            category: 'group',      position: 'Skill',  durationMin: 15, emphasis: 'Timing', description: 'Skel period from the 12 — convert and finish.' },
  { id: 'd-07', name: 'Tackle Circuit',             category: 'individual', position: 'DEF',    durationMin: 10, emphasis: 'Form', description: 'Angle, wrap, drive — three stations.' },
  { id: 'd-08', name: 'Pursuit Angles',             category: 'team',       position: 'DEF',    durationMin: 8,  emphasis: 'Effort', description: 'Whole defense runs to the ball.' },
  { id: 'd-09', name: 'Punt Coverage Lanes',        category: 'special',    position: 'ST',     durationMin: 10, emphasis: 'Lanes', description: 'Punt unit covers in lanes, breakdown form tackle.' },
  { id: 'd-10', name: 'Field Goal Snap-Hold-Kick',  category: 'special',    position: 'ST',     durationMin: 10, emphasis: 'Operation', description: 'Sub-1.3s operation on every snap.' },
  { id: 'd-11', name: '2-Minute Tempo Script',      category: 'team',       position: 'All',    durationMin: 12, emphasis: 'Communication', description: 'Live two-minute drill — clock, no-huddle.' },
  { id: 'd-12', name: 'Goal-Line Iso Inside',       category: 'group',      position: 'OL/RB',  durationMin: 8,  emphasis: 'Finish', description: 'Iso from the 3 — finish the block, find the crease.' },
]
