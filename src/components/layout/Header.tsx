import { useEffect, useRef, useState } from "react";
import { MENU_LINKS, NAV_LINKS } from "@/data";
import { REDUCED_MOTION } from "@/lib/env";
import { cx } from "@/lib/cx";
import { useScrollListener } from "@/hooks/useScrollListener";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { ICON_BTN } from "@/components/ui/classes";
import { Close, Menu } from "@/components/ui/Icons";

const SCRAMBLE = "!<>-_\\/[]{}=+*^?#01";

/** Nav link whose letters scramble on hover. */
function ScrambleLink({
  id,
  label,
  active,
}: {
  id: string;
  label: string;
  active: boolean;
}) {
  const [text, setText] = useState(label);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const scramble = () => {
    if (REDUCED_MOTION) return;
    cancelAnimationFrame(raf.current);
    let f = 0;
    const run = () => {
      setText(
        [...label]
          .map((c, i) =>
            i < f / 2
              ? c
              : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)],
          )
          .join(""),
      );
      f++;
      if (f / 2 < label.length) raf.current = requestAnimationFrame(run);
      else setText(label);
    };
    run();
  };

  return (
    <a
      href={`#${id}`}
      onMouseEnter={scramble}
      aria-label={label}
      className={cx(
        "relative rounded-full px-4 py-[11px] text-[15px] font-medium transition-colors duration-250 hover:bg-ink/6",
        active &&
          "after:absolute after:bottom-[5px] after:left-1/2 after:-ml-[2.5px] after:size-[5px] after:rounded-full after:bg-cobalt after:content-['']",
      )}
    >
      {text}
    </a>
  );
}

interface Props {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Header({ menuOpen, setMenuOpen }: Props) {
  const { openPalette } = useApp();
  const [activeIndex, setActiveIndex] = useState(-1);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // scroll-spy: highlight the section crossing 40% of the viewport
  useScrollListener(() => {
    let on = -1;
    NAV_LINKS.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.4 && r.bottom > innerHeight * 0.4) on = i;
    });
    setActiveIndex(on);
  });

  // move focus into the menu on open and back to the opener on close
  useEffect(() => {
    if (menuOpen) {
      const t = window.setTimeout(() => closeRef.current?.focus(), 300);
      wasOpen.current = true;
      return () => window.clearTimeout(t);
    }
    if (wasOpen.current) {
      openerRef.current?.focus();
      wasOpen.current = false;
    }
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-60 pt-4">
        <div className="wrap">
          <nav
            className="flex items-center justify-between gap-3 rounded-full border border-line bg-white/78 p-1.5 shadow-[0_12px_30px_-18px_var(--color-shadow)] backdrop-blur-[14px] backdrop-saturate-[1.4]"
            aria-label="Primary"
          >
            <a
              className="flex min-h-11 items-center gap-2.5 pr-2 text-[15px] font-semibold"
              href="#top"
              aria-label="Nimesh Gujari  back to top"
            >
              <i className="grid size-[42px] place-items-center rounded-full bg-ink font-display text-[15px] font-extrabold text-on-dk not-italic wdth-110">
                NG
              </i>
              <span className="max-sm:hidden">Nimesh Gujari</span>
            </a>
            <div className="flex gap-0.5 max-[1100px]:hidden">
              {NAV_LINKS.map(({ id, label }, i) => (
                <ScrambleLink
                  key={id}
                  id={id}
                  label={label}
                  active={i === activeIndex}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-2 bg-transparent pr-3 pl-3.5 text-sm font-medium text-ink-2 max-[900px]:hidden"
                type="button"
                aria-label="Open command menu"
                onClick={openPalette}
              >
                Search{" "}
                <kbd className="rounded-md bg-paper-2 px-[7px] py-[3px] font-mono text-[11px] font-medium text-ink">
                  ⌘K
                </kbd>
              </button>
              <Button
                href="#contact"
                magnetic
                className="max-sm:pl-4 max-sm:text-sm"
              >
                Let’s talk
              </Button>
              <button
                ref={openerRef}
                className={`${ICON_BTN} hidden max-[1100px]:grid`}
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="sheet"
                onClick={() => setMenuOpen(true)}
              >
                <Menu />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        className={cx(
          "fixed inset-0 z-70 flex flex-col gap-1 bg-dk p-5 text-on-dk transition-[clip-path] duration-800 ease-[cubic-bezier(.7,0,.2,1)]",
          menuOpen
            ? "visible [clip-path:circle(150%_at_calc(100%-44px)_44px)]"
            : "invisible [clip-path:circle(0_at_calc(100%-44px)_44px)]",
        )}
        id="sheet"
        aria-hidden={!menuOpen}
      >
        <div className="mb-7 flex items-center justify-between">
          <span className="font-mono text-xs text-on-dk-2">Menu</span>
          <button
            ref={closeRef}
            className={`${ICON_BTN} grid border-on-dk/30 text-on-dk`}
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <Close />
          </button>
        </div>
        {MENU_LINKS.map(({ id, label }, i) => (
          <a
            key={id}
            className="flex items-baseline justify-between border-b border-on-dk/16 py-2.5 font-display text-[clamp(52px,15vw,96px)] leading-none font-extrabold uppercase wdth-75"
            href={`#${id}`}
            tabIndex={menuOpen ? 0 : -1}
          >
            {label}
            <small className="font-mono text-xs font-normal text-on-dk-2">
              {String(i + 1).padStart(2, "0")}
            </small>
          </a>
        ))}
      </div>
    </>
  );
}
