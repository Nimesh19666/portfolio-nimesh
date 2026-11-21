import { useCallback, useState } from "react";

/** useState that persists to localStorage; silently falls back to memory if storage is blocked. */
export function useLocalStorage<T>(
  key: string,
  initial: T,
  validate?: (v: unknown) => v is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      const parsed: unknown = JSON.parse(raw);
      return validate ? (validate(parsed) ? parsed : initial) : (parsed as T);
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(v));
        } catch {
          /* storage unavailable  keep in memory */
        }
        return v;
      });
    },
    [key],
  );

  return [value, set] as const;
}
