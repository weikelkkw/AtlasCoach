'use client'

// ResponsiveStage — measures its container, calls render prop with the
// width/height that should be passed to the canvas. Maintains a fixed aspect
// ratio. Throttled via ResizeObserver, no rerenders during animation.

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  aspectRatio?: number   // width / height
  minHeight?: number
  maxHeight?: number
  children: (w: number, h: number) => ReactNode
}

export default function ResponsiveStage({
  aspectRatio = 1080 / 600,
  minHeight = 360,
  maxHeight = 720,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const compute = (w: number) => {
      const h = Math.max(minHeight, Math.min(maxHeight, w / aspectRatio))
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    compute(el.getBoundingClientRect().width)
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) compute(e.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [aspectRatio, minHeight, maxHeight])

  return (
    <div ref={ref} style={{ width: '100%', minWidth: 0 }}>
      {size.w > 0 ? children(size.w, size.h) : (
        // Placeholder so the layout reserves space pre-measure
        <div style={{ width: '100%', height: minHeight, opacity: 0 }} />
      )}
    </div>
  )
}
