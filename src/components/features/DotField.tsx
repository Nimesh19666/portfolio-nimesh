import { useEffect, useRef } from 'react'
import { REDUCED_MOTION } from '@/lib/env'

interface Props {
  /** Pause drawing while offscreen. */
  running: boolean
  /** Dot colour (very light accents fall back to ink). */
  color: string
}

const LIGHT_ACCENTS = new Set(['#FFE58A', '#7BEFA2', '#FFB3CF'])
const GRID = 26

/** Canvas backdrop: a wavy dot grid that bulges away from the pointer. */
export function DotField({ running, color }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const live = useRef({ running, color })
  useEffect(() => {
    live.current = { running, color }
  })

  useEffect(() => {
    const cv = canvas.current
    const host = cv?.parentElement
    const ctx = cv?.getContext('2d')
    if (!cv || !host || !ctx) return

    const dpr = Math.min(2, devicePixelRatio || 1)
    let w = 0
    let h = 0
    let px = -999
    let py = -999
    let raf = 0

    const resize = () => {
      w = host.clientWidth
      h = host.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      px = e.clientX - r.left
      py = e.clientY - r.top
    }
    const leave = () => {
      px = py = -999
    }

    const frame = (t: number) => {
      if (live.current.running) {
        ctx.clearRect(0, 0, w, h)
        const time = t / 1000
        ctx.fillStyle = LIGHT_ACCENTS.has(live.current.color) ? '#111114' : live.current.color
        for (let y = GRID / 2; y < h; y += GRID) {
          for (let x = GRID / 2; x < w; x += GRID) {
            const wave = Math.sin(x * 0.012 + time * 1.2) * Math.cos(y * 0.015 - time * 0.9)
            const dx = x - px
            const dy = y - py
            const d = Math.hypot(dx, dy)
            const k = Math.max(0, 1 - d / 170)
            ctx.globalAlpha = 0.1 + (0.14 * (wave + 1)) / 2 + k * 0.45
            ctx.beginPath()
            ctx.arc(x + (d ? dx / d : 0) * k * 20, y + wave * 5 + (d ? dy / d : 0) * k * 20, 1.2 + (wave + 1) * 0.6 + k * 2.2, 0, 7)
            ctx.fill()
          }
        }
      }
      if (!REDUCED_MOTION) raf = requestAnimationFrame(frame)
    }

    resize()
    addEventListener('resize', resize)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-0 size-full" aria-hidden="true" />
}
