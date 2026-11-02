type SP = Record<string, string | string[] | undefined>;

export function param(sp: SP, key: string, max = 100) {
  const v = sp[key];
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s ? s.slice(0, max) : undefined;
}

export function pageParam(sp: SP) {
  return Math.max(1, Math.min(10_000, Number.parseInt(param(sp, "page") ?? "1", 10) || 1));
}

export function oneOf<T extends string>(value: string | undefined, options: readonly T[]): T | undefined {
  return options.includes(value as T) ? (value as T) : undefined;
}

/** Builds a URL keeping the current filters and changing only `page`. */
export function pageHref(base: string, sp: SP, page: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const s = Array.isArray(v) ? v[0] : v;
    if (s && k !== "page") params.set(k, s);
  }
  if (page > 1) params.set("page", String(page));
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}
