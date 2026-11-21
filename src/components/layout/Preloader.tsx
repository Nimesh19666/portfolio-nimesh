import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { drawSignature } from "@/lib/signature";
import { Signature } from "@/components/ui/Signature";

interface Props {
  /** Curtain starts lifting  reveal the page. */
  onReveal: () => void;
  /** Curtain finished  unmount me. */
  onGone: () => void;
}

/** Full-screen intro: the signature draws itself, then the curtain wipes up. */
export function Preloader({ onReveal, onGone }: Props) {
  const sig = useRef<SVGSVGElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const timers = useRef<number[]>([]);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setDone(true);
    timers.current.push(
      window.setTimeout(onReveal, 200),
      window.setTimeout(onGone, 1300),
    );
  }, [onReveal, onGone]);

  useEffect(() => {
    // percentage counter
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 2600);
      if (counter.current)
        counter.current.textContent = String(Math.round(k * 100)).padStart(
          3,
          "0",
        );
      if (k < 1 && !started.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // signature
    const cancel = sig.current
      ? drawSignature(sig.current, 2000, () =>
          timers.current.push(window.setTimeout(start, 650)),
        )
      : () => {};

    return () => {
      cancelAnimationFrame(raf);
      cancel();
    };
  }, [start]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(window.clearTimeout);
  }, []);

  return (
    <div
      className={cx(
        "fixed inset-0 z-200 flex flex-col items-center justify-center gap-7 bg-dk p-6 text-on-dk transition-[clip-path] duration-1100 ease-[cubic-bezier(.8,0,.2,1)] motion-reduce:hidden",
        done ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]",
      )}
      aria-hidden="true"
    >
      <Signature ref={sig} flourish className="w-[min(760px,88vw)]" />
      <div className="flex w-[min(760px,88vw)] justify-between font-mono text-xs text-on-dk-2">
        <span>Full Stack Developer</span>
        <span ref={counter}>000</span>
        <span>Mumbai, India</span>
      </div>
      <button
        className="absolute right-6 bottom-6 min-h-11 cursor-pointer rounded-full border border-on-dk/30 bg-transparent px-[18px] font-mono text-[13px] font-medium text-on-dk"
        type="button"
        onClick={start}
      >
        Skip intro
      </button>
    </div>
  );
}
