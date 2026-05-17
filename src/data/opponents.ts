export interface OpponentTendency {
  // For each personnel grouping + situation, top concept used
  personnel: string
  situation: string
  topConcept: string
  rate: number  // 0-100
}

export interface OpponentZone {
  x: number      // 0-1 normalized field x
  y: number      // 0-1 normalized field y (LOS = 0.30)
  intensity: number  // 0-1
  label: string
}

export interface OpponentPlay {
  id: string
  name: string
  formation: string
  rate: number   // % of snaps
  yardsPerPlay: number
}

export interface Opponent {
  id: string
  name: string
  short: string
  record: { w: number; l: number }
  nextGame?: string
  keyPlayers: { name: string; jersey: number; position: string }[]
  tendencies: OpponentTendency[]
  runHotZones: OpponentZone[]
  passHotZones: OpponentZone[]
  topPlays: OpponentPlay[]
}

export const opponents: Opponent[] = [
  {
    id: 'bayshore',
    name: 'Bayshore Catholic',
    short: 'Bayshore',
    record: { w: 5, l: 2 },
    nextGame: 'Fri · 7:00 PM',
    keyPlayers: [
      { name: 'Jake Marlowe',   jersey: 4,  position: 'QB' },
      { name: 'Anthony DeLuca', jersey: 22, position: 'RB' },
      { name: 'Miles Foster',   jersey: 88, position: 'WR' },
      { name: 'Cory Nguyen',    jersey: 51, position: 'MIKE' },
    ],
    tendencies: [
      { personnel: '11', situation: '1st-10',   topConcept: 'Inside Zone',        rate: 64 },
      { personnel: '11', situation: '2nd-med',  topConcept: 'Stick Concept',      rate: 42 },
      { personnel: '11', situation: '3rd-short',topConcept: 'QB Sneak',           rate: 71 },
      { personnel: '11', situation: '3rd-long', topConcept: 'Mesh',               rate: 55 },
      { personnel: '12', situation: '1st-10',   topConcept: 'PA Boot',            rate: 38 },
      { personnel: '12', situation: 'Red Zone', topConcept: 'Iso Right',          rate: 52 },
      { personnel: '21', situation: 'Goal-line',topConcept: 'Power O',            rate: 67 },
    ],
    runHotZones: [
      { x: 0.50, y: 0.42, intensity: 0.95, label: 'Inside Zone — A/B gap' },
      { x: 0.65, y: 0.46, intensity: 0.70, label: 'Power Off-Tackle Right' },
      { x: 0.20, y: 0.44, intensity: 0.42, label: 'Sweep Left' },
    ],
    passHotZones: [
      { x: 0.78, y: 0.55, intensity: 0.85, label: 'Stick to flat' },
      { x: 0.50, y: 0.65, intensity: 0.62, label: 'Mesh middle' },
      { x: 0.22, y: 0.62, intensity: 0.54, label: 'Backside dig' },
      { x: 0.86, y: 0.78, intensity: 0.46, label: 'Fade corner' },
    ],
    topPlays: [
      { id: 'b-1', name: 'Inside Zone',     formation: 'Spread R', rate: 28, yardsPerPlay: 4.8 },
      { id: 'b-2', name: 'Stick Concept',   formation: 'Trips R',  rate: 18, yardsPerPlay: 6.2 },
      { id: 'b-3', name: 'PA Boot Cross',   formation: 'I-Form',   rate: 12, yardsPerPlay: 8.1 },
      { id: 'b-4', name: 'Power O',         formation: '21 Pers',  rate: 11, yardsPerPlay: 3.4 },
      { id: 'b-5', name: 'Mesh',            formation: 'Spread R', rate: 9,  yardsPerPlay: 7.2 },
      { id: 'b-6', name: 'Sweep Left',      formation: 'Spread L', rate: 7,  yardsPerPlay: 5.5 },
      { id: 'b-7', name: 'Glance RPO',      formation: 'Trips R',  rate: 6,  yardsPerPlay: 4.9 },
      { id: 'b-8', name: 'Y-Cross',         formation: 'Spread R', rate: 4,  yardsPerPlay: 10.2 },
      { id: 'b-9', name: 'Sprint Out R',    formation: 'Spread R', rate: 3,  yardsPerPlay: 5.8 },
      { id: 'b-10',name: 'Counter Trey',    formation: '21 Pers',  rate: 2,  yardsPerPlay: 6.0 },
    ],
  },
  {
    id: 'northshore',
    name: 'Northshore Prep',
    short: 'Northshore',
    record: { w: 4, l: 3 },
    keyPlayers: [
      { name: 'Logan Reyes',   jersey: 7,  position: 'QB' },
      { name: 'Jaden Pope',    jersey: 5,  position: 'WR' },
      { name: 'Drew Halverson',jersey: 33, position: 'LB' },
    ],
    tendencies: [
      { personnel: '11', situation: '1st-10', topConcept: 'Y-Stick', rate: 48 },
    ],
    runHotZones: [{ x: 0.50, y: 0.45, intensity: 0.55, label: 'IZ' }],
    passHotZones: [{ x: 0.50, y: 0.62, intensity: 0.50, label: 'Slants' }],
    topPlays: [{ id: 'n-1', name: 'Y-Stick', formation: 'Trips R', rate: 22, yardsPerPlay: 5.4 }],
  },
  {
    id: 'atlantic',
    name: 'Atlantic Crossing',
    short: 'Atlantic',
    record: { w: 6, l: 1 },
    keyPlayers: [
      { name: 'Wes Hartwell', jersey: 1,  position: 'QB' },
      { name: 'Jordan Tan',   jersey: 32, position: 'RB' },
    ],
    tendencies: [{ personnel: '12', situation: '1st-10', topConcept: 'PA Boot', rate: 52 }],
    runHotZones: [{ x: 0.40, y: 0.42, intensity: 0.70, label: 'Counter' }],
    passHotZones: [{ x: 0.70, y: 0.55, intensity: 0.62, label: 'Boot flood' }],
    topPlays: [{ id: 'a-1', name: 'PA Boot', formation: '12 Pers', rate: 28, yardsPerPlay: 7.1 }],
  },
]

export function getOpponent(id: string) {
  return opponents.find((o) => o.id === id)
}
