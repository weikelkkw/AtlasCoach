'use client'

// PlayDesigner — touch / pen / mouse first play editor.
// Tap a player to select. Drag any player (offense OR defense) to reposition.
// Tap a route preset to swap their assignment instantly. Pen-drag draws custom.

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroFrame from '@/components/HeroFrame'
import OutlineIcon from '@/components/OutlineIcon'
import IconPlinth from '@/components/ui/IconPlinth'
import Kicker from '@/components/ui/Kicker'
import Shimmer from '@/components/ui/Shimmer'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import FieldSurface from './FieldSurface'
import PlayerChip, { SharedChipDefs } from './PlayerChip'
import { pathToSvg } from './PlayCanvas'
import ResponsiveStage from './ResponsiveStage'
import { FONT, PALETTE, PILLARS } from '@/design/constants'
import type { DefensiveAlignment, Play, PlayerPath } from '@/data/plays'
import { applyRouteTemplate, routesFor, type RouteTemplate, type Sport } from '@/data/routes'

type Tool = 'select' | 'draw' | 'add-offense' | 'add-defense' | 'erase'
type SelectionSide = 'offense' | 'defense'

interface Props {
  play: Play
  defense: DefensiveAlignment
  onSave?: (next: Play) => void
  onExit?: () => void
}

export default function PlayDesigner({
  play,
  defense,
  onSave,
  onExit,
}: Props) {
  const pillar = PILLARS.playbook
  const accentRgb = pillar.accentRGB
  const secondaryRgb = pillar.secondaryRGB

  const [edit, setEdit] = useState<Play>(play)
  // Local mutable defense so defenders can be dragged too
  const [editDefense, setEditDefense] = useState<DefensiveAlignment>(defense)
  const [history, setHistory] = useState<Array<{ play: Play; defense: DefensiveAlignment }>>([])
  const [selected, setSelected] = useState<{ id: string; side: SelectionSide } | null>(null)
  const [tool, setTool] = useState<Tool>('select')
  const [snap, setSnap] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const sport: Sport = edit.sport ?? 'football'

  const applySnap = useCallback((pos: { x: number; y: number }) => {
    if (!snap) return pos
    const grid = 0.05
    return {
      x: Math.round(pos.x / grid) * grid,
      y: Math.round(pos.y / grid) * grid,
    }
  }, [snap])

  // Pointer interaction state
  const svgWrapRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState<
    { id: string; side: SelectionSide; pointerId: number; origin: { x: number; y: number } } | null
  >(null)
  const [drawing, setDrawing] = useState<{ playerId: string; points: { x: number; y: number }[] } | null>(null)

  // ── Helpers ─────────────────────────────────────────────────────────
  const commit = useCallback((nextPlay: Play, nextDefense?: DefensiveAlignment) => {
    setHistory((h) => [...h, { play: edit, defense: editDefense }])
    setEdit(nextPlay)
    if (nextDefense) setEditDefense(nextDefense)
  }, [edit, editDefense])

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const last = h[h.length - 1]
      setEdit(last.play)
      setEditDefense(last.defense)
      return h.slice(0, -1)
    })
  }, [])

  const eventToField = useCallback((e: RPointerEvent | { clientX: number; clientY: number }) => {
    if (!svgWrapRef.current) return { x: 0.5, y: 0.5 }
    const rect = svgWrapRef.current.getBoundingClientRect()
    const xNorm = (e.clientX - rect.left) / rect.width
    const yNorm = (e.clientY - rect.top) / rect.height
    const raw = {
      x: Math.max(0.02, Math.min(0.98, xNorm)),
      y: Math.max(0.02, Math.min(0.98, 1 - yNorm)),
    }
    return applySnap(raw)
  }, [applySnap])

  const selectedPlayer = useMemo(() => {
    if (!selected) return null
    if (selected.side === 'offense') {
      return edit.offense.find((p) => p.id === selected.id) ?? null
    }
    return editDefense.players.find((p) => p.id === selected.id) ?? null
  }, [selected, edit.offense, editDefense.players])

  const routeLibrary = useMemo(() => routesFor(sport), [sport])

  const applyRoute = useCallback((tpl: RouteTemplate) => {
    if (!selected || !selectedPlayer || selected.side !== 'offense') return
    const mirror = selectedPlayer.start.x > 0.55
    const wps = applyRouteTemplate(selectedPlayer.start, tpl, { mirror })
    const next: Play = {
      ...edit,
      offense: edit.offense.map((p) =>
        p.id === selected.id
          ? { ...p, waypoints: wps, action: tpl.category === 'block' ? 'block' : tpl.category === 'run' ? 'run' : 'route' }
          : p,
      ),
    }
    commit(next)
  }, [selected, selectedPlayer, edit, commit])

  // ── Field pointer handlers ─────────────────────────────────────────
  const onFieldPointerDown = useCallback((e: RPointerEvent) => {
    if (tool === 'add-offense' || tool === 'add-defense') {
      const pos = eventToField(e)
      const newId = `n-${Date.now()}`
      if (tool === 'add-offense') {
        const next: Play = {
          ...edit,
          offense: [...edit.offense, {
            id: newId, label: '?', position: 'WR', side: 'offense',
            start: pos, waypoints: [], action: 'route',
          }],
        }
        commit(next)
        setSelected({ id: newId, side: 'offense' })
      } else {
        // Add defender
        const nextDef: DefensiveAlignment = {
          ...editDefense,
          players: [...editDefense.players, {
            id: newId, label: '?', position: 'LB', side: 'defense',
            start: pos, waypoints: [],
          }],
        }
        commit(edit, nextDef)
        setSelected({ id: newId, side: 'defense' })
      }
      return
    }
    if (tool === 'draw' && selected && selected.side === 'offense' && selectedPlayer) {
      const pos = eventToField(e)
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setDrawing({ playerId: selected.id, points: [{ x: selectedPlayer.start.x, y: selectedPlayer.start.y }, pos] })
      return
    }
    if (tool === 'select') {
      // Tap blank to deselect
      setSelected(null)
    }
  }, [tool, eventToField, edit, editDefense, commit, selected, selectedPlayer])

  const onFieldPointerMove = useCallback((e: RPointerEvent) => {
    if (drawing) {
      const pos = eventToField(e)
      setDrawing((d) => d ? { ...d, points: [...d.points, pos] } : d)
      return
    }
    if (dragging) {
      const pos = eventToField(e)
      if (dragging.side === 'offense') {
        setEdit((prev) => ({
          ...prev,
          offense: prev.offense.map((p) => p.id === dragging.id ? { ...p, start: pos } : p),
        }))
      } else {
        setEditDefense((prev) => ({
          ...prev,
          players: prev.players.map((p) => p.id === dragging.id ? { ...p, start: pos } : p),
        }))
      }
    }
  }, [drawing, dragging, eventToField])

  const onFieldPointerUp = useCallback(() => {
    if (drawing) {
      const simplified = simplifyPoints(drawing.points, 5)
      const wps = simplified.slice(1).map((pt, i, arr) => ({
        ...pt, t: (i + 1) / arr.length,
      }))
      setEdit((prev) => {
        const next: Play = {
          ...prev,
          offense: prev.offense.map((p) =>
            p.id === drawing.playerId ? { ...p, waypoints: wps, action: 'route' } : p,
          ),
        }
        setHistory((h) => [...h, { play: prev, defense: editDefense }])
        return next
      })
      setDrawing(null)
    }
    if (dragging) {
      // Commit history snapshot (we've been mutating live for smoothness)
      setHistory((h) => [...h, { play: edit, defense: editDefense }])
      setDragging(null)
    }
  }, [drawing, dragging, edit, editDefense])

  const onPlayerPointerDown = useCallback((e: RPointerEvent, id: string, side: SelectionSide) => {
    e.stopPropagation()
    if (tool === 'erase') {
      if (side === 'offense') {
        const next: Play = { ...edit, offense: edit.offense.filter((p) => p.id !== id) }
        commit(next)
      } else {
        const nextDef: DefensiveAlignment = { ...editDefense, players: editDefense.players.filter((p) => p.id !== id) }
        commit(edit, nextDef)
      }
      if (selected?.id === id) setSelected(null)
      return
    }
    setSelected({ id, side })
    if (tool === 'select' || tool === 'draw') {
      // Always allow drag-to-move via select tool
      const player = (side === 'offense' ? edit.offense : editDefense.players).find((p) => p.id === id)
      if (player) {
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        setDragging({
          id,
          side,
          pointerId: e.pointerId,
          origin: player.start,
        })
      }
    }
  }, [tool, edit, editDefense, commit, selected])

  // Nudge currently selected player ±delta in field coordinates
  const nudgeSelected = useCallback((dx: number, dy: number) => {
    if (!selected) return
    if (selected.side === 'offense') {
      setEdit((prev) => ({
        ...prev,
        offense: prev.offense.map((p) => p.id === selected.id
          ? { ...p, start: { x: clamp01(p.start.x + dx), y: clamp01(p.start.y + dy) } }
          : p),
      }))
    } else {
      setEditDefense((prev) => ({
        ...prev,
        players: prev.players.map((p) => p.id === selected.id
          ? { ...p, start: { x: clamp01(p.start.x + dx), y: clamp01(p.start.y + dy) } }
          : p),
      }))
    }
  }, [selected])

  // ── Keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return }
        return
      }
      const k = e.key.toLowerCase()
      if (k === 'escape') { e.preventDefault(); setSelected(null); setShortcutsOpen(false); return }
      if (k === '?') { e.preventDefault(); setShortcutsOpen((o) => !o); return }
      if (k === 'v') { e.preventDefault(); setTool('select'); return }
      if (k === 'd') { e.preventDefault(); setTool('draw'); return }
      if (k === 'o') { e.preventDefault(); setTool('add-offense'); return }
      if (k === 'x') { e.preventDefault(); setTool('add-defense'); return }
      if (k === 'e') { e.preventDefault(); setTool('erase'); return }
      if (k === 'g') { e.preventDefault(); setSnap((s) => !s); return }
      if (selected) {
        const step = e.shiftKey ? 0.05 : 0.01
        if (e.key === 'ArrowLeft')  { e.preventDefault(); nudgeSelected(-step, 0); return }
        if (e.key === 'ArrowRight') { e.preventDefault(); nudgeSelected(step, 0); return }
        if (e.key === 'ArrowUp')    { e.preventDefault(); nudgeSelected(0, step); return }
        if (e.key === 'ArrowDown')  { e.preventDefault(); nudgeSelected(0, -step); return }
        if (k === 'backspace' || k === 'delete') {
          e.preventDefault()
          if (selected.side === 'offense') {
            commit({ ...edit, offense: edit.offense.filter((p) => p.id !== selected.id) })
          } else {
            commit(edit, { ...editDefense, players: editDefense.players.filter((p) => p.id !== selected.id) })
          }
          setSelected(null)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, edit, editDefense, commit, undo, nudgeSelected])

  // ── Render ─────────────────────────────────────────────────────────
  const groupedLibrary = useMemo(() => {
    const groups: Record<string, RouteTemplate[]> = {}
    for (const r of routeLibrary) {
      ;(groups[r.category] ||= []).push(r)
    }
    return groups
  }, [routeLibrary])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ─── Top action bar ─────────────────────────────────────────────── */}
      <HeroFrame intensity="sm" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Kicker color={`rgba(${accentRgb},0.95)`}>Designer · {sport}</Kicker>
          <span style={{ flex: 1 }} />
          <SecondaryButton icon={<OutlineIcon name="back" color={PALETTE.textSub} size={12} />} onClick={undo}>
            Undo {history.length > 0 ? `(${history.length})` : ''}
          </SecondaryButton>
          <SecondaryButton onClick={onExit} icon={<OutlineIcon name="play" color={PALETTE.textSub} size={12} />}>
            Simulate
          </SecondaryButton>
          <PrimaryButton
            accentRgb={accentRgb} secondaryRgb={secondaryRgb}
            icon={<OutlineIcon name="sparkle" color={`rgba(${accentRgb},0.95)`} size={12} />}
            onClick={() => onSave?.(edit)}
          >
            Save Play
          </PrimaryButton>
        </div>
      </HeroFrame>

      {/* ─── Horizontal tool ribbon ─────────────────────────────────────── */}
      <HeroFrame intensity="sm" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <ToolRibbonButton active={tool === 'select'}      onClick={() => setTool('select')}      icon="play"      label="Move"   shortcut="V" accent={accentRgb}         secondary={secondaryRgb} />
          <ToolRibbonButton active={tool === 'draw'}        onClick={() => setTool('draw')}        icon="sparkle"   label="Draw"   shortcut="D" accent={accentRgb}         secondary={secondaryRgb} />
          <ToolRibbonButton active={tool === 'add-offense'} onClick={() => setTool('add-offense')} icon="plus"      label="+ Offense" shortcut="O" accent={PALETTE.brassRGB}  secondary={secondaryRgb} />
          <ToolRibbonButton active={tool === 'add-defense'} onClick={() => setTool('add-defense')} icon="plus"      label="+ Defense" shortcut="X" accent={PALETTE.violetRGB} secondary={accentRgb} />
          <ToolRibbonButton active={tool === 'erase'}       onClick={() => setTool('erase')}       icon="back"      label="Erase"  shortcut="E" accent={PALETTE.redRGB}    secondary={accentRgb} />
          <span style={{ width: 1, height: 24, background: PALETTE.border, margin: '0 6px' }} />
          <ToolRibbonButton active={snap}            onClick={() => setSnap((s) => !s)}             icon="calendar" label="Snap"    shortcut="G" accent={PALETTE.cyanRGB}  secondary={accentRgb} />
          <ToolRibbonButton active={shortcutsOpen}   onClick={() => setShortcutsOpen((o) => !o)}    icon="sparkle"  label="Shortcuts" shortcut="?" accent={PALETTE.brassRGB} secondary={secondaryRgb} />
          <span style={{ flex: 1 }} />
          <ToolRibbonButton active={drawerOpen}     onClick={() => setDrawerOpen((o) => !o)}        icon={drawerOpen ? 'pause' : 'play-diagram'}    label={drawerOpen ? 'Hide Library' : 'Show Library'} accent={accentRgb} secondary={secondaryRgb} />
        </div>
      </HeroFrame>

      {/* ─── Full-width canvas ───────────────────────────────────────────── */}
      <HeroFrame intensity="lg" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
        <div style={{ padding: 18 }}>
          <ResponsiveStage aspectRatio={16 / 9} minHeight={320} maxHeight={760}>
            {(cw, ch) => (
              <div
                ref={svgWrapRef}
                style={{ position: 'relative', width: cw, height: ch, touchAction: 'none', userSelect: 'none' }}
                onPointerDown={onFieldPointerDown}
                onPointerMove={onFieldPointerMove}
                onPointerUp={onFieldPointerUp}
                onPointerCancel={onFieldPointerUp}
              >
                <FieldSurface sport={sport} width={cw} height={ch} accentRgb={accentRgb} secondaryRgb={secondaryRgb}>
                  <DesignerLayer
                    play={edit}
                    defense={editDefense}
                    width={cw}
                    height={ch}
                    selected={selected}
                    dragging={dragging}
                    drawingPoints={drawing?.points}
                    onPlayerPointerDown={onPlayerPointerDown}
                    accentRgb={accentRgb}
                    secondaryRgb={secondaryRgb}
                    showGrid={snap}
                  />
                </FieldSurface>
                <ToolHint tool={tool} hasSelection={!!selectedPlayer} accentRgb={accentRgb} />
                <AnimatePresence>
                  {shortcutsOpen && <ShortcutsPanel key="shortcuts" onClose={() => setShortcutsOpen(false)} accent={accentRgb} />}
                </AnimatePresence>
              </div>
            )}
          </ResponsiveStage>
        </div>
      </HeroFrame>

      {/* ─── Bottom drawer: Selected + Route Library ────────────────────── */}
      <AnimatePresence initial={false}>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            style={{ overflow: 'hidden' }}
          >
            <HeroFrame intensity="md" accentRgb={accentRgb} accentRgb2={secondaryRgb}>
              <div style={{
                padding: '16px 18px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 280px) 1fr',
                gap: 18,
                alignItems: 'flex-start',
              }}>
                {/* Selected pane */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 24, height: 1,
                      background: `rgba(${selected?.side === 'defense' ? PALETTE.violetRGB : accentRgb},0.7)`,
                      boxShadow: `0 0 8px rgba(${selected?.side === 'defense' ? PALETTE.violetRGB : accentRgb},0.5)`,
                    }} />
                    <Kicker color={PALETTE.textSub}>Selected</Kicker>
                  </div>
                  {selectedPlayer ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <IconPlinth accentRgb={selected?.side === 'defense' ? PALETTE.violetRGB : accentRgb} size={44}>
                          <span style={{
                            fontFamily: FONT.body, fontSize: 14, fontWeight: 800,
                            color: `rgba(${selected?.side === 'defense' ? PALETTE.violetRGB : accentRgb},0.95)`,
                            letterSpacing: '-0.02em',
                          }}>{selectedPlayer.label}</span>
                        </IconPlinth>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: PALETTE.text }}>
                            {selectedPlayer.position} · <span style={{ color: PALETTE.textSub, fontWeight: 500 }}>{selected?.side}</span>
                          </div>
                          <Kicker size={9} color={PALETTE.textMuted}>
                            {selectedPlayer.action ?? 'route'} · {selectedPlayer.waypoints.length} pt(s)
                          </Kicker>
                        </div>
                      </div>
                      {edit.primaryRouteId === selectedPlayer.id && (
                        <span style={{
                          padding: '3px 9px', borderRadius: 999,
                          alignSelf: 'flex-start',
                          background: `linear-gradient(145deg, rgba(${PALETTE.cyanRGB},0.20), rgba(${PALETTE.brassRGB},0.05))`,
                          border: `1px solid rgba(${PALETTE.cyanRGB},0.45)`,
                          fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.18em',
                          textTransform: 'uppercase', color: 'transparent',
                        }}>
                          <Shimmer accentRgb={PALETTE.cyanRGB} secondaryRgb={PALETTE.brassRGB}>Primary Read</Shimmer>
                        </span>
                      )}
                      {selected?.side === 'offense' && selectedPlayer.position !== 'OL' && selectedPlayer.position !== 'QB' && (
                        <button
                          type="button"
                          onClick={() => {
                            const next: Play = {
                              ...edit,
                              primaryRouteId: edit.primaryRouteId === selectedPlayer.id ? undefined : selectedPlayer.id,
                            }
                            commit(next)
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 10,
                            background: edit.primaryRouteId === selectedPlayer.id
                              ? `rgba(${PALETTE.cyanRGB},0.10)`
                              : `linear-gradient(145deg, rgba(${PALETTE.cyanRGB},0.18), rgba(${PALETTE.brassRGB},0.05))`,
                            border: `1px solid rgba(${PALETTE.cyanRGB},0.40)`,
                            cursor: 'pointer',
                            fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em',
                            textTransform: 'uppercase',
                            color: edit.primaryRouteId === selectedPlayer.id ? PALETTE.textSub : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {edit.primaryRouteId === selectedPlayer.id
                            ? 'Clear Primary Read'
                            : <Shimmer accentRgb={PALETTE.cyanRGB} secondaryRgb={PALETTE.brassRGB}>Mark as Primary Read</Shimmer>}
                        </button>
                      )}
                    </>
                  ) : (
                    <div style={{
                      padding: 12, borderRadius: 10,
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px dashed ${PALETTE.border}`,
                      fontFamily: FONT.body, fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.55,
                    }}>
                      Tap a player on the field. Then drag to reposition, or tap a route preset to swap their assignment.
                    </div>
                  )}
                </div>

                {/* Route Library — categorized chips in horizontal lanes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 24, height: 1, background: `rgba(${accentRgb},0.7)`, boxShadow: `0 0 8px rgba(${accentRgb},0.5)` }} />
                    <Kicker color={PALETTE.textSub}>Route Library · {sport}</Kicker>
                    {selected?.side === 'defense' && (
                      <Kicker size={9} color={PALETTE.textFaint}>(routes apply to offense)</Kicker>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
                    {Object.entries(groupedLibrary).map(([cat, routes]) => (
                      <div key={cat} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12, alignItems: 'start' }}>
                        <Kicker size={9} color={PALETTE.textMuted}>{cat}</Kicker>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {routes.map((r) => (
                            <RouteChip
                              key={r.id}
                              route={r}
                              disabled={!selectedPlayer || selected?.side !== 'offense'}
                              onTap={() => applyRoute(r)}
                              accent={accentRgb}
                              secondary={secondaryRgb}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </HeroFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Inner SVG layer ─────────────────────────────────────────────────

function DesignerLayer({
  play, defense, width: w, height: h, selected, dragging, drawingPoints,
  onPlayerPointerDown, accentRgb, secondaryRgb, showGrid,
}: {
  play: Play
  defense: DefensiveAlignment
  width: number; height: number
  selected: { id: string; side: SelectionSide } | null
  dragging: { id: string; side: SelectionSide; pointerId: number; origin: { x: number; y: number } } | null
  drawingPoints?: { x: number; y: number }[]
  onPlayerPointerDown: (e: RPointerEvent, id: string, side: SelectionSide) => void
  accentRgb: string
  secondaryRgb: string
  showGrid?: boolean
}) {
  return (
    <g>
      <SharedChipDefs />

      {/* Snap-to-grid overlay */}
      {showGrid && (
        <g opacity={0.45}>
          {Array.from({ length: 19 }).map((_, i) => {
            const v = (i + 1) * 0.05
            return (
              <g key={`g-${i}`}>
                <line x1={v * w} x2={v * w} y1={0} y2={h}
                  stroke={`rgba(${accentRgb},0.10)`} strokeWidth={0.8} strokeDasharray="2 4" />
                <line x1={0} x2={w} y1={v * h} y2={v * h}
                  stroke={`rgba(${accentRgb},0.10)`} strokeWidth={0.8} strokeDasharray="2 4" />
              </g>
            )
          })}
        </g>
      )}
      {/* Existing offensive routes */}
      {play.offense.filter((p) =>
        p.action !== 'block' && p.position !== 'OL' && p.side === 'offense' && p.waypoints.length > 0,
      ).map((p) => {
        const d = pathToSvg(p, w, h)
        if (!d) return null
        const isSelected = selected?.id === p.id
        return (
          <g key={`r-${p.id}`}>
            {/* Aura — thicker stroke, no blur filter */}
            <path
              d={d}
              stroke={`rgba(${accentRgb},${isSelected ? 0.55 : 0.32})`}
              strokeWidth={isSelected ? 7 : 5}
              fill="none"
              strokeLinecap="round"
            />
            {/* Crisp */}
            <path
              d={d}
              stroke="url(#route-grad)"
              strokeWidth={isSelected ? 2.8 : 2}
              fill="none"
              strokeDasharray={isSelected ? '0' : '7 5'}
              strokeLinecap="round"
              opacity={isSelected ? 1 : 0.85}
            />
          </g>
        )
      })}

      {/* Live freehand stroke */}
      {drawingPoints && drawingPoints.length > 1 && (
        <>
          <polyline
            points={drawingPoints.map((p) => `${p.x * w},${(1 - p.y) * h}`).join(' ')}
            stroke={`rgba(${secondaryRgb},0.35)`}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={drawingPoints.map((p) => `${p.x * w},${(1 - p.y) * h}`).join(' ')}
            stroke={`rgba(${secondaryRgb},0.95)`}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Ghost preview at origin while dragging */}
      {dragging && (() => {
        const ox = dragging.origin.x * w
        const oy = (1 - dragging.origin.y) * h
        return (
          <g opacity={0.35}>
            <circle cx={ox} cy={oy} r={18} fill="none"
              stroke={`rgba(${dragging.side === 'offense' ? PALETTE.brassRGB : PALETTE.violetRGB},0.85)`}
              strokeWidth={1.5} strokeDasharray="3 3" />
            <circle cx={ox} cy={oy} r={3} fill={`rgba(${dragging.side === 'offense' ? PALETTE.brassRGB : PALETTE.violetRGB},0.85)`} />
          </g>
        )
      })()}

      {/* Defense players (now interactive) */}
      {defense.players.map((p) => {
        const isSel = selected?.id === p.id && selected.side === 'defense'
        const isDrag = dragging?.id === p.id && dragging.side === 'defense'
        return (
          <PlayerChip
            key={`d-${p.id}`}
            cx={p.start.x * w}
            cy={(1 - p.start.y) * h}
            label={p.label}
            position={p.position}
            side="defense"
            size={30}
            state={isDrag ? 'dragging' : isSel ? 'selected' : 'idle'}
            interactive
            onPointerDown={(e) => onPlayerPointerDown(e, p.id, 'defense')}
          />
        )
      })}

      {/* Offense players */}
      {play.offense.map((p) => {
        const isSel = selected?.id === p.id && selected.side === 'offense'
        const isDrag = dragging?.id === p.id && dragging.side === 'offense'
        return (
          <PlayerChip
            key={`o-${p.id}`}
            cx={p.start.x * w}
            cy={(1 - p.start.y) * h}
            label={p.label}
            position={p.position}
            side="offense"
            size={30}
            state={isDrag ? 'dragging' : isSel ? 'selected' : 'idle'}
            interactive
            onPointerDown={(e) => onPlayerPointerDown(e, p.id, 'offense')}
          />
        )
      })}
    </g>
  )
}

// ── Sub-components ──────────────────────────────────────────────────

function ToolRibbonButton({
  active, onClick, icon, label, shortcut, accent, secondary,
}: {
  active: boolean; onClick: () => void; icon: string; label: string; shortcut?: string; accent: string; secondary: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      title={shortcut ? `${label} (${shortcut})` : label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        borderRadius: 10,
        background: active
          ? `linear-gradient(145deg, rgba(${accent},0.22), rgba(${secondary},0.06))`
          : 'rgba(255,255,255,0.03)',
        border: active ? `1px solid rgba(${accent},0.55)` : '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        boxShadow: active ? `0 0 16px rgba(${accent},0.28)` : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <OutlineIcon name={icon} color={`rgba(${accent},${active ? 0.95 : 0.7})`} size={14} />
      <span style={{
        fontFamily: FONT.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: active ? 'transparent' : PALETTE.textSub,
      }}>
        {active ? <Shimmer accentRgb={accent} secondaryRgb={secondary}>{label}</Shimmer> : label}
      </span>
      {shortcut && (
        <span style={{
          padding: '2px 6px', borderRadius: 5,
          background: 'rgba(0,0,0,0.40)',
          fontFamily: FONT.label, fontSize: 8, fontWeight: 700, letterSpacing: '0.14em',
          color: `rgba(${accent},0.85)`,
        }}>{shortcut}</span>
      )}
    </motion.button>
  )
}

function ShortcutsPanel({ onClose, accent }: { onClose: () => void; accent: string }) {
  const items = [
    { key: 'V', label: 'Move / Select' },
    { key: 'D', label: 'Draw freehand route' },
    { key: 'O', label: 'Add offensive player' },
    { key: 'X', label: 'Add defender' },
    { key: 'E', label: 'Erase' },
    { key: 'G', label: 'Toggle snap-to-grid' },
    { key: '←/→/↑/↓', label: 'Nudge selected ±1 yard' },
    { key: 'Shift+Arrow', label: 'Nudge ±5 yards' },
    { key: '⌘Z / Ctrl+Z', label: 'Undo' },
    { key: 'Esc', label: 'Deselect' },
    { key: 'Delete', label: 'Remove selected player' },
    { key: '?', label: 'Toggle this panel' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 12, width: 360,
        padding: 16,
        borderRadius: 14,
        background: 'rgba(8,8,16,0.92)',
        border: `1px solid rgba(${accent},0.40)`,
        boxShadow: '0 16px 40px -12px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 24, height: 1, background: `rgba(${accent},0.7)`, boxShadow: `0 0 8px rgba(${accent},0.5)` }} />
        <Kicker color={PALETTE.textSub}>Keyboard Shortcuts</Kicker>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '2px 8px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            cursor: 'pointer',
            fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
            color: PALETTE.textMuted,
          }}
        >
          ESC
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it) => (
          <div key={it.key} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${PALETTE.border}`,
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
              color: `rgba(${accent},0.95)`,
              minWidth: 88, textAlign: 'center',
            }}>{it.key}</span>
            <span style={{ fontFamily: FONT.body, fontSize: 12, color: PALETTE.textSub }}>{it.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function RouteChip({
  route, disabled, onTap, accent, secondary,
}: {
  route: RouteTemplate; disabled: boolean; onTap: () => void; accent: string; secondary: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      title={route.description}
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        background: disabled ? 'rgba(255,255,255,0.02)' : `linear-gradient(145deg, rgba(${accent},0.16), rgba(${secondary},0.05))`,
        border: `1px solid rgba(${accent},${disabled ? 0.15 : 0.40})`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT.label,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: disabled ? PALETTE.textFaint : 'transparent',
        whiteSpace: 'nowrap',
      }}
    >
      {disabled ? route.label : <Shimmer accentRgb={accent} secondaryRgb={secondary}>{route.label}</Shimmer>}
    </motion.button>
  )
}

function ToolHint({ tool, hasSelection, accentRgb }: { tool: Tool; hasSelection: boolean; accentRgb: string }) {
  const hint =
    tool === 'select' ? (hasSelection ? 'Drag the player to reposition · tap a route preset to swap' : 'Tap any player to select') :
    tool === 'draw' ? (hasSelection ? 'Drag with finger or pen to draw the new route' : 'Select an offensive player first') :
    tool === 'add-offense' ? 'Tap the field to drop a new offensive player' :
    tool === 'add-defense' ? 'Tap the field to drop a new defender' :
    tool === 'erase' ? 'Tap a player to remove them' : ''
  return (
    <AnimatePresence>
      <motion.div
        key={tool + (hasSelection ? '-s' : '')}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          padding: '6px 14px', borderRadius: 999,
          background: `rgba(0,0,0,0.55)`,
          border: `1px solid rgba(${accentRgb},0.35)`,
          backdropFilter: 'blur(12px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
          fontFamily: FONT.label, fontSize: 9, fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        {hint}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────

function simplifyPoints(pts: { x: number; y: number }[], target: number): { x: number; y: number }[] {
  if (pts.length <= target) return pts
  const step = (pts.length - 1) / (target - 1)
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < target; i++) {
    const idx = Math.round(i * step)
    out.push(pts[Math.min(idx, pts.length - 1)])
  }
  return out
}

function clamp01(v: number): number {
  return Math.max(0.02, Math.min(0.98, v))
}
