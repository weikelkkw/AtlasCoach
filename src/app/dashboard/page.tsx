'use client'

import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import SectionHeader from '@/components/ui/SectionHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import Avatar from '@/components/ui/Avatar'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { team } from '@/data/team'
import { plays } from '@/data/plays'
import { roster } from '@/data/roster'
import { practicePlans } from '@/data/practice'
import { schedule } from '@/data/schedule'
import Link from 'next/link'

export default function DashboardPage() {
  const installed = plays.filter((p) => p.installStatus === 'installed').length
  const installPct = Math.round((installed / Math.max(plays.length, 1)) * 100)
  const injured = roster.filter((p) => p.status === 'injured').length
  const limited = roster.filter((p) => p.status === 'limited').length
  const healthy = roster.length - injured - limited
  const nextGame = schedule.find((g) => g.status === 'upcoming')
  const lastPlan = practicePlans[0]
  const totalPlays = plays.length
  const filmHours = 18.4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1400 }}>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <HeroFrame intensity="lg" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Kicker color={`rgba(${PALETTE.brassRGB},0.85)`}>
              Week {team.nextGame.week} · {team.nextGame.where} · {team.nextGame.when}
            </Kicker>
            <h1
              style={{
                fontFamily: FONT.display,
                fontSize: 44,
                fontWeight: 500,
                color: PALETTE.text,
                letterSpacing: '-0.01em',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {team.name} <span style={{ color: PALETTE.textMuted, fontStyle: 'italic' }}>{team.mascot}</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.body, fontSize: 14, color: PALETTE.textSub }}>
              <span>
                <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.cyanRGB}>
                  {team.record.wins}–{team.record.losses}
                </Shimmer>{' '}<span style={{ color: PALETTE.textMuted }}>overall</span>
              </span>
              <span style={{ width: 4, height: 4, borderRadius: 4, background: PALETTE.textFaint }} />
              <span>
                Next:{' '}
                <span style={{ color: PALETTE.text, fontWeight: 700 }}>{team.nextGame.opponent}</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <Link href="/playbook/plays" style={{ textDecoration: 'none' }}>
                <PrimaryButton
                  accentRgb={PALETTE.brassRGB}
                  secondaryRgb={PALETTE.cyanRGB}
                  icon={<OutlineIcon name="play-diagram" color={`rgba(${PALETTE.brassRGB},0.95)`} size={13} />}
                >
                  Open Playbook
                </PrimaryButton>
              </Link>
              <Link href="/practice/plans/wk8-tue" style={{ textDecoration: 'none' }}>
                <SecondaryButton icon={<OutlineIcon name="clipboard" color={PALETTE.textSub} size={13} />}>
                  This Week’s Practice
                </SecondaryButton>
              </Link>
              <Link href="/game/live/wk8" style={{ textDecoration: 'none' }}>
                <SecondaryButton icon={<OutlineIcon name="whistle" color={PALETTE.textSub} size={13} />}>
                  Wristband
                </SecondaryButton>
              </Link>
            </div>
          </div>

          <IconPlinth accentRgb={PALETTE.brassRGB} size={92}>
            <OutlineIcon name="whistle" color={`rgb(${PALETTE.brassRGB})`} size={42} />
          </IconPlinth>
        </div>
      </HeroFrame>

      {/* ── KPI strip ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <KpiTile
          label="Plays Installed"
          value={`${installed}`}
          sub={`/ ${totalPlays}`}
          icon="play-diagram"
          accentRgb={PILLARS.playbook.accentRGB}
          secondaryRgb={PILLARS.playbook.secondaryRGB}
        />
        <KpiTile
          label="Roster Health"
          value={`${healthy}`}
          sub={injured > 0 ? `${injured} injured` : `${limited} limited`}
          subLoss={injured > 0}
          icon="roster"
          accentRgb={PILLARS.roster.accentRGB}
          secondaryRgb={PILLARS.roster.secondaryRGB}
        />
        <KpiTile
          label="Practice Ready"
          value={lastPlan ? 'Yes' : 'No'}
          sub={lastPlan?.title}
          icon="clipboard"
          accentRgb={PILLARS.practice.accentRGB}
          secondaryRgb={PILLARS.practice.secondaryRGB}
        />
        <KpiTile
          label="Film Tagged · 7d"
          value={`${filmHours}`}
          sub="hrs"
          icon="film"
          accentRgb={PILLARS.game.accentRGB}
          secondaryRgb={PILLARS.game.secondaryRGB}
        />
      </div>

      {/* ── This Week + Install temperature ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <HeroFrame intensity="md" accentRgb={PALETTE.cyanRGB} accentRgb2={PALETTE.brassRGB}>
          <div style={{ padding: 20 }}>
            <SectionHeader accentRgb={PALETTE.cyanRGB}>This Week</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <WeekColumn title="Today" items={[
                { time: '3:30 PM', text: 'Skel: Y-Cross install (12 reps)', who: 'Marcus Halloway' },
                { time: '4:15 PM', text: 'Inside run vs scout 4-down', who: 'Greg Northrop' },
                { time: '5:00 PM', text: 'Team period — 12-play script', who: 'Kenneth Weikel' },
              ]} />
              <WeekColumn title="Tomorrow" items={[
                { time: '7:30 AM', text: 'Film install — Bayshore tendencies', who: 'Devon Pierce' },
                { time: '3:30 PM', text: 'Red zone + 2-min install', who: 'Marcus Halloway' },
                { time: '5:15 PM', text: 'Special teams period', who: 'Curtis Bellamy' },
              ]} />
              <WeekColumn title="Friday · Game" items={[
                { time: '4:30 PM', text: 'Walk-through + script lock', who: 'Kenneth Weikel' },
                { time: '5:45 PM', text: 'Pregame meal', who: 'All' },
                { time: '7:00 PM', text: 'Kickoff vs Bayshore Catholic', who: nextGame?.opponent ?? '' },
              ]} />
            </div>
          </div>
        </HeroFrame>

        <HeroFrame intensity="md" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.emeraldRGB}>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionHeader accentRgb={PALETTE.brassRGB}>Top Plays · Week 7</SectionHeader>
            {plays.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/playbook/plays/${p.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${PALETTE.border}`,
                  }}
                >
                  <IconPlinth accentRgb={PALETTE.brassRGB} size={34} withBrackets={false}>
                    <OutlineIcon name="play-diagram" color={`rgb(${PALETTE.brassRGB})`} size={16} />
                  </IconPlinth>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <Kicker size={9} color={PALETTE.textMuted}>{p.formation} · {p.stats.runs} runs</Kicker>
                  </div>
                  <span style={{ fontFamily: FONT.body, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.emeraldRGB}>{p.stats.efficiency}%</Shimmer>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </HeroFrame>
      </div>

      {/* ── Install temperature ─────────────────────────────────────── */}
      <HeroFrame intensity="md" accentRgb={PALETTE.brassRGB} accentRgb2={PALETTE.cyanRGB}>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <Kicker color={PALETTE.textSub}>Install Temperature</Kicker>
            <span style={{ fontFamily: FONT.body, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
              <Shimmer accentRgb={PALETTE.brassRGB} secondaryRgb={PALETTE.cyanRGB}>{installPct}%</Shimmer>
            </span>
          </div>
          <div style={{
            position: 'relative', height: 10, borderRadius: 999,
            background: 'rgba(255,255,255,0.04)', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${installPct}%`,
              background: `linear-gradient(90deg, rgb(${PALETTE.brassRGB}), rgb(${PALETTE.cyanRGB}))`,
              boxShadow: `0 0 18px rgba(${PALETTE.brassRGB},0.5)`,
              borderRadius: 999,
            }} />
            <span style={{
              position: 'absolute',
              left: `calc(${installPct}% - 7px)`,
              top: -3,
              width: 16, height: 16, borderRadius: '50%',
              background: `rgb(${PALETTE.cyanRGB})`,
              color: `rgb(${PALETTE.cyanRGB})`,
              boxShadow: `0 0 8px rgb(${PALETTE.cyanRGB}), 0 0 18px rgba(${PALETTE.cyanRGB},0.6)`,
            }} className="head-pulse" />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 14, fontFamily: FONT.body, fontSize: 12, color: PALETTE.textMuted }}>
            <LegendDot color={PALETTE.brassRGB} label={`Installed · ${installed}`} />
            <LegendDot color={PALETTE.cyanRGB} label={`Teaching · ${plays.filter((p) => p.installStatus === 'teaching').length}`} />
            <LegendDot color={PALETTE.violetRGB} label={`Planned · ${plays.filter((p) => p.installStatus === 'planned').length}`} />
          </div>
        </div>
      </HeroFrame>
    </div>
  )
}

function KpiTile({
  label, value, sub, subLoss, icon, accentRgb, secondaryRgb,
}: {
  label: string; value: string; sub?: string; subLoss?: boolean; icon: string; accentRgb: string; secondaryRgb: string
}) {
  return (
    <HeroFrame intensity="sm" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Kicker color={`rgba(${accentRgb},0.95)`} size={9} spacing="0.24em">{label}</Kicker>
          <OutlineIcon name={icon} color={`rgba(${accentRgb},0.85)`} size={14} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span style={{ fontFamily: FONT.body, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', minWidth: 0 }}>
            <Shimmer accentRgb={accentRgb} secondaryRgb={secondaryRgb}>{value}</Shimmer>
          </span>
          {sub && (
            <span
              className={subLoss ? 'loss-text' : ''}
              style={{
                fontFamily: FONT.label,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: subLoss ? undefined : PALETTE.textMuted,
              }}
            >
              {sub}
            </span>
          )}
        </div>
      </div>
    </HeroFrame>
  )
}

function WeekColumn({ title, items }: { title: string; items: { time: string; text: string; who: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Kicker color={PALETTE.textMuted}>{title}</Kicker>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${PALETTE.border}`,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 64 }}>
              <Kicker size={9} color={`rgba(${PALETTE.cyanRGB},0.95)`}>{it.time}</Kicker>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT.body, fontSize: 13, color: PALETTE.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.text}
              </div>
            </div>
            <Avatar name={it.who} size={28} accentRgb={PALETTE.cyanRGB} />
          </div>
        ))}
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: `rgb(${color})`, boxShadow: `0 0 6px rgba(${color},0.6)` }} />
      <span style={{ fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase' }}>{label}</span>
    </span>
  )
}
