export interface WristbandTile {
  code: string         // 'A1', 'B3', single letter, or short alpha
  playId: string
  playName: string
  formation: string
  tags: string[]
}

export const wristbandPlays: WristbandTile[] = [
  { code: 'A1', playId: 'spread-y-cross',  playName: 'Y-Cross',         formation: 'Spread R',  tags: ['pass', '1st-10'] },
  { code: 'A2', playId: 'trips-stick',     playName: 'Stick',           formation: 'Trips R',   tags: ['pass', '3rd-short'] },
  { code: 'A3', playId: 'iform-iso',       playName: 'Iso',             formation: 'I-Form',    tags: ['run', 'goal-line'] },
  { code: 'A4', playId: 'spread-rpo',      playName: 'Slant RPO',       formation: 'Spread R',  tags: ['rpo'] },
  { code: 'B1', playId: 'trips-screen',    playName: 'Bubble Screen',   formation: 'Trips R',   tags: ['screen'] },
  { code: 'B2', playId: 'iform-pa-cross',  playName: 'PA Cross',        formation: 'I-Form',    tags: ['play-action'] },
  { code: 'B3', playId: 'spread-y-cross',  playName: 'Y-Cross Switch',  formation: 'Spread R',  tags: ['pass', '2-min'] },
  { code: 'B4', playId: 'trips-stick',     playName: 'Stick Nod',       formation: 'Trips R',   tags: ['pass'] },
  { code: 'C1', playId: 'iform-iso',       playName: 'Iso Bounce',      formation: 'I-Form',    tags: ['run'] },
  { code: 'C2', playId: 'spread-rpo',      playName: 'Glance RPO',      formation: 'Spread R',  tags: ['rpo'] },
  { code: 'C3', playId: 'trips-screen',    playName: 'Tunnel Screen',   formation: 'Trips R',   tags: ['screen'] },
  { code: 'C4', playId: 'iform-pa-cross',  playName: 'PA Wheel',        formation: 'I-Form',    tags: ['play-action'] },
  { code: 'D1', playId: 'spread-y-cross',  playName: 'Y-Cross Hot',     formation: 'Spread R',  tags: ['hot'] },
  { code: 'D2', playId: 'trips-stick',     playName: 'Stick Settle',    formation: 'Trips R',   tags: ['pass'] },
  { code: 'D3', playId: 'iform-iso',       playName: 'Iso Lead',        formation: 'I-Form',    tags: ['run'] },
  { code: 'D4', playId: 'spread-rpo',      playName: 'Bubble RPO',      formation: 'Spread R',  tags: ['rpo'] },
  { code: 'E1', playId: 'trips-screen',    playName: 'WR Screen',       formation: 'Trips R',   tags: ['screen'] },
  { code: 'E2', playId: 'iform-pa-cross',  playName: 'PA Boot',         formation: 'I-Form',    tags: ['play-action'] },
  { code: 'E3', playId: 'spread-y-cross',  playName: 'Y-Cross Smash',   formation: 'Spread R',  tags: ['pass'] },
  { code: 'E4', playId: 'trips-stick',     playName: 'Stick Choice',    formation: 'Trips R',   tags: ['pass'] },
  { code: 'F1', playId: 'iform-iso',       playName: 'Iso Power',       formation: 'I-Form',    tags: ['run'] },
  { code: 'F2', playId: 'spread-rpo',      playName: 'Now RPO',         formation: 'Spread R',  tags: ['rpo'] },
  { code: 'F3', playId: 'trips-screen',    playName: 'Jet Screen',      formation: 'Trips R',   tags: ['screen'] },
  { code: 'F4', playId: 'iform-pa-cross',  playName: 'PA Switch',       formation: 'I-Form',    tags: ['play-action'] },
]
