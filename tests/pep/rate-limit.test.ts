import { describe, expect, it } from "vitest";

import {
  FixedWindowRateLimiter,
  getPepClientIdentity,
} from "@/lib/pep/rate-limit";

describe("PEP anonymous rate limiting", () => {
  it("blocks after the fixed-window limit and resets afterward", () => {
    let now = 1_000;
    const limiter = new FixedWindowRateLimiter({
      limit: 2,
      windowMs: 10_000,
      now: () => now,
      salt: "test-only-salt",
    });

    expect(limiter.check("203.0.113.10")).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(limiter.check("203.0.113.10")).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(limiter.check("203.0.113.10")).toMatchObject({
      allowed: false,
      retryAfterSeconds: 10,
    });

    now = 11_000;
    expect(limiter.check("203.0.113.10")).toMatchObject({
      allowed: true,
      remaining: 1,
    });
  });

  it("does not retain a raw identity as a map key", () => {
    const limiter = new FixedWindowRateLimiter({
      limit: 1,
      windowMs: 10_000,
      salt: "test-only-salt",
    });
    limiter.check("203.0.113.10");

    const entries = (limiter as unknown as { entries: Map<string, unknown> })
      .entries;
    expect([...entries.keys()]).not.toContain("203.0.113.10");
    expect([...entries.keys()][0]).toMatch(/^[a-f0-9]{64}$/);
  });

  it("prefers the Vercel forwarding header", () => {
    const request = new Request("https://example.test/api/pep", {
      headers: {
        "x-vercel-forwarded-for": "203.0.113.10, 198.51.100.4",
        "x-forwarded-for": "192.0.2.1",
      },
    });

    expect(getPepClientIdentity(request)).toBe("203.0.113.10");
  });
});
