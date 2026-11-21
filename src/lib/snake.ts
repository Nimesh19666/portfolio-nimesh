/** Pure game logic for Commit Snake  rendering lives in SnakeGame. */
export const COLS = 28;
export const ROWS = 20;
export const CELL = 20;

export interface Point {
  x: number;
  y: number;
}
/** [label, colour] */
export type FoodKind = readonly [string, string];
export interface Food extends Point {
  kind: FoodKind;
}
export interface SnakeState {
  snake: Point[];
  dir: Point;
  nextDir: Point;
  food: Food;
  score: number;
  /** ms between ticks */
  speed: number;
}

export const FOODS: FoodKind[] = [
  ["React", "#61DAFB"],
  ["Node", "#3C873A"],
  ["TS", "#3178C6"],
  ["Next", "#F4F2EE"],
  ["PG", "#336791"],
  ["IO", "#FF5A36"],
  ["AWS", "#FF9900"],
  ["Py", "#F4D58D"],
  ["Tw", "#38BDF8"],
];

const START_SPEED = 120;
const MIN_SPEED = 60;

function randomFood(snake: Point[]): Food {
  let p: Point;
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return { ...p, kind: FOODS[Math.floor(Math.random() * FOODS.length)] };
}

export function createGame(): SnakeState {
  const snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  const dir = { x: 1, y: 0 };
  return {
    snake,
    dir,
    nextDir: dir,
    food: randomFood(snake),
    score: 0,
    speed: START_SPEED,
  };
}

/** Queue a turn; reversing straight into yourself is ignored. */
export function turn(state: SnakeState, x: number, y: number) {
  if (x === -state.dir.x && y === -state.dir.y) return;
  state.nextDir = { x, y };
}

export interface TickResult {
  dead: boolean;
  ate: FoodKind | null;
}

/** Advance one step (mutates state). Walls wrap; biting yourself ends the run. */
export function tick(state: SnakeState): TickResult {
  state.dir = state.nextDir;
  const head = {
    x: (state.snake[0].x + state.dir.x + COLS) % COLS,
    y: (state.snake[0].y + state.dir.y + ROWS) % ROWS,
  };
  if (state.snake.slice(0, -1).some((s) => s.x === head.x && s.y === head.y)) {
    return { dead: true, ate: null };
  }
  state.snake.unshift(head);
  if (head.x === state.food.x && head.y === state.food.y) {
    const ate = state.food.kind;
    state.score += 10;
    state.speed = Math.max(MIN_SPEED, state.speed - 3);
    state.food = randomFood(state.snake);
    return { dead: false, ate };
  }
  state.snake.pop();
  return { dead: false, ate: null };
}
