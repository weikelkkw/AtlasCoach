// Pravatar gives stable demo photos. Same name → same face across every menu.

const STAFF_AVATAR_MAP: Record<string, string> = {
  // Head coach + staff
  'Kenneth Weikel':     'https://i.pravatar.cc/200?img=12',
  'Marcus Halloway':    'https://i.pravatar.cc/200?img=15',
  'Devon Pierce':       'https://i.pravatar.cc/200?img=33',
  'Theo Castellanos':   'https://i.pravatar.cc/200?img=14',
  'Sam Whitfield':      'https://i.pravatar.cc/200?img=11',
  'Greg Northrop':      'https://i.pravatar.cc/200?img=8',
  'Curtis Bellamy':     'https://i.pravatar.cc/200?img=53',

  // Roster — sampled across pravatar IDs so faces feel distinct
  'Jaylen Brooks':      'https://i.pravatar.cc/200?img=58',
  'Tyrell Mason':       'https://i.pravatar.cc/200?img=60',
  'Andre Sutton':       'https://i.pravatar.cc/200?img=12',
  'Caleb Rhodes':       'https://i.pravatar.cc/200?img=68',
  'Marcus Bell':        'https://i.pravatar.cc/200?img=51',
  'Isaiah Faulk':       'https://i.pravatar.cc/200?img=59',
  'Dominic Reyes':      'https://i.pravatar.cc/200?img=13',
  'Trey Holloway':      'https://i.pravatar.cc/200?img=52',
  'Xavier Stone':       'https://i.pravatar.cc/200?img=64',
  'Jordan Knight':      'https://i.pravatar.cc/200?img=70',
  'Cole Whitaker':      'https://i.pravatar.cc/200?img=7',
  'Bryce Carter':       'https://i.pravatar.cc/200?img=4',
  'Eli Vaughn':         'https://i.pravatar.cc/200?img=2',
  'Cam Adler':          'https://i.pravatar.cc/200?img=69',
  'Zane Patterson':     'https://i.pravatar.cc/200?img=57',
  'Quincy Locke':       'https://i.pravatar.cc/200?img=55',
  'Maddox Hayes':       'https://i.pravatar.cc/200?img=9',
  'Reggie Brennan':     'https://i.pravatar.cc/200?img=54',
  'Sebastian Park':     'https://i.pravatar.cc/200?img=17',
  'Asher Lane':         'https://i.pravatar.cc/200?img=18',
  'Diego Salinas':      'https://i.pravatar.cc/200?img=22',
  'Hudson Greer':       'https://i.pravatar.cc/200?img=33',
  'Roman Pace':         'https://i.pravatar.cc/200?img=15',
  'Kingston Ford':      'https://i.pravatar.cc/200?img=68',
  'Beckett Howe':       'https://i.pravatar.cc/200?img=14',
  'Easton Cole':        'https://i.pravatar.cc/200?img=11',
  'Marshall Quinn':     'https://i.pravatar.cc/200?img=65',
  'Tobias Levin':       'https://i.pravatar.cc/200?img=66',
  'Solomon Reed':       'https://i.pravatar.cc/200?img=67',
  'Donovan Pratt':      'https://i.pravatar.cc/200?img=8',
}

export function staffAvatarFor(name: string | undefined | null): string | undefined {
  if (!name) return undefined
  const hit = STAFF_AVATAR_MAP[name.trim()]
  if (hit) return hit
  // Deterministic fallback so unknown names still get a stable face
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return `https://i.pravatar.cc/200?img=${(h % 70) + 1}`
}

export function monogramFor(name: string | undefined | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}
