export const team = {
  name: 'OceanAtlas Coastal Prep',
  short: 'Coastal Prep',
  mascot: 'Mariners',
  sport: 'Football' as const,
  season: '2026',
  record: { wins: 6, losses: 1 },
  nextGame: {
    opponent: 'Bayshore Catholic',
    when: 'Fri · 7:00 PM',
    where: 'HOME · Atlas Field',
    week: 8,
  },
  staff: [
    { id: 'k-weikel',   name: 'Kenneth Weikel',   role: 'Head Coach' },
    { id: 'm-halloway', name: 'Marcus Halloway',  role: 'Offensive Coordinator' },
    { id: 'd-pierce',   name: 'Devon Pierce',     role: 'Defensive Coordinator' },
    { id: 't-castel',   name: 'Theo Castellanos', role: 'QB Coach' },
    { id: 's-whitfield',name: 'Sam Whitfield',    role: 'Wide Receivers' },
    { id: 'g-northrop', name: 'Greg Northrop',    role: 'Offensive Line' },
    { id: 'c-bellamy',  name: 'Curtis Bellamy',   role: 'Defensive Backs' },
  ],
} as const
