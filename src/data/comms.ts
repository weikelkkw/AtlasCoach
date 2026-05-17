export interface Message {
  id: string
  from: string
  body: string
  at: string  // relative for demo
  reactions?: string[]
}

export interface Thread {
  id: string
  title: string
  participants: string[]
  topic: 'team' | 'position' | 'parent' | 'staff'
  unread: number
  lastAt: string
  messages: Message[]
}

export const threads: Thread[] = [
  {
    id: 't-1',
    title: 'Offense — Y-Cross install',
    topic: 'team',
    participants: ['Marcus Halloway', 'Jaylen Brooks', 'Andre Sutton', 'Bryce Carter', 'Tyrell Mason'],
    unread: 2,
    lastAt: '12 min ago',
    messages: [
      { id: 'm-1', from: 'Marcus Halloway', at: 'Mon 7:42 PM', body: 'Walking through Y-Cross tomorrow against a Cover 3 Buzz look. Watch the install reel — pay attention to the H motion that holds the Mike.' },
      { id: 'm-2', from: 'Jaylen Brooks',   at: 'Mon 7:51 PM', body: 'Got it. If they bring it, what’s the hot?' },
      { id: 'm-3', from: 'Marcus Halloway', at: 'Mon 7:53 PM', body: 'Slot on the seam. We talked about that — same answer as last week, just on the back side now.' },
      { id: 'm-4', from: 'Andre Sutton',    at: 'Tue 11:04 AM', body: 'Coach if they roll late to a quarter I can break it off at 12 right?' },
      { id: 'm-5', from: 'Marcus Halloway', at: 'Tue 11:08 AM', body: 'Yes — read leverage on the rep. Either choice is fine if it’s decisive.' },
    ],
  },
  {
    id: 't-2',
    title: 'Parents · Game Day Logistics',
    topic: 'parent',
    participants: ['Kenneth Weikel', 'Brooks Family', 'Sutton Family', 'Mason Family'],
    unread: 0,
    lastAt: '1 hr ago',
    messages: [
      { id: 'm-1', from: 'Kenneth Weikel', at: 'Mon 5:14 PM', body: 'Buses load at 4:45 PM Friday — please have players in white travel sweats. Pregame meal provided.' },
      { id: 'm-2', from: 'Brooks Family',  at: 'Mon 5:22 PM', body: 'Thanks coach. Should we send Jaylen with anything for the bus ride?' },
      { id: 'm-3', from: 'Kenneth Weikel', at: 'Mon 5:28 PM', body: 'Water bottle and headphones. We provide everything else.' },
    ],
  },
  {
    id: 't-3',
    title: 'Defense — Bayshore tendencies',
    topic: 'team',
    participants: ['Devon Pierce', 'Dominic Reyes', 'Isaiah Faulk', 'Jordan Knight'],
    unread: 1,
    lastAt: '3 hr ago',
    messages: [
      { id: 'm-1', from: 'Devon Pierce', at: 'Sun 9:18 PM', body: 'Cut-ups posted in /film. They run 12 personnel 64% on 1st-10. Get an early run fit and we own the game.' },
      { id: 'm-2', from: 'Dominic Reyes', at: 'Sun 9:42 PM', body: 'On it. Watching the Marina film tonight.' },
    ],
  },
  {
    id: 't-4',
    title: 'Staff',
    topic: 'staff',
    participants: ['Kenneth Weikel', 'Marcus Halloway', 'Devon Pierce', 'Theo Castellanos'],
    unread: 0,
    lastAt: 'Yesterday',
    messages: [
      { id: 'm-1', from: 'Kenneth Weikel', at: 'Yesterday 6:02 PM', body: 'Quick staff meeting after practice tomorrow — Bayshore script lock + special teams.' },
      { id: 'm-2', from: 'Theo Castellanos', at: 'Yesterday 6:05 PM', body: 'I’ll have QB cut-ups ready.' },
    ],
  },
]
