# Atlas Coach

The operating system for modern coaches. Premium, multi-sport, cinematic.
Designed to sit alongside the OAXII / Atlas family.

> One coach, every Sunday-through-Friday workflow: plan the week, design
> the playbook, run practice, call the game, break down the film — on one
> surface, in one aesthetic.

**Status:** Frontend complete through the simulation and design polish
layer. No backend yet — every piece of state lives in memory or
`localStorage`. The visual identity and the simulation engine are the
moat; backend wiring is the next 90 days.

---

## What's inside

### Multi-sport play canvas
Six sport-aware field surfaces — football, basketball, soccer, hockey,
baseball, lacrosse — each with authentic markings (yard numbers, key,
penalty box, blue lines, diamond, creases). Every surface inherits the
same cinematic ambient (drift orbs, corner brackets, end-zone wordmark,
turf grain).

### Real defensive schemes
22 authentic football defenses out of the box: 4-3 Over / Under,
3-4 Base, Bear 46, Nickel 4-2-5, Dime 4-1-6, 3-3-5 Stack, Cover
0/1/1-Robber/2/2-Man/3/3-Buzz/3-Sky/4/6, Tampa 2, Double-A, Nickel
Blitz, Edge Pressure, Sim Pressure. Plus sport-specific defenses for
basketball, soccer, hockey, baseball, lacrosse.

Defenses come with metadata — family, personnel, bestVs, weakness, and
an 11-player alignment at field-normalized coordinates.

### Defense import flow
Drop your own schemes in as JSON. Schema-validated, persists locally,
appears in every play's "vs Defense" picker with an emerald "Custom"
badge. Export the full library to JSON for backup.

### Play simulation engine
Every player on every play has reactive movement based on their position
plus the play's intent plus the defense's coverage shell. The OL pass-pros
or run-blocks depending on the play tags. The QB drops appropriately.
The RB releases, blocks, or runs depending on context. Defenders read
run vs pass and either fill the gap or drop to their zone — Cover 2
safeties bail to halves, Cover 3 corner sinks to deep third, Cover 1
robber lurks the middle, blitzers fire upfield. Same offense vs Cover 2
and Cover 3 produces dramatically different defensive reactions.

Catmull-Rom spline interpolation through waypoints with a global
smootherstep ease and position-tuned pre-snap stagger gives the motion
a continuous, buttery feel — no segment pauses, no waypoint jerks.

### iPad-first Play Designer
PointerEvents end-to-end — works identically on mouse, finger, and
Apple Pencil.

- Tap a player to select, drag to relocate (offense and defense both)
- Tap a route preset from the sport-aware library to swap their
  assignment in one tap (23 football routes, 10 basketball cuts, 8 soccer
  movements, 8 hockey routes, 6 baseball, 7 lacrosse)
- Or pen-drag to draw a custom freehand route
- Snap-to-grid toggle for clean field-coordinate alignment
- Mark any route as the primary read — it renders thicker, solid, with
  a brighter arrowhead and a pulsing halo around the receiver chip
- Full keyboard shortcuts: `V` move, `D` draw, `O / X` add offense or
  defense, `E` erase, `G` snap, arrow keys nudge, `?` shortcut panel,
  `Cmd+Z` undo

### Global chrome
- Top bar on every page with a search pill (`Cmd+K` command palette
  spanning every play, player, drill, opponent, page), persona switcher
  (Head Coach / Coordinator / Player / Parent — scopes the sidebar nav),
  notifications dropdown, and a "Saved · X" indicator
- Toast system with brass shimmer pills used on save, revert, import
- Save persistence — designed plays and primary-read changes mirror to
  `localStorage` and survive reload, with a Revert path back to the seed
- Responsive canvas — ResizeObserver measures the available column and
  locks a 16:9 aspect

### The pillars in full

| Pillar | Routes |
|---|---|
| **Dashboard** | Cinematic hero, 4 pillar-tinted KPI tiles, This Week panel, Top Plays, install temperature bar |
| **Playbook** | Plays library with sport + formation + situation + tag + install filters; play detail with animator + designer + variants + production + AI notes; install plan 12-week grid; defense library + import modal |
| **Roster** | Players list and profile (six tabs); drag-and-drop depth chart; attendance week grid; threaded comms with composer |
| **Practice** | Plans list, plan detail (period script with brass divider), drill library |
| **Game** | Upcoming schedule; live wristband (4x6 grid, pending-call panel, result chips, recent calls); recap with quarter bar charts + drive summary |
| **Film** | Library with thumbnail frames; clip detail with time-coded tag rail + active tag highlight |
| **Scout** | Opponent dossier with run/pass tendency heatmap, key players, top-10 plays |
| **Analytics** | Four-tab dashboard — Offense / Defense / Workload / Install — with gradient bar charts, peak halo, "today" dot |
| **Settings** | Team identity; staff invite list; sport switcher (6 live sports with field preview); billing tiers |

---

## Stack

- Next.js 16.2.6 (App Router, Turbopack) — note: `params` and `searchParams` are Promises
- React 19.2.4, TypeScript 5.9, Tailwind 4
- framer-motion 12 for spring animations
- lucide-react mostly replaced by an in-house `OutlineIcon` glyph kit
- No database, no auth, no API yet — state is in-memory plus `localStorage`
  (`atlas-coach.play.<id>`, `atlas-coach.defense.<id>`, `atlas-coach.persona`)

---

## Quick start

```bash
git clone https://github.com/weikelkkw/AtlasCoach.git atlas-coach
cd atlas-coach
npm install
npm run dev
```

Open <http://localhost:3000>. Set `PORT=4400 npm run dev` if 3000 is busy.

---

## 60-second demo loop

1. Open `/dashboard`.
2. Hit `Cmd+K`, type "y-cross", press enter — opens **Spread Right · Y-Cross**.
3. Press play in the animator. Players run. Defenders react.
4. **Primary Read** row → tap `X · WR`. The slant lights up brass-to-cyan.
5. **vs Defense** row → switch from **Cover 2** to **0 Blitz**. Watch the
   entire defense rerun with man-match coverage and an all-out rush.
6. Click **Design Mode**. Horizontal toolbar appears, canvas takes the
   full window. Tap any player, drag to relocate. Tap **WHEEL** in the
   route library to swap their assignment.
7. **Save Play**. Toast confirms. Reload the page. Banner shows "Edited
   locally" with a Revert button.
8. Sidebar → **Defenses**. Tap **Import Defense**. The template is
   prefilled — hit **Import** and your custom scheme lands in the library
   with an emerald "Custom" badge, selectable from every play's defense
   picker.

---

## What's pending

- Backend (Supabase) — auth, multi-tenancy, RLS
- Multi-branch decision tree editor (data model accepts it; renderer is
  single-branch)
- Mobile-collapse sidebar (fixed 232px crushes iPad portrait)
- MP4 export pipeline (button exists, needs ffmpeg or `MediaRecorder`)
- Tokenized share links for read-only play views
- Real-time sync for game-day wristband (Supabase Realtime once backend lands)
- Offline service worker for game day reliability
- COPPA / FERPA compliance posture before any real launch
- Stripe billing wiring for the four tiers on `/settings/billing`
- Film integration (Hudl import or local upload)

---

## File map

```
src/
├── app/                       routes (App Router)
│   ├── dashboard/
│   ├── playbook/              plays · install · defenses (library + import)
│   ├── roster/                players · depth-chart · attendance · comms
│   ├── practice/              plans · drills
│   ├── game/                  upcoming · live wristband · recap
│   ├── film/                  library · clip detail
│   ├── scout/                 opponents · dossier
│   ├── analytics/
│   └── settings/              team · staff · sport · billing
├── components/
│   ├── HeroFrame.tsx          cinematic frame primitive
│   ├── OutlineIcon.tsx        25+ coaching glyphs
│   ├── shell/                 AppShell · TopBar · CommandPalette
│   ├── ui/                    Toast · buttons · BarChart · EmptyState · etc.
│   ├── playcanvas/            FieldSurface · PlayerChip · PlayCanvas
│   │                          PlayAnimator · PlayDesigner · DefensePreview
│   └── defenses/              DefenseImportModal
├── data/                      seed data (plays, defenses, roster, etc.)
├── design/                    constants · theme · persona
└── lib/
    ├── playSimulation.ts      reactive-movement engine
    ├── playStore.ts           per-play localStorage mirror
    └── defenseStore.ts        custom-defense localStorage + JSON validator
```

---

## Design canon

The visual system descends from the OAXII cinematic luxury aesthetic.
Every elevated surface is a `HeroFrame` (corner brackets, drift orbs,
scanline, tech grid). Numbers shimmer brass to cyan; losses go solid
`#fca5a5`, never gold. Cormorant Garamond for display, DM Sans for body,
Syncopate for every uppercase label (`letter-spacing: 0.18em-0.24em`).
Filter rows wrap, never scroll. No emojis — every glyph is an
`OutlineIcon`.
