import { useState } from 'react'
import { SKILLS } from '@/data'
import { cx } from '@/lib/cx'
import { Accent, SectionHeading } from '@/components/ui/SectionHeading'

const CATEGORIES = ['All', ...Object.keys(SKILLS)]
const initials = (s: string) => s.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()

/** Filterable skill chips — non-matching chips fade back instead of disappearing. */
export function Stack() {
  const [category, setCategory] = useState('All')

  return (
    <section className="band" id="stack" aria-labelledby="stack-h" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHeading label="04 / Stack" id="stack-h">
          Tools of <Accent>the trade.</Accent>
        </SectionHeading>

        <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filter skills">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
              className="min-h-11 cursor-pointer rounded-full border border-line-2 bg-transparent px-[18px] text-[15px] font-semibold transition duration-300 hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-on-dk"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {Object.entries(SKILLS).flatMap(([cat, list]) =>
            list.map((skill) => (
              <span
                key={`${cat}-${skill}`}
                className={cx(
                  'group inline-flex min-h-[54px] items-center gap-2.5 rounded-full border border-line bg-card pr-[22px] pl-3.5 text-[clamp(16px,1.5vw,20px)] font-semibold transition duration-[450ms] ease-out-expo',
                  'hover:-translate-y-1 hover:-rotate-2 hover:bg-ink hover:text-on-dk',
                  category !== 'All' && category !== cat && 'scale-[.94] opacity-[.16] blur-[1px]',
                )}
              >
                <i className="grid size-7 place-items-center rounded-full bg-paper-2 font-mono text-[10px] font-bold not-italic transition-colors group-hover:bg-cobalt group-hover:text-white">
                  {initials(skill)}
                </i>
                {skill}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
