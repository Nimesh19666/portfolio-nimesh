import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 18, children, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowUpRight = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Icon>
)
export const ArrowUp = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </Icon>
)
export const Plus = (p: IconProps) => (
  <Icon strokeWidth={2.4} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)
export const Menu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
  </Icon>
)
export const Search = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)
export const Copy = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Icon>
)
