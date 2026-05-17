'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import TopBar from '@/components/shell/TopBar'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import { team } from '@/data/team'
import { usePersona } from '@/design/persona'

interface NavItem {
  key: string
  href: string
  label: string
  icon: string
  accentRGB: string
  match: (p: string) => boolean
}

const NAV: NavItem[] = [
  { key: 'dashboard', href: '/dashboard',       label: 'Dashboard', icon: 'sparkle',   accentRGB: PALETTE.brassRGB,    match: (p) => p === '/' || p.startsWith('/dashboard') },
  { key: 'playbook',  href: '/playbook/plays',  label: 'Playbook',  icon: 'play-diagram', accentRGB: PILLARS.playbook.accentRGB, match: (p) => p.startsWith('/playbook') },
  { key: 'roster',    href: '/roster/players',  label: 'Roster',    icon: 'roster',    accentRGB: PILLARS.roster.accentRGB,   match: (p) => p.startsWith('/roster') },
  { key: 'practice',  href: '/practice/plans',  label: 'Practice',  icon: 'clipboard', accentRGB: PILLARS.practice.accentRGB, match: (p) => p.startsWith('/practice') },
  { key: 'game',      href: '/game/live/wk8',   label: 'Game',      icon: 'whistle',   accentRGB: PILLARS.game.accentRGB,     match: (p) => p.startsWith('/game') },
  { key: 'film',      href: '/film/library',    label: 'Film',      icon: 'film',      accentRGB: PALETTE.cyanRGB,            match: (p) => p.startsWith('/film') },
  { key: 'scout',     href: '/scout/opponents', label: 'Scout',     icon: 'scout',     accentRGB: PALETTE.amberRGB,           match: (p) => p.startsWith('/scout') },
  { key: 'analytics', href: '/analytics',       label: 'Analytics', icon: 'analytics', accentRGB: PALETTE.emeraldRGB,         match: (p) => p.startsWith('/analytics') },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/'
  const { isAllowed } = usePersona()
  const visibleNav = NAV.filter((n) => isAllowed(n.key))

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '232px 1fr',
        minHeight: '100vh',
        color: PALETTE.text,
      }}
    >
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          padding: '22px 14px 18px',
          borderRight: `1px solid ${PALETTE.border}`,
          background: 'linear-gradient(180deg, rgba(7,7,15,0.85), rgba(5,5,12,0.95))',
          backdropFilter: 'blur(14px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          zIndex: 30,
        }}
      >
        {/* Wordmark */}
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px' }}>
          <IconPlinth accentRgb={PALETTE.brassRGB} size={38}>
            <OutlineIcon name="whistle" color={`rgb(${PALETTE.brassRGB})`} size={20} />
          </IconPlinth>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 600, color: PALETTE.text, letterSpacing: '-0.01em' }}>
              Atlas
            </span>
            <span style={{ fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.32em', color: `rgba(${PALETTE.brassRGB},0.85)`, marginTop: 2 }}>
              COACH
            </span>
          </div>
        </Link>

        {/* Team switcher */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${PALETTE.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <IconPlinth accentRgb={PALETTE.brassRGB} size={32} withBrackets={false}>
            <span style={{ fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: `rgba(${PALETTE.brassRGB},0.95)` }}>OC</span>
          </IconPlinth>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {team.name}
            </span>
            <Kicker size={8} spacing="0.26em" color={PALETTE.textMuted}>
              {team.sport} · {team.season}
            </Kicker>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {visibleNav.map((item) => {
            const active = item.match(pathname)
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    position: 'relative',
                    background: active
                      ? `linear-gradient(90deg, rgba(${item.accentRGB},0.14), rgba(${item.accentRGB},0.02))`
                      : 'transparent',
                    border: active ? `1px solid rgba(${item.accentRGB},0.32)` : '1px solid transparent',
                    color: active ? PALETTE.text : PALETTE.textSub,
                    cursor: 'pointer',
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        left: -14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 2,
                        height: 18,
                        background: `rgb(${item.accentRGB})`,
                        borderRadius: 2,
                        boxShadow: `0 0 8px rgba(${item.accentRGB},0.7), 0 0 16px rgba(${item.accentRGB},0.4)`,
                      }}
                    />
                  )}
                  <OutlineIcon name={item.icon} color={`rgba(${item.accentRGB},${active ? 0.95 : 0.65})`} size={18} />
                  <span style={{ fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User chip */}
        <Link href="/settings/team" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${PALETTE.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <IconPlinth accentRgb={PALETTE.cyanRGB} size={32} withBrackets={false}>
              <OutlineIcon name="settings" color={`rgb(${PALETTE.cyanRGB})`} size={16} />
            </IconPlinth>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <span style={{ fontFamily: FONT.body, fontSize: 11, fontWeight: 700, color: PALETTE.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Settings
              </span>
              <Kicker size={8} spacing="0.26em" color={PALETTE.textMuted}>
                Team · Staff · Sport
              </Kicker>
            </div>
          </div>
        </Link>
      </aside>

      {/* ── Main canvas ──────────────────────────────────────────────── */}
      <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ padding: '24px 32px 64px', flex: 1 }}>{children}</div>
      </main>
    </div>
  )
}
