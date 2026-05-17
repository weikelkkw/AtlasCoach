export type Position =
  | 'QB' | 'RB' | 'WR' | 'TE' | 'OL'
  | 'DL' | 'LB' | 'CB' | 'S'
  | 'K' | 'P' | 'LS'

export type PlayerStatus = 'active' | 'injured' | 'academic' | 'limited'

export interface Player {
  id: string
  name: string
  jersey: number
  position: Position
  classYear: 'Fr' | 'So' | 'Jr' | 'Sr'
  status: PlayerStatus
  height: string
  weight: number
  fortyTime: number
  snaps: number
  grade: number  // 0-100 weekly grade
  depth: number  // 1 = starter
}

export const roster: Player[] = [
  // QB room
  { id: 'p-01', name: 'Jaylen Brooks',   jersey: 7,  position: 'QB', classYear: 'Sr', status: 'active',   height: "6'2",  weight: 198, fortyTime: 4.62, snaps: 421, grade: 92, depth: 1 },
  { id: 'p-02', name: 'Cole Whitaker',   jersey: 12, position: 'QB', classYear: 'So', status: 'active',   height: "6'1",  weight: 185, fortyTime: 4.71, snaps: 38,  grade: 78, depth: 2 },

  // RB room
  { id: 'p-03', name: 'Tyrell Mason',    jersey: 22, position: 'RB', classYear: 'Sr', status: 'active',   height: "5'10", weight: 205, fortyTime: 4.48, snaps: 312, grade: 89, depth: 1 },
  { id: 'p-04', name: 'Hudson Greer',    jersey: 28, position: 'RB', classYear: 'Jr', status: 'active',   height: "5'11", weight: 198, fortyTime: 4.52, snaps: 156, grade: 84, depth: 2 },
  { id: 'p-05', name: 'Roman Pace',      jersey: 34, position: 'RB', classYear: 'Fr', status: 'limited',  height: "5'9",  weight: 178, fortyTime: 4.55, snaps: 22,  grade: 71, depth: 3 },

  // WR room
  { id: 'p-06', name: 'Andre Sutton',    jersey: 1,  position: 'WR', classYear: 'Sr', status: 'active',   height: "6'1",  weight: 185, fortyTime: 4.38, snaps: 388, grade: 94, depth: 1 },
  { id: 'p-07', name: 'Marcus Bell',     jersey: 4,  position: 'WR', classYear: 'Jr', status: 'active',   height: "5'11", weight: 178, fortyTime: 4.42, snaps: 341, grade: 88, depth: 1 },
  { id: 'p-08', name: 'Xavier Stone',    jersey: 11, position: 'WR', classYear: 'Jr', status: 'active',   height: "6'3",  weight: 198, fortyTime: 4.55, snaps: 296, grade: 86, depth: 1 },
  { id: 'p-09', name: 'Caleb Rhodes',    jersey: 18, position: 'WR', classYear: 'So', status: 'active',   height: "5'10", weight: 172, fortyTime: 4.46, snaps: 188, grade: 81, depth: 2 },
  { id: 'p-10', name: 'Quincy Locke',    jersey: 81, position: 'WR', classYear: 'Sr', status: 'injured',  height: "6'0",  weight: 182, fortyTime: 4.49, snaps: 124, grade: 75, depth: 2 },

  // TE room
  { id: 'p-11', name: 'Bryce Carter',    jersey: 85, position: 'TE', classYear: 'Sr', status: 'active',   height: "6'4",  weight: 235, fortyTime: 4.76, snaps: 322, grade: 87, depth: 1 },
  { id: 'p-12', name: 'Sebastian Park',  jersey: 88, position: 'TE', classYear: 'Jr', status: 'active',   height: "6'3",  weight: 228, fortyTime: 4.82, snaps: 142, grade: 79, depth: 2 },

  // OL
  { id: 'p-13', name: 'Kingston Ford',   jersey: 76, position: 'OL', classYear: 'Sr', status: 'active',   height: "6'5",  weight: 305, fortyTime: 5.21, snaps: 421, grade: 91, depth: 1 },
  { id: 'p-14', name: 'Beckett Howe',    jersey: 72, position: 'OL', classYear: 'Sr', status: 'active',   height: "6'3",  weight: 295, fortyTime: 5.30, snaps: 421, grade: 87, depth: 1 },
  { id: 'p-15', name: 'Easton Cole',     jersey: 55, position: 'OL', classYear: 'Jr', status: 'active',   height: "6'2",  weight: 285, fortyTime: 5.32, snaps: 421, grade: 85, depth: 1 },
  { id: 'p-16', name: 'Marshall Quinn',  jersey: 65, position: 'OL', classYear: 'Jr', status: 'active',   height: "6'4",  weight: 312, fortyTime: 5.44, snaps: 421, grade: 88, depth: 1 },
  { id: 'p-17', name: 'Tobias Levin',    jersey: 79, position: 'OL', classYear: 'Sr', status: 'active',   height: "6'6",  weight: 318, fortyTime: 5.41, snaps: 421, grade: 90, depth: 1 },
  { id: 'p-18', name: 'Donovan Pratt',   jersey: 68, position: 'OL', classYear: 'So', status: 'active',   height: "6'3",  weight: 288, fortyTime: 5.55, snaps: 64,  grade: 76, depth: 2 },
  { id: 'p-19', name: 'Solomon Reed',    jersey: 71, position: 'OL', classYear: 'Fr', status: 'academic', height: "6'4",  weight: 302, fortyTime: 5.62, snaps: 0,   grade: 70, depth: 3 },

  // DL
  { id: 'p-20', name: 'Isaiah Faulk',    jersey: 99, position: 'DL', classYear: 'Sr', status: 'active',   height: "6'4",  weight: 268, fortyTime: 4.78, snaps: 388, grade: 93, depth: 1 },
  { id: 'p-21', name: 'Reggie Brennan',  jersey: 92, position: 'DL', classYear: 'Sr', status: 'active',   height: "6'3",  weight: 285, fortyTime: 4.92, snaps: 354, grade: 89, depth: 1 },
  { id: 'p-22', name: 'Asher Lane',      jersey: 56, position: 'DL', classYear: 'Jr', status: 'active',   height: "6'2",  weight: 252, fortyTime: 4.71, snaps: 312, grade: 85, depth: 1 },
  { id: 'p-23', name: 'Diego Salinas',   jersey: 90, position: 'DL', classYear: 'So', status: 'active',   height: "6'1",  weight: 248, fortyTime: 4.85, snaps: 188, grade: 82, depth: 2 },

  // LB
  { id: 'p-24', name: 'Dominic Reyes',   jersey: 44, position: 'LB', classYear: 'Sr', status: 'active',   height: "6'2",  weight: 232, fortyTime: 4.55, snaps: 401, grade: 95, depth: 1 },
  { id: 'p-25', name: 'Trey Holloway',   jersey: 51, position: 'LB', classYear: 'Jr', status: 'active',   height: "6'1",  weight: 225, fortyTime: 4.62, snaps: 366, grade: 88, depth: 1 },
  { id: 'p-26', name: 'Maddox Hayes',    jersey: 48, position: 'LB', classYear: 'Sr', status: 'active',   height: "6'0",  weight: 218, fortyTime: 4.58, snaps: 322, grade: 86, depth: 1 },
  { id: 'p-27', name: 'Zane Patterson',  jersey: 35, position: 'LB', classYear: 'Jr', status: 'active',   height: "6'1",  weight: 215, fortyTime: 4.71, snaps: 182, grade: 80, depth: 2 },

  // CB
  { id: 'p-28', name: 'Jordan Knight',   jersey: 24, position: 'CB', classYear: 'Sr', status: 'active',   height: "5'11", weight: 185, fortyTime: 4.41, snaps: 388, grade: 91, depth: 1 },
  { id: 'p-29', name: 'Cam Adler',       jersey: 21, position: 'CB', classYear: 'Jr', status: 'active',   height: "6'0",  weight: 182, fortyTime: 4.45, snaps: 366, grade: 87, depth: 1 },
  { id: 'p-30', name: 'Eli Vaughn',      jersey: 26, position: 'CB', classYear: 'So', status: 'active',   height: "5'10", weight: 175, fortyTime: 4.48, snaps: 156, grade: 79, depth: 2 },

  // S
  { id: 'p-31', name: 'Trey Holloway II',jersey: 8,  position: 'S',  classYear: 'Sr', status: 'active',   height: "6'2",  weight: 205, fortyTime: 4.52, snaps: 401, grade: 92, depth: 1 },
  { id: 'p-32', name: 'Sam Whitfield',   jersey: 32, position: 'S',  classYear: 'Jr', status: 'active',   height: "6'0",  weight: 198, fortyTime: 4.55, snaps: 388, grade: 88, depth: 1 },

  // ST
  { id: 'p-33', name: 'Curtis Bellamy',  jersey: 19, position: 'K',  classYear: 'Sr', status: 'active',   height: "5'11", weight: 178, fortyTime: 4.92, snaps: 64,  grade: 90, depth: 1 },
  { id: 'p-34', name: 'Greg Northrop',   jersey: 38, position: 'P',  classYear: 'Jr', status: 'active',   height: "6'2",  weight: 192, fortyTime: 4.85, snaps: 42,  grade: 85, depth: 1 },
]

export const POSITION_LABEL: Record<Position, string> = {
  QB: 'Quarterback',
  RB: 'Running Back',
  WR: 'Wide Receiver',
  TE: 'Tight End',
  OL: 'Offensive Line',
  DL: 'Defensive Line',
  LB: 'Linebacker',
  CB: 'Cornerback',
  S:  'Safety',
  K:  'Kicker',
  P:  'Punter',
  LS: 'Long Snapper',
}

export const POSITION_SIDE: Record<Position, 'offense' | 'defense' | 'st'> = {
  QB: 'offense', RB: 'offense', WR: 'offense', TE: 'offense', OL: 'offense',
  DL: 'defense', LB: 'defense', CB: 'defense', S:  'defense',
  K:  'st', P:  'st', LS: 'st',
}
