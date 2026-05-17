export interface FilmTag {
  id: string
  atSec: number
  player: string
  play: string
  result: 'gain' | 'loss' | 'td' | 'incomplete' | 'penalty' | 'sack'
  yards?: number
  note: string
  coach: string
}

export interface FilmClip {
  id: string
  title: string
  opponent: string
  week: number
  durationSec: number
  thumbnail: string
  unit: 'offense' | 'defense' | 'special'
  tags: FilmTag[]
}

export const clips: FilmClip[] = [
  {
    id: 'wk7-off-full',
    title: 'Coral Harbor · Offense (Full)',
    opponent: 'Coral Harbor',
    week: 7,
    durationSec: 4280,
    thumbnail: 'spread-y-cross',
    unit: 'offense',
    tags: [
      { id: 't-1', atSec: 132,  player: 'Andre Sutton',   play: 'Y-Cross',      result: 'gain',       yards: 14, note: 'Beat the Mike on the seam — perfect timing.',   coach: 'Marcus Halloway' },
      { id: 't-2', atSec: 248,  player: 'Tyrell Mason',   play: 'Iso Right',    result: 'gain',       yards: 8,  note: 'Excellent cutback off the LG combo.',             coach: 'Kenneth Weikel' },
      { id: 't-3', atSec: 421,  player: 'Jaylen Brooks',  play: 'Spread RPO',   result: 'gain',       yards: 6,  note: 'Read was crisp — gave the box correctly.',        coach: 'Theo Castellanos' },
      { id: 't-4', atSec: 612,  player: 'Bryce Carter',   play: 'PA Cross',     result: 'incomplete',            note: 'Late hands — could’ve dragged a yard further.',   coach: 'Marcus Halloway' },
      { id: 't-5', atSec: 894,  player: 'Andre Sutton',   play: 'Bubble Screen',result: 'gain',       yards: 12, note: 'Block by the trips slot was the play.',           coach: 'Sam Whitfield' },
      { id: 't-6', atSec: 1124, player: 'Hudson Greer',   play: 'Iso',          result: 'loss',       yards: 2,  note: 'Missed the lead block on the WLB.',                coach: 'Kenneth Weikel' },
      { id: 't-7', atSec: 1842, player: 'Marcus Bell',    play: 'Y-Cross',      result: 'td',         yards: 38, note: 'Trail technique — exploit the Cover 3 hole.',     coach: 'Marcus Halloway' },
    ],
  },
  {
    id: 'wk7-def-full',
    title: 'Coral Harbor · Defense (Full)',
    opponent: 'Coral Harbor',
    week: 7,
    durationSec: 3960,
    thumbnail: 'cover-2',
    unit: 'defense',
    tags: [
      { id: 't-1', atSec: 184, player: 'Dominic Reyes', play: 'Cover 3 Buzz', result: 'sack',         yards: -7, note: 'Mike blitz beat the RB chip.',          coach: 'Devon Pierce' },
      { id: 't-2', atSec: 522, player: 'Isaiah Faulk',  play: 'Tampa 2',      result: 'loss',         yards: -3, note: 'Power penetrate — finished the play.', coach: 'Devon Pierce' },
      { id: 't-3', atSec: 988, player: 'Jordan Knight', play: '0 Blitz',      result: 'incomplete',              note: 'Tight coverage — receiver double-moved.', coach: 'Curtis Bellamy' },
    ],
  },
  {
    id: 'practice-tue',
    title: 'Practice · Tue Install',
    opponent: '—',
    week: 8,
    durationSec: 5400,
    thumbnail: 'practice',
    unit: 'offense',
    tags: [
      { id: 't-1', atSec: 312, player: 'Jaylen Brooks', play: 'Y-Cross install', result: 'gain', yards: 12, note: 'Live skel rep — perfect read.', coach: 'Marcus Halloway' },
    ],
  },
  {
    id: 'st-wk7',
    title: 'Coral Harbor · Special Teams',
    opponent: 'Coral Harbor',
    week: 7,
    durationSec: 1620,
    thumbnail: 'kickoff',
    unit: 'special',
    tags: [],
  },
]

export function getClip(id: string) {
  return clips.find((c) => c.id === id)
}

export function formatSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
