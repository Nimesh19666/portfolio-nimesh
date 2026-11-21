import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { SITE } from '@/data'
import { cx } from '@/lib/cx'
import { drawSignature, prepareSignature } from '@/lib/signature'
import { useApp } from '@/context/AppContext'
import { useInView } from '@/hooks/useInView'
import { useFontProximity } from '@/hooks/useFontProximity'
import { useMagnetic } from '@/hooks/useMagnetic'
import { Signature } from '@/components/ui/Signature'
import { ArrowUpRight, Copy } from '@/components/ui/Icons'

const ENQUIRY_TYPES = ['Full-time role', 'Freelance project', 'Collaboration', 'Just saying hi']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** One display line, one span per letter, so each letter can react to the cursor. */
function Letters({ text, outline = false }: { text: string; outline?: boolean }) {
  return (
    <span data-line className="block whitespace-nowrap">
      {[...text].map((c, i) => (
        <span
          key={i}
          className={cx(
            'inline-block transition-[font-variation-settings] duration-250 [font-variation-settings:"wdth"_75,"wght"_700]',
            outline && 'text-transparent [-webkit-text-stroke:2px_var(--color-on-dk)]',
          )}
        >
          {c === ' ' ? '\u00a0' : c}
        </span>
      ))}
    </span>
  )
}

const LABEL = 'font-mono text-xs text-on-dk-2'
const inputClass = (invalid: boolean) =>
  cx(
    'min-h-[54px] w-full rounded-[14px] border bg-on-dk/5 px-4 py-3.5 text-base text-on-dk outline-0 transition duration-250 focus:border-cobalt focus:bg-on-dk/8',
    invalid ? 'border-[#FF9C85]' : 'border-on-dk/18',
  )
const SOCIAL =
  'inline-flex min-h-[46px] items-center gap-2 rounded-full bg-on-dk/10 px-5 text-[15px] font-semibold transition duration-300 hover:bg-on-dk hover:text-ink'
const PILL_BTN =
  'inline-flex min-h-11 cursor-pointer items-center rounded-full border border-on-dk/30 bg-transparent px-4 text-sm font-semibold text-on-dk'


interface FieldProps {
  id: string
  label: string
  error?: string
  children: ReactNode
}
function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {children}
      <span className="min-h-0 text-[13px] text-[#FF9C85]" aria-live="polite">
        {error}
      </span>
    </div>
  )
}

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

function ContactForm() {
  const { showToast } = useApp()
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  }
  const [type, setType] = useState(ENQUIRY_TYPES[0])
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ preview: string; href: string } | null>(null)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = refs.name.current!.value.trim()
    const email = refs.email.current!.value.trim()
    const message = refs.message.current!.value.trim()

    const next: Errors = {}
    if (!name) next.name = 'Please add your name.'
    if (!EMAIL_RE.test(email)) next.email = 'Please add a valid email.'
    if (message.length < 10) next.message = 'A few more words, please (10+ characters).'
    setErrors(next)
    const firstBad = (['name', 'email', 'message'] as const).find((k) => next[k])
    if (firstBad) {
      refs[firstBad].current?.focus()
      return
    }

    const subject = `[Portfolio] ${type} — ${name}`
    const body = `${message}\n\n— ${name}\n${email}`
    const href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent({ href, preview: `To: ${SITE.email}\nSubject: ${subject}\n\n${body}` })
    window.location.href = href
  }

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(sent?.preview ?? '')
      showToast('Message copied')
    } catch {
      showToast('Select the message text to copy it')
    }
  }

  return (
    <form className="grid gap-3.5" noValidate onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        <Field id="cName" label="Your name" error={errors.name}>
          <input ref={refs.name} className={inputClass(!!errors.name)} id="cName" name="name" type="text" autoComplete="name" required />
        </Field>
        <Field id="cEmail" label="Your email" error={errors.email}>
          <input ref={refs.email} className={inputClass(!!errors.email)} id="cEmail" name="email" type="email" autoComplete="email" required />
        </Field>
      </div>

      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className={`mb-2 p-0 ${LABEL}`}>What’s this about?</legend>
        <div className="flex flex-wrap gap-2">
          {ENQUIRY_TYPES.map((t) => (
            <label key={t} className="relative">
              <input className="peer absolute size-px opacity-0" type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />
              <span className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-on-dk/22 px-4 text-sm font-semibold text-on-dk transition duration-250 peer-checked:border-on-dk peer-checked:bg-on-dk peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="cMsg" label="Message" error={errors.message}>
        <textarea ref={refs.message} className={`${inputClass(!!errors.message)} min-h-[130px] resize-y font-[inherit]`} id="cMsg" name="message" required placeholder="Tell me a little about the role or project…" />
      </Field>

      <button
        className="inline-flex min-h-14 cursor-pointer items-center gap-3 justify-self-start rounded-full border-0 bg-cobalt py-1.5 pr-1.5 pl-6 text-base font-semibold text-white"
        type="submit"
      >
        Compose email
        <span className="grid size-11 place-items-center rounded-full bg-white text-cobalt">
          <ArrowUpRight size={16} />
        </span>
      </button>

      <div className={cx('flex-col gap-3 rounded-[18px] border border-on-dk/16 bg-on-dk/6 p-[18px]', sent ? 'flex' : 'hidden')} role="status">
        <span>
          Your email app should open with this message ready to send. If it didn’t, copy it and email <b>{SITE.email}</b>.
        </span>
        <pre className="m-0 max-h-40 overflow-auto font-mono text-[13px] leading-normal whitespace-pre-wrap text-on-dk-2">{sent?.preview}</pre>
        <div className="flex flex-wrap gap-2">
          <button className={PILL_BTN} type="button" onClick={copyMessage}>
            Copy message
          </button>
          <a className={PILL_BTN} href={sent?.href ?? `mailto:${SITE.email}`}>Open email app</a>
        </div>
      </div>
    </form>
  )
}

function SignatureFooter() {
  const ref = useRef<SVGSVGElement>(null)
  const seen = useInView(ref, { once: true, threshold: 0.5 })

  useLayoutEffect(() => {
    if (ref.current) prepareSignature(ref.current)
  }, [])
  useEffect(() => {
    if (seen && ref.current) return drawSignature(ref.current, 1800)
  }, [seen])

  return (
    <div className="mt-[clamp(64px,9vw,120px)] flex flex-wrap items-end justify-between gap-6 text-on-dk">
      <Signature ref={ref} className="w-[min(520px,80vw)]" stroke="stroke-9" label="Nimesh Gujari signature" />
      <span className={LABEL}>Thanks for scrolling all the way down.</span>
    </div>
  )
}

export function Contact() {
  const { copyEmail, openGame } = useApp()
  const headline = useRef<HTMLHeadingElement>(null)
  const magnet = useRef<HTMLAnchorElement>(null)
  const [copied, setCopied] = useState(false)

  useFontProximity(headline, headline, '[data-line] > span', { radius: 300, base: { wdth: 75, wght: 700 }, delta: { wdth: 50, wght: 200 } })
  useMagnetic(magnet, 0.4, 'span')

  const copy = async () => {
    if (await copyEmail()) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <section className="band overflow-hidden rounded-t-[clamp(26px,3vw,44px)] bg-dk text-on-dk" id="contact" aria-labelledby="c-h">
      <div className="wrap">
        <span className={LABEL}>06 / Contact</span>
        <h2
          ref={headline}
          className="mt-7 mb-14 font-display text-[clamp(64px,13.5vw,230px)] leading-[.84] tracking-[-.025em] uppercase select-none max-sm:text-[17vw]"
          id="c-h"
          aria-label="Let’s build something"
        >
          <Letters text="Let’s build" />
          <Letters text="something" outline />
        </h2>

        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] items-start gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
          <ContactForm />

          <div className="flex flex-col gap-7">
            <div className="mb-[26px] flex flex-wrap items-center gap-3.5">
              <a
                className="border-b-2 border-on-dk/35 pb-1 font-display text-[clamp(22px,2.8vw,40px)] font-semibold transition-colors duration-300 wdth-90 hover:border-cobalt"
                href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              <button
                type="button"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-on-dk/40 bg-transparent px-[18px] text-sm font-semibold text-on-dk transition duration-300 hover:bg-on-dk hover:text-ink"
                onClick={copy}
              >
                <Copy size={15} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className={SOCIAL} href={SITE.github} target="_blank" rel="noopener">
                GitHub ↗
              </a>
              <a className={SOCIAL} href={SITE.linkedin} target="_blank" rel="noopener">
                LinkedIn ↗
              </a>
              <a className={SOCIAL} href={SITE.phoneHref}>{SITE.phone}</a>
            </div>
            <a
              ref={magnet}
              className="grid aspect-square w-[clamp(160px,15vw,210px)] cursor-pointer place-items-center rounded-full bg-cobalt text-center font-sans text-[17px] font-bold text-white transition-transform duration-500 ease-out-expo will-change-transform"
              href={`mailto:${SITE.email}`}
            >
              <span className="flex flex-col items-center gap-2 transition-transform duration-500 ease-out-expo">
                <ArrowUpRight size={28} />
                Say hello
              </span>
            </a>
            <button
              className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 self-start rounded-full border border-dashed border-on-dk/35 bg-transparent px-[18px] font-mono text-[13px] font-medium text-on-dk hover:border-solid hover:bg-on-dk/8"
              type="button" onClick={openGame}>
              ▶ Bored? Play Commit Snake
            </button>
          </div>
        </div>

        <SignatureFooter />
        <div className={`mt-10 flex flex-wrap justify-between gap-3 border-t border-on-dk/16 pt-[22px] pb-7 ${LABEL}`}>
          <span>© 2026 {SITE.name}</span>
          <span>Designed &amp; built one commit at a time</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </section>
  )
}

