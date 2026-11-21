import { useEffect, useRef, useState, type MouseEvent } from "react";
import { SITE } from "@/data";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/env";
import { cx } from "@/lib/cx";
import { useFontProximity } from "@/hooks/useFontProximity";
import { Button } from "@/components/ui/Button";
import { CodeWindow } from "@/components/features/CodeWindow";
import { FloatingChips } from "@/components/features/FloatingChips";

/** Entrance: fades up once the preloader has lifted (`.loaded` is set on the app root). */
const FADE =
  "translate-y-[18px] opacity-0 transition-[opacity,translate] duration-900 ease-out-expo in-[.loaded]:translate-y-0 in-[.loaded]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";
/** Headline lines slide up out of a mask. */
const LINE_IN =
  "inline-block translate-y-[105%] transition-[translate] duration-1100 ease-out-expo in-[.loaded]:translate-y-0 motion-reduce:translate-y-0";

/** One headline line, split into per-letter spans so the cursor can morph the variable font. */
function SplitLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[.05em]">
      <span className={LINE_IN} style={{ transitionDelay: `${delay}s` }}>
        {text.split(" ").map((word, wi, words) => (
          <span key={wi}>
            <span style={{ whiteSpace: "nowrap" }}>
              {[...word].map((c, ci) => (
                <span
                  key={ci}
                  className="inline-block transition-[font-variation-settings] duration-300 [font-variation-settings:'wdth'_74,'wght'_800]"
                >
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}

function useLocalTime() {
  const read = () => {
    try {
      return new Date().toLocaleTimeString("en-GB", {
        timeZone: SITE.timeZone,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };
  const [time, setTime] = useState(read);
  useEffect(() => {
    const id = window.setInterval(() => setTime(read()), 10_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

const FACTS: { label: string; value: string }[] = [
  { label: "Now", value: "Full Stack Developer @ ET Edge" },
  { label: "Previously", value: "Kayana World · Acuradyne" },
  { label: "Experience", value: "2.9 years · 4 teams" },
];

/** `loaded` flips true once the preloader curtain lifts; it drives the entrance animations. */
export function Hero({ loaded }: { loaded: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const visRef = useRef<HTMLDivElement>(null);
  const time = useLocalTime();

  useFontProximity(headlineRef, heroRef, ".ch", {
    radius: 260,
    base: { wdth: 74, wght: 800 },
    delta: { wdth: 36, wght: -600 },
  });

  // parallax-tilt the code window toward the cursor
  const tilt = (e: MouseEvent) => {
    if (!FINE_POINTER || REDUCED_MOTION || !codeRef.current) return;
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    codeRef.current.style.setProperty("--ry", `${-6 + nx * 12}deg`);
    codeRef.current.style.setProperty("--rx", `${4 - ny * 10}deg`);
  };
  const untilt = () => {
    codeRef.current?.style.removeProperty("--ry");
    codeRef.current?.style.removeProperty("--rx");
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-svh flex-col overflow-hidden"
      id="top"
      aria-label="Introduction"
      onMouseMove={tilt}
      onMouseLeave={untilt}
    >
      <div className="wrap flex flex-1 flex-col">
        <div
          className={`mono flex flex-wrap justify-between gap-3 pt-28 max-sm:pt-[100px] ${FADE}`}
          style={{ transitionDelay: ".1s" }}
        >
          <span>Portfolio ©2026 Full Stack Developer</span>
          <span>Mumbai, India 19.07°N 72.87°E</span>
        </div>

        <div className="grid flex-1 grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] items-center gap-[clamp(24px,4vw,64px)] py-[clamp(28px,4vh,48px)] max-[900px]:grid-cols-[minmax(0,1fr)] max-[900px]:gap-10">
          <div>
            <span
              className={`mb-[22px] inline-flex items-center gap-2.5 rounded-full bg-ink py-2 pr-4 pl-3 text-sm font-medium text-on-dk ${FADE}`}
              style={{ transitionDelay: ".15s" }}
            >
              <span className="size-2 animate-pulse-dot rounded-full bg-[#3BE37A]" />
              Available for full-time &amp; freelance work
            </span>
            <h1
              ref={headlineRef}
              className="mb-[26px] font-display text-[clamp(50px,6.6vw,112px)] leading-[.88] tracking-[-.02em] uppercase"
              aria-label="Building digital products, one commit at a time."
            >
              <SplitLine text="Building digital" delay={0.2} />
              <SplitLine text="products," delay={0.3} />
              <span className="block overflow-hidden pb-[.05em]">
                <span
                  className={`${LINE_IN} text-[.92em] font-light tracking-[-.035em] text-cobalt normal-case italic wdth-100`}
                  style={{ transitionDelay: ".42s" }}
                >
                  one commit at a time.
                </span>
              </span>
            </h1>
            <p
              className={`mb-[30px] max-w-[540px] text-lg text-ink-2 ${FADE}`}
              style={{ transitionDelay: ".7s" }}
            >
              I’m{" "}
              <strong className="font-semibold text-ink">{SITE.name}</strong>, a
              full stack developer with 2.9 years of shipping production web
              apps end-to-end with React, Next.js, Node.js, TypeScript and
              PostgreSQL real-time systems, secure auth, and a multi-tenant
              platform running 20+ live storefronts.
            </p>
            <div
              className={`flex flex-wrap gap-2.5 ${FADE}`}
              style={{ transitionDelay: ".85s" }}
            >
              <Button
                href="#work"
                size="lg"
                magnetic
                className="max-sm:flex-[1_1_100%] max-sm:justify-between"
              >
                See my work
              </Button>
              <Button
                href="#resume"
                variant="line"
                magnetic
                className="max-sm:flex-[1_1_100%] max-sm:justify-center"
              >
                Download résumé ↓
              </Button>
            </div>
          </div>

          <div
            ref={visRef}
            className={`relative h-[min(560px,62vh)] min-h-[440px] max-[900px]:h-[420px] max-[900px]:min-h-0 ${FADE}`}
            style={{ transitionDelay: ".6s" }}
          >
            <CodeWindow ref={codeRef} active={loaded} />
            <FloatingChips bounds={visRef} />
            <span
              className={`absolute right-0 -bottom-1.5 flex items-center gap-2 text-sm font-medium text-muted italic max-sm:hidden ${FADE}`}
              style={{ transitionDelay: "1.4s" }}
              aria-hidden="true"
            >
              ↖ drag the chips around
            </span>
          </div>
        </div>

        <div
          className={`mb-2 grid grid-cols-4 border-t border-line-2 max-[900px]:grid-cols-2 ${FADE}`}
          style={{ transitionDelay: "1s" }}
        >
          {[...FACTS, { label: "Local time", value: `${time} IST` }].map(
            (f, i) => (
              <div
                key={f.label}
                className={cx(
                  "flex flex-col gap-1 pt-4 pr-4 pb-5",
                  i > 0 && "border-l border-line-2 pl-4",
                  i === 2 && "max-[900px]:border-l-0 max-[900px]:pl-0",
                  i >= 2 && "max-[900px]:border-t max-[900px]:border-line-2",
                )}
              >
                <span className="mono">{f.label}</span>
                <b className="text-[15px] font-semibold">{f.value}</b>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
