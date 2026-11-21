import type { ReactNode } from 'react'
import type { NumberArtId } from '@/data'
import { cx } from '@/lib/cx'

/** Seeded PRNG so the "years" grid is identical on every load. */
function seeded(seed: number) {
  let s = seed
  return () => (s = (s * 9301 + 49297) % 233280) / 233280
}

const rnd = seeded(7)
const YEAR_CELLS = Array.from({ length: 7 * 17 }, (_, i) => ({
  x: (i % 17) * 10,
  y: Math.floor(i / 17) * 12 + 4,
  opacity: [0.15, 0.35, 0.6, 1][Math.floor(rnd() * 4)],
  order: (i % 17) * 7 + Math.floor(i / 17),
}))

const STORE_COLORS = ['#2B3BF5', '#FF5A36', '#111114', '#5E5E68']
const VOTE_HEIGHTS = [50, 72, 40, 86, 62, 30, 78, 55, 90, 46, 68, 36, 80, 58, 44, 74]
const GAUGE_R = 38
export const GAUGE_LENGTH = 2 * Math.PI * GAUGE_R

/** Inline transition-delay helper for staggered entrances. */
const delay = (ms: number) => ({ transitionDelay: `${ms}ms` })
const BOX = '[transform-box:fill-box]'

/** Each illustration animates in when its card becomes the active one (`active`). */
function Years({ active }: { active: boolean }) {
  return (
    <>
      {YEAR_CELLS.map((c, i) => (
        <rect
          key={i}
          className="transition-opacity duration-400"
          style={{ opacity: active ? c.opacity : 0.3, ...delay(c.order * 12) }}
          x={c.x}
          y={c.y}
          width="8"
          height="9"
          rx="2"
          fill="#2B3BF5"
        />
      ))}
    </>
  )
}

function Stores({ active }: { active: boolean }) {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const c = STORE_COLORS[i % 4]
        return (
          <g
            key={i}
            className={cx('transition-[translate,opacity] duration-600 ease-[cubic-bezier(.3,1.5,.5,1)]', active ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-45')}
            style={delay(i * 60)}
          >
            <g transform={`translate(${(i % 6) * 29} ${Math.floor(i / 6) * 46 + 4})`}>
              <path d="M1 12 L4 2 H22 L25 12 Z" fill={c} />
              <rect x="3" y="12" width="20" height="24" rx="2" fill="#fff" stroke={c} strokeWidth="1.4" />
              <rect x="10" y="22" width="6" height="14" fill={c} opacity=".6" />
            </g>
          </g>
        )
      })}
    </>
  )
}

function Partners({ active }: { active: boolean }) {
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => {
        const hot = i % 7 === 0
        return (
          <circle
            key={i}
            className={cx(BOX, 'origin-center transition-[scale] duration-500 ease-[cubic-bezier(.3,1.6,.5,1)]', active ? 'scale-100' : 'scale-[.55]')}
            style={delay(i * 18)}
            cx={(i % 10) * 17 + 8}
            cy={Math.floor(i / 10) * 17 + 10}
            r={hot ? 6 : 4.5}
            fill={hot ? '#FF5A36' : '#111114'}
            opacity={hot ? 1 : 0.75}
          />
        )
      })}
    </>
  )
}

const BAR = (active: boolean) =>
  cx(BOX, 'origin-bottom transition-[scale] duration-700 ease-out-expo', active ? 'scale-y-100' : 'scale-y-30')

function Votes({ active }: { active: boolean }) {
  return (
    <>
      {VOTE_HEIGHTS.map((h, i) => (
        <rect key={i} className={BAR(active)} style={delay(i * 45)} x={i * 10.6 + 1} y={90 - h} width="8" height={h} rx="2" fill={i === 8 ? '#FF5A36' : '#2B3BF5'} />
      ))}
    </>
  )
}

function Bug({ active }: { active: boolean }) {
  return (
    <>
      <rect className={BAR(active)} x="10" y="62" width="26" height="28" rx="3" fill="#111114" />
      <rect className={BAR(active)} style={delay(135)} x="52" y="6" width="26" height="84" rx="3" fill="#FF5A36" opacity=".4" />
      <path
        className={cx('[stroke-dasharray:1] transition-[stroke-dashoffset] delay-300 duration-500', active ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:.5]')}
        pathLength={1}
        d="M48 10 L82 86"
        stroke="#111114"
        strokeWidth="3"
      />
      <g className={cx(BOX, 'origin-center transition-[scale,rotate] delay-500 duration-600 ease-[cubic-bezier(.3,1.6,.5,1)]', active ? 'scale-100 rotate-0' : 'scale-60 -rotate-20')}>
        <g className={active ? 'animate-wig' : undefined} style={{ transformOrigin: '134px 50px', transformBox: 'view-box' }}>
          <g transform="translate(112 22)">
            <ellipse cx="22" cy="28" rx="15" ry="20" fill="#111114" />
            <circle cx="22" cy="6" r="8" fill="#111114" />
            <path d="M7 20 L-3 14 M7 32 L-4 32 M8 44 L-2 52 M37 20 L47 14 M37 32 L48 32 M36 44 L46 52" stroke="#111114" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 10 V48" stroke="#CFF5D6" strokeWidth="2" />
          </g>
        </g>
      </g>
    </>
  )
}

function Ecg({ active }: { active: boolean }) {
  return (
    <>
      <path d="M0 86 H172" stroke="#111114" strokeOpacity=".15" />
      <path
        className={cx(
          '[stroke-dasharray:1] transition-[stroke-dashoffset] delay-100 duration-[1600ms] ease-[cubic-bezier(.6,0,.3,1)]',
          active ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:.6]',
        )}
        pathLength={1}
        d="M0 50 H34 L42 50 L48 22 L56 80 L62 8 L70 64 L76 50 H110 L118 50 L124 30 L130 72 L136 20 L144 58 L150 50 H172"
        fill="none"
        stroke="#FF5A36"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  )
}

function Gauge({ active }: { active: boolean }) {
  return (
    <>
      <circle cx="86" cy="48" r={GAUGE_R} fill="none" stroke="#111114" strokeOpacity=".12" strokeWidth="12" />
      <circle
        className="transition-[stroke-dashoffset] delay-150 duration-[1600ms] ease-[cubic-bezier(.6,0,.2,1)]"
        cx="86"
        cy="48"
        r={GAUGE_R}
        fill="none"
        stroke="#2B3BF5"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={GAUGE_LENGTH}
        style={{ strokeDashoffset: GAUGE_LENGTH * (active ? 0.06 : 0.55) }}
        transform="rotate(-90 86 48)"
      />
      <circle
        className={cx(BOX, 'origin-center transition-[scale] duration-500 ease-[cubic-bezier(.3,1.6,.5,1)]', active ? 'scale-100' : 'scale-[.55]')}
        style={delay(360)}
        cx="86"
        cy="48"
        r="7"
        fill="#FF5A36"
      />
    </>
  )
}

const ART: Record<NumberArtId, (props: { active: boolean }) => ReactNode> = {
  years: Years,
  stores: Stores,
  partners: Partners,
  votes: Votes,
  bug: Bug,
  ecg: Ecg,
  gauge: Gauge,
}

/** Illustration for a numbers card; animations run while `active`. */
export function NumberArt({ id, active }: { id: NumberArtId; active: boolean }) {
  const Art = ART[id]
  return (
    <svg className="size-full max-h-full" viewBox="0 0 172 92" aria-hidden="true">
      <Art active={active} />
    </svg>
  )
}
