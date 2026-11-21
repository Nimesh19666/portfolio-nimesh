/** Fixed film-grain overlay. */
export function Grain() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-90 h-full w-full opacity-5 mix-blend-multiply" aria-hidden="true">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}
