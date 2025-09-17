type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

export async function rateLimit(key: string, opts: { intervalMs: number; max: number }) {
  const now = Date.now();
  const id = key;
  const b = buckets.get(id) || { tokens: opts.max, last: now };
  const elapsed = now - b.last;
  const refill = Math.floor(elapsed / opts.intervalMs) * opts.max;
  b.tokens = Math.min(opts.max, b.tokens + (refill > 0 ? refill : 0));
  b.last = refill > 0 ? now : b.last;
  if (b.tokens <= 0) {
    buckets.set(id, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(id, b);
  return true;
}

export function keyFromRequest(req: Request, scope: string) {
  const ip = (req.headers.get("x-forwarded-for") || "")?.split(",")[0] || "unknown";
  return `${scope}:${ip}`;
}










