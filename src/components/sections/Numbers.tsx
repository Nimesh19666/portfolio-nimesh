import { useRef, useState } from 'react'
import { KEY_NUMBERS } from '@/data'
import { useInView } from '@/hooks/useInView'
import { Accent, SectionHeading } from '@/components/ui/SectionHeading'
import { Carousel } from '@/components/features/Carousel'
import { DotField } from '@/components/features/DotField'

export function Numbers() {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { threshold: 0.15 })
  const [active, setActive] = useState(0)

  return (
    <section ref={ref} className="relative overflow-hidden pt-[clamp(88px,10vw,140px)] pb-[clamp(70px,8vw,110px)]" id="numbers" aria-labelledby="nums-h">
      <DotField running={visible} color={KEY_NUMBERS[active].bg} />
      <div className="wrap relative z-1">
        <SectionHeading label="By the numbers" id="nums-h">
          The work, <Accent>in numbers.</Accent>
        </SectionHeading>
      </div>
      <Carousel visible={visible} onActiveChange={setActive} />
    </section>
  )
}
