import { Fragment, type ReactNode } from "react";
import type { CoverId } from "@/data";
import { cx } from "@/lib/cx";

const SCORES: [name: string, score: number, lead?: boolean][] = [
  ["Nominee A", 92, true],
  ["Nominee B", 88],
  ["Nominee C", 74],
  ["Nominee D", 61],
];

const VOUCHERS: [label: string, pill: keyof typeof PILL, status: string][] = [
  ["Crew attendance", "ok", "approved"],
  ["Vehicles · 6 cars", "re", "recheck"],
  ["Cash voucher #218", "no", "rejected"],
];
const PILL = {
  ok: "bg-[#DDF7E6] text-[#0F6B33]",
  no: "bg-[#FFE1D9] text-[#A1290E]",
  re: "bg-[#E3E6FF] text-[#1D2AB8]",
};

const PIPELINE = ["discover", "analyze", "generate", "upload"];
const TENANT_COLORS = [
  "#2B3BF5",
  "#FF5A36",
  "#111114",
  "#9AA3FF",
  "#FFB199",
  "#5E5E68",
];
const ECG_PATH =
  "M0 70 H60 L72 70 L80 40 L88 96 L96 20 L106 80 L114 70 H180 L192 70 L200 40 L208 96 L216 20 L226 80 L234 70 H300 L312 70 L320 40 L328 96 L336 20 L346 80 L354 70 H400";

const LABEL = "font-mono text-[11px] opacity-70";
const BUBBLE =
  "max-w-[72%] rounded-[15px] bg-white/10 px-[13px] py-[9px] text-[13px] leading-[1.35]";

/** Surface colour + layout for each cover's root element. */
const ROOT: Record<CoverId, string> = {
  chat: "bg-[#1E1E25] text-on-dk gap-[9px]",
  jury: "bg-cobalt text-white justify-center gap-[13px]",
  artha: "bg-paper-2 text-ink gap-[9px]",
  shorts: "bg-[#1E1E25] text-on-dk justify-between gap-[9px]",
  tenants: "bg-paper-2 text-ink gap-[9px]",
  ecg: "bg-[#1E1E25] text-on-dk gap-[9px]",
};

const COVERS: Record<CoverId, () => ReactNode> = {
  chat: () => (
    <>
      <span className={LABEL}>ILC · CEO chat</span>
      <div className={cx(BUBBLE, "self-start rounded-bl-[4px]")}>
        Great session today sharing the deck.
      </div>
      <div
        className={cx(BUBBLE, "self-end rounded-br-[4px] bg-cobalt text-white")}
      >
        Thanks! Uploading the board notes now.
      </div>
      <div className={cx(BUBBLE, "self-start rounded-bl-[4px]")}>
        Attachment · board-notes.pdf
      </div>
      <div className="flex gap-1 self-start rounded-[15px] bg-white/10 px-[13px] py-[11px]">
        {[0, 0.2, 0.4].map((delay) => (
          <i
            key={delay}
            className="size-1.5 animate-typing rounded-full bg-current"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <div className="mt-auto w-[210px] self-end rounded-[13px] bg-paper px-[13px] py-[11px] text-xs text-ink">
        <b>New message</b> · Member, ILC
        <div className="mt-[7px] h-[3px] overflow-hidden rounded-[3px] bg-ink/12">
          <i className="block h-full origin-left animate-timer bg-coral" />
        </div>
      </div>
    </>
  ),
  jury: () => (
    <>
      <span className={LABEL}>Live jury scoring · unit 07 / 16</span>
      {SCORES.map(([name, score, lead]) => (
        <div
          key={name}
          className="flex items-center gap-2.5 font-mono text-[11px]"
        >
          <span style={{ width: 74 }}>{name}</span>
          <span className="h-3 flex-1 overflow-hidden rounded-md bg-white/22">
            <i
              className={cx(
                "block h-full rounded-md",
                lead ? "bg-coral" : "bg-white",
              )}
              style={{ width: `${score}%` }}
            />
          </span>
          <span>{score}</span>
        </div>
      ))}
      <span className={LABEL}>Tie detection clear</span>
    </>
  ),
  artha: () => (
    <>
      <span className={LABEL}>Shoot day 14 · vouchers</span>
      <div className="flex flex-col gap-[7px]">
        {VOUCHERS.map(([label, pill, status]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-[9px] text-xs"
          >
            <b className="font-semibold">{label}</b>
            <span
              className={cx(
                "rounded-full px-[9px] py-[3px] font-mono text-[10.5px] whitespace-nowrap",
                PILL[pill],
              )}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
      <span className="inline-flex items-center gap-[7px] self-start rounded-full bg-ink px-[11px] py-[5px] font-mono text-[11px] text-on-dk">
        <i className="size-[7px] rounded-full bg-[#F4D58D]" />
        offline will sync
      </span>
    </>
  ),
  shorts: () => (
    <>
      <span className={LABEL}>pipeline · every 6 h</span>
      <div className="flex flex-1 items-center gap-1.5">
        {PIPELINE.map((step, i) => (
          <Fragment key={step}>
            {i > 0 && <span className="text-xs opacity-50">→</span>}
            <div className="flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-white/8 px-1 py-3 text-center font-mono text-[10.5px]">
              <b
                className={cx(
                  "grid size-[26px] place-items-center rounded-full text-[11px] text-white",
                  i === 3 ? "bg-coral" : "bg-cobalt",
                )}
              >
                {i + 1}
              </b>
              {step}
            </div>
          </Fragment>
        ))}
      </div>
      <span className={LABEL}>1080×1920 · 45–60 s</span>
    </>
  ),
  tenants: () => (
    <>
      <span className={LABEL}>One codebase → many brands</span>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {TENANT_COLORS.map((c, i) => (
          <div
            key={c}
            className="flex flex-col justify-between rounded-xl bg-card p-[9px] font-mono text-[10px]"
          >
            <i
              className="block h-[26px] rounded-[7px]"
              style={{ background: c }}
            />
            <span>store-0{i + 1}</span>
          </div>
        ))}
      </div>
    </>
  ),
  ecg: () => (
    <>
      <span className={LABEL}>Cardiac signal · live</span>
      <svg
        className="w-full flex-1"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="animate-draw-ecg [stroke-dasharray:900] [stroke-dashoffset:900]"
          d={ECG_PATH}
          fill="none"
          stroke="#FF5A36"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    </>
  ),
};

/**
 * Illustrated stand-in for a project screenshot. It fills its (relatively positioned) parent;
 * pass padding and any extra effects via `className`.
 */
export function ProjectCover({
  id,
  className,
}: {
  id: CoverId;
  className?: string;
}) {
  return (
    <div className={cx("absolute inset-0 flex flex-col", ROOT[id], className)}>
      {COVERS[id]()}
    </div>
  );
}
