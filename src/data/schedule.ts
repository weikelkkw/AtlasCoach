export interface Game {
  id: string
  week: number
  opponent: string
  date: string         // ISO
  home: boolean
  status: 'upcoming' | 'played'
  result?: { us: number; them: number }
}

export const schedule: Game[] = [
  { id: 'wk1', week: 1, opponent: 'Cypress Harbor',     date: '2026-08-29T19:00:00', home: true,  status: 'played',   result: { us: 38, them: 14 } },
  { id: 'wk2', week: 2, opponent: 'Lighthouse Bay',     date: '2026-09-05T19:00:00', home: false, status: 'played',   result: { us: 24, them: 17 } },
  { id: 'wk3', week: 3, opponent: 'Pelican Crest',      date: '2026-09-12T19:00:00', home: true,  status: 'played',   result: { us: 45, them: 21 } },
  { id: 'wk4', week: 4, opponent: 'Marina Heights',     date: '2026-09-19T19:00:00', home: false, status: 'played',   result: { us: 17, them: 24 } },
  { id: 'wk5', week: 5, opponent: 'Saltwater Academy',  date: '2026-09-26T19:00:00', home: true,  status: 'played',   result: { us: 31, them: 10 } },
  { id: 'wk6', week: 6, opponent: 'Tradewinds Prep',    date: '2026-10-03T19:00:00', home: false, status: 'played',   result: { us: 28, them: 21 } },
  { id: 'wk7', week: 7, opponent: 'Coral Harbor',       date: '2026-10-10T19:00:00', home: true,  status: 'played',   result: { us: 42, them: 14 } },
  { id: 'wk8', week: 8, opponent: 'Bayshore Catholic',  date: '2026-10-17T19:00:00', home: true,  status: 'upcoming' },
  { id: 'wk9', week: 9, opponent: 'Northshore Prep',    date: '2026-10-24T19:00:00', home: false, status: 'upcoming' },
  { id: 'wk10', week: 10, opponent: 'Atlantic Crossing', date: '2026-10-31T19:00:00', home: true, status: 'upcoming' },
]
