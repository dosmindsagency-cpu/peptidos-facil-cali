import { createHash, randomBytes } from "node:crypto";

const PEP_RATE_LIMIT = 12;
const PEP_RATE_WINDOW_MS = 60_000;
const PEP_RATE_MAX_IDENTITIES = 5_000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface FixedWindowRateLimiterOptions {
  limit: number;
  windowMs: number;
  maxEntries?: number;
  now?: () => number;
  salt?: string;
}

export class FixedWindowRateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxEntries: number;
  private readonly now: () => number;
  private readonly salt: string;

  constructor(options: FixedWindowRateLimiterOptions) {
    this.limit = options.limit;
    this.windowMs = options.windowMs;
    this.maxEntries = options.maxEntries ?? PEP_RATE_MAX_IDENTITIES;
    this.now = options.now ?? Date.now;
    this.salt = options.salt ?? randomBytes(32).toString("hex");
  }

  check(rawIdentity: string): RateLimitResult {
    const now = this.now();
    this.removeExpiredEntries(now);

    const identity = createHash("sha256")
      .update(this.salt)
      .update(rawIdentity)
      .digest("hex");
    const existing = this.entries.get(identity);
    const entry =
      existing && existing.resetAt > now
        ? existing
        : { count: 0, resetAt: now + this.windowMs };

    entry.count += 1;
    this.entries.set(identity, entry);
    this.enforceEntryLimit();

    const allowed = entry.count <= this.limit;
    return {
      allowed,
      remaining: Math.max(0, this.limit - entry.count),
      resetAt: entry.resetAt,
      retryAfterSeconds: allowed
        ? 0
        : Math.max(1, Math.ceil((entry.resetAt - now) / 1_000)),
    };
  }

  private removeExpiredEntries(now: number): void {
    for (const [identity, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(identity);
    }
  }

  private enforceEntryLimit(): void {
    while (this.entries.size > this.maxEntries) {
      let oldestIdentity: string | undefined;
      let oldestReset = Number.POSITIVE_INFINITY;

      for (const [identity, entry] of this.entries) {
        if (entry.resetAt < oldestReset) {
          oldestIdentity = identity;
          oldestReset = entry.resetAt;
        }
      }

      if (!oldestIdentity) return;
      this.entries.delete(oldestIdentity);
    }
  }
}

const pepRateLimiter = new FixedWindowRateLimiter({
  limit: PEP_RATE_LIMIT,
  windowMs: PEP_RATE_WINDOW_MS,
});

export function getPepClientIdentity(request: Request): string {
  const forwardedFor =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export function checkPepRateLimit(request: Request): RateLimitResult {
  return pepRateLimiter.check(getPepClientIdentity(request));
}
