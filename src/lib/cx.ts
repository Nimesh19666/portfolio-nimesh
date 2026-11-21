/** Tiny className joiner: cx('a', cond && 'b') → 'a b'. */
export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')
