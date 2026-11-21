import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import {
  CELL,
  COLS,
  ROWS,
  createGame,
  tick,
  turn,
  type SnakeState,
} from "@/lib/snake";
import { cx } from "@/lib/cx";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ICON_BTN } from "@/components/ui/classes";
import { Close } from "@/components/ui/Icons";

type Phase = "idle" | "playing" | "paused" | "over";

const KEY_DIRS: Record<string, [number, number]> = {
  arrowup: [0, -1],
  w: [0, -1],
  arrowdown: [0, 1],
  s: [0, 1],
  arrowleft: [-1, 0],
  a: [-1, 0],
  arrowright: [1, 0],
  d: [1, 0],
};

const PAD: {
  cls: string;
  label: string;
  glyph: string;
  dir: [number, number];
}[] = [
  { cls: "col-start-2", label: "Up", glyph: "↑", dir: [0, -1] },
  { cls: "col-start-1 row-start-2", label: "Left", glyph: "←", dir: [-1, 0] },
  { cls: "col-start-2 row-start-2", label: "Down", glyph: "↓", dir: [0, 1] },
  { cls: "col-start-3 row-start-2", label: "Right", glyph: "→", dir: [1, 0] },
];

function draw(ctx: CanvasRenderingContext2D, g: SnakeState) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = "#1B1B21";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(244,242,238,.07)";
  for (let x = 0; x < COLS; x++)
    for (let y = 0; y < ROWS; y++)
      ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

  const [label, color] = g.food.kind;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    g.food.x * CELL + CELL / 2,
    g.food.y * CELL + CELL / 2,
    CELL / 2 - 2,
    0,
    7,
  );
  ctx.fill();
  ctx.fillStyle = "#111114";
  ctx.font = "600 8px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    label.slice(0, 2),
    g.food.x * CELL + CELL / 2,
    g.food.y * CELL + CELL / 2 + 0.5,
  );

  g.snake.forEach((s, i) => {
    ctx.fillStyle =
      i === 0 ? "#FF5A36" : `rgba(43,59,245,${1 - i / (g.snake.length * 1.6)})`;
    const pad = i === 0 ? 1 : 2;
    ctx.beginPath();
    if (ctx.roundRect)
      ctx.roundRect(
        s.x * CELL + pad,
        s.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        5,
      );
    else
      ctx.rect(
        s.x * CELL + pad,
        s.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
      );
    ctx.fill();
  });
}

interface Props {
  open: boolean;
  onClose: () => void;
}

/** "Commit Snake": eat tech logos, walls wrap, only biting yourself ends the run. */
export function SnakeGame({ open, onClose }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const startBtn = useRef<HTMLButtonElement>(null);
  const game = useRef<SnakeState>(createGame());
  const timer = useRef(0);
  const touch = useRef({ x: 0, y: 0 });

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [ate, setAte] = useState("");
  const [best, setBest] = useLocalStorage<number>("ng-snake", 0);

  const render = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx) draw(ctx, game.current);
  }, []);

  const stopTimer = () => window.clearInterval(timer.current);

  const over = useCallback(() => {
    stopTimer();
    const final = game.current.score;
    setScore(final);
    setBest((b) => Math.max(b, final));
    setPhase("over");
  }, [setBest]);

  const run = useCallback(() => {
    stopTimer();
    const step = () => {
      const g = game.current;
      const prevSpeed = g.speed;
      const { dead, ate: food } = tick(g);
      if (dead) return over();
      if (food) {
        setScore(g.score);
        setAte(`+ ${food[0]}`);
        if (g.speed !== prevSpeed) run(); // speed up: restart the interval at the new rate
      }
      render();
    };
    timer.current = window.setInterval(step, game.current.speed);
  }, [over, render]);

  const start = useCallback(() => {
    game.current = createGame();
    setScore(0);
    setAte("");
    setPhase("playing");
    render();
    run();
  }, [render, run]);

  const togglePause = useCallback(() => {
    setPhase((p) => {
      if (p === "playing") {
        stopTimer();
        return "paused";
      }
      if (p === "paused") {
        run();
        return "playing";
      }
      return p;
    });
  }, [run]);

  // reset whenever the dialog opens; always stop the loop when it closes
  useEffect(() => {
    if (!open) {
      stopTimer();
      return;
    }
    game.current = createGame();
    setScore(0);
    setAte("");
    setPhase("idle");
    render();
    const t = window.setTimeout(() => startBtn.current?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      stopTimer();
    };
  }, [open, render]);

  // keyboard (capture so Esc doesn't also hit the global handler)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const dir = KEY_DIRS[k];
      if (dir) {
        e.preventDefault();
        if (phase === "idle") start();
        turn(game.current, dir[0], dir[1]);
      } else if (k === " ") {
        e.preventDefault();
        if (phase === "playing" || phase === "paused") togglePause();
        else start();
      } else if (k === "escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, phase, start, togglePause, onClose]);

  // refocus the button whenever the overlay message changes
  useEffect(() => {
    if (open && phase === "over") startBtn.current?.focus();
  }, [open, phase]);

  const swipeEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(game.current, Math.sign(dx), 0);
    else turn(game.current, 0, Math.sign(dy));
  };

  const message = {
    idle: {
      title: "Ship the stack",
      sub: "Eat tech to grow. Walls wrap around  only biting yourself ends the run. Arrow keys / WASD, or swipe. Space to pause.",
      cta: "Start game",
    },
    paused: { title: "Paused", sub: "Press space to resume.", cta: "Resume" },
    over: {
      title: "Build failed",
      sub: `You shipped ${score / 10} commit${score === 10 ? "" : "s"}. Score ${score}.`,
      cta: "Play again",
    },
    playing: null,
  }[phase];

  return (
    <div
      className={cx(
        "fixed inset-0 z-130 flex items-center justify-center bg-ink/72 p-4 backdrop-blur-[8px] transition-opacity duration-300",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex w-[min(560px,100%)] flex-col gap-3.5 rounded-[26px] bg-dk p-[18px] text-on-dk shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-title"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3
              id="game-title"
              className="m-0 font-display text-[26px] leading-none font-extrabold uppercase wdth-80"
            >
              Commit Snake
            </h3>
            <div className="flex gap-[18px] font-mono text-xs text-on-dk-2 [&_b]:font-medium [&_b]:text-on-dk">
              <span>
                Score <b>{score}</b>
              </span>
              <span>
                Best <b>{best}</b>
              </span>
              <span>{ate}</span>
            </div>
          </div>
          <button
            className={cx(ICON_BTN, "grid border-on-dk/30 text-on-dk")}
            type="button"
            aria-label="Close game"
            onClick={onClose}
          >
            <Close />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[18px] bg-dk-2">
          <canvas
            ref={canvas}
            className="block h-auto w-full touch-none"
            width={COLS * CELL}
            height={ROWS * CELL}
            aria-label="Snake game board"
            onTouchStart={(e) =>
              (touch.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              })
            }
            onTouchEnd={swipeEnd}
          />
          {message && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/60 p-5 text-center">
              <strong className="font-display text-[34px] leading-none font-extrabold uppercase wdth-78">
                {message.title}
              </strong>
              <span className="text-sm text-on-dk-2">{message.sub}</span>
              <button
                ref={startBtn}
                className="min-h-12 cursor-pointer rounded-full border-0 bg-cobalt px-[22px] font-semibold text-white"
                type="button"
                onClick={phase === "paused" ? togglePause : start}
              >
                {message.cta}
              </button>
            </div>
          )}
        </div>

        <div
          className="hidden grid-cols-[repeat(3,56px)] grid-rows-[repeat(2,48px)] justify-center gap-1.5 [@media(hover:none)]:grid"
          aria-label="Direction controls"
        >
          {PAD.map((b) => (
            <button
              key={b.label}
              className={cx(
                b.cls,
                "cursor-pointer rounded-xl border border-on-dk/20 bg-on-dk/6 text-lg text-on-dk",
              )}
              type="button"
              aria-label={b.label}
              onClick={() => turn(game.current, b.dir[0], b.dir[1])}
            >
              {b.glyph}
            </button>
          ))}
        </div>
        <div className="text-center font-mono text-[11px] text-[#6F6E79]">
          esc to close · best score saved in this browser
        </div>
      </div>
    </div>
  );
}
