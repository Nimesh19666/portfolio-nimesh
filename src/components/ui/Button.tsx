import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { useMagnetic } from '@/hooks/useMagnetic'
import { ArrowUpRight } from './Icons'

type Common = {
  variant?: 'solid' | 'line'
  size?: 'md' | 'lg'
  /** Pull toward the cursor on hover (fine pointers only). */
  magnetic?: boolean
  /** Show the circular arrow badge (solid variant). */
  arrow?: ReactNode | boolean
  children: ReactNode
}
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

/** Pill button with a rotating arrow badge. Renders <a> when given an href, else <button>. */
export function Button({ variant = 'solid', size = 'md', magnetic = false, arrow = true, className, children, ...rest }: AsLink | AsButton) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  useMagnetic(ref, magnetic ? 0.22 : 0)

  const line = variant === 'line'
  const lg = size === 'lg'
  const classes = cx(
    'btn group inline-flex cursor-pointer items-center gap-3 rounded-full border-0 font-semibold whitespace-nowrap will-change-transform',
    'transition-[background,color] duration-300',
    line
      ? 'line min-h-14 bg-transparent px-[22px] text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-ink hover:text-on-dk hover:shadow-none'
      : 'bg-ink py-1.5 pr-1.5 pl-[22px] text-on-dk hover:bg-cobalt',
    lg ? 'min-h-14 text-base' : cx('text-[15px]', !line && 'min-h-12'),
    className,
  )
  const badge =
    !line && arrow !== false ? (
      <span
        className={cx(
          'arr grid place-items-center rounded-full bg-cobalt text-white transition-transform duration-[450ms] ease-out-expo group-hover:rotate-45 group-hover:bg-white group-hover:text-cobalt',
          lg ? 'size-11' : 'size-9',
        )}
      >
        {arrow === true ? <ArrowUpRight size={lg ? 16 : 14} /> : arrow}
      </span>
    ) : null

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a ref={ref} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
        {badge}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {badge}
    </button>
  )
}
