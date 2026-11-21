import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

/** Italic cobalt accent used inside big headings: `<h2>Hello, <em className={ACCENT}>…`. */
export const ACCENT = 'font-light text-cobalt italic normal-case tracking-[-.03em] wdth-100'

interface Props {
  /** e.g. "01 / About" */
  label: string
  id: string
  children: ReactNode
}

/** Numbered section title; wrap the accent word in <Accent>. */
export function SectionHeading({ label, id, children }: Props) {
  return (
    <Reveal className="mb-[clamp(44px,6vw,80px)] grid grid-cols-[minmax(0,1fr)] items-start gap-4">
      <span className="mono flex items-center gap-2.5">
        <i className="size-[9px] rounded-full bg-cobalt" />
        {label}
      </span>
      <h2 id={id} className="m-0 font-display text-[clamp(48px,7.4vw,124px)] leading-[.88] font-extrabold tracking-[-.02em] uppercase wdth-78">
        {children}
      </h2>
    </Reveal>
  )
}

export const Accent = ({ children }: { children: ReactNode }) => <em className={ACCENT}>{children}</em>
