import type { ComponentType } from 'react'
import type { PosterArtId } from '@/data'

const VIEW = '0 0 270 367'

function Waves() {
  return (
    <>
      <g fill="none" stroke="#fff" strokeOpacity=".28">
        {[30, 58, 86, 114, 142, 170].map((r) => (
          <circle key={r} cx="210" cy="90" r={r} />
        ))}
      </g>
      <rect x="28" y="70" width="120" height="30" rx="15" fill="#fff" opacity=".9" />
      <rect x="92" y="112" width="132" height="30" rx="15" fill="#FF5A36" />
      <rect x="28" y="154" width="90" height="30" rx="15" fill="#fff" opacity=".9" />
      <circle cx="210" cy="90" r="9" fill="#FF5A36" />
    </>
  )
}

function Shops() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`translate(${24 + (i % 4) * 58} ${58 + Math.floor(i / 4) * 66})`}>
          <path d="M0 14 L6 0 H44 L50 14 Z" fill="#111114" opacity={i % 3 ? 0.85 : 1} />
          <rect x="3" y="14" width="44" height="40" rx="3" fill="#fff" opacity=".92" />
          <rect x="18" y="30" width="14" height="24" fill={i % 2 ? '#2B3BF5' : '#FF5A36'} opacity=".85" />
        </g>
      ))}
    </>
  )
}

function Ecg() {
  return (
    <>
      <g stroke="#fff" strokeOpacity=".07">
        {Array.from({ length: 14 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 20} 0 V367`} />
        ))}
        {Array.from({ length: 19 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 20} H270`} />
        ))}
      </g>
      <path
        d="M0 150 H50 L62 150 L72 100 L84 210 L94 60 L106 180 L114 150 H160 L170 150 L180 112 L190 196 L200 80 L212 170 L220 150 H270"
        fill="none"
        stroke="#FF5A36"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  )
}

function Browsers() {
  return (
    <>
      {[
        [24, 54, 0],
        [54, 92, 1],
        [84, 130, 2],
      ].map(([x, y, k]) => (
        <g key={k} transform={`translate(${x} ${y}) rotate(${-4 + k * 3})`}>
          <rect width="160" height="112" rx="8" fill="#fff" stroke="#111114" strokeWidth="2" />
          <path d="M0 20 H160" stroke="#111114" strokeWidth="2" />
          <circle cx="12" cy="10" r="3.5" fill="#FF5A36" />
          <circle cx="24" cy="10" r="3.5" fill="#111114" />
          <rect x="14" y="34" width={60 + k * 20} height="10" rx="3" fill="#111114" />
          <rect x="14" y="52" width="110" height="6" rx="3" fill="#111114" opacity=".3" />
          <rect x="14" y="64" width="90" height="6" rx="3" fill="#111114" opacity=".3" />
          <rect x="14" y="82" width="46" height="16" rx="8" fill="#2B3BF5" />
        </g>
      ))}
    </>
  )
}

/** Small feed-forward network diagram. */
const LAYERS: [count: number, x: number][] = [
  [3, 50],
  [5, 120],
  [5, 190],
  [2, 250],
]
const NODES = LAYERS.map(([n, x]) => Array.from({ length: n }, (_, j) => [x, 70 + (j + 0.5) * (170 / n)] as const))

function Net() {
  const flat = NODES.flat()
  return (
    <>
      {NODES.slice(0, -1).flatMap((layer, a) =>
        layer.flatMap((p, pi) =>
          NODES[a + 1].map((q, qi) => (
            <path key={`${a}-${pi}-${qi}`} d={`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`} stroke="#111114" strokeOpacity=".28" />
          )),
        ),
      )}
      {flat.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="9" fill={i === 14 || i === 13 ? '#2B3BF5' : '#111114'} />
      ))}
    </>
  )
}

const ART: Record<PosterArtId, ComponentType> = {
  waves: Waves,
  shops: Shops,
  ecg: Ecg,
  browsers: Browsers,
  net: Net,
}

/** Decorative SVG backdrop for an experience poster. */
export function PosterArt({ id }: { id: PosterArtId }) {
  const Art = ART[id]
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Art />
    </svg>
  )
}
