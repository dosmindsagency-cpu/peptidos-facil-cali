import { describe, expect, it } from "vitest";

import { isNearPepScrollBottom, PEP_NEAR_BOTTOM_PX } from "@/lib/pep/scroll";

describe("PEP scroll state", () => {
  it("auto-scrolls at the bottom and within the near-bottom threshold", () => {
    expect(
      isNearPepScrollBottom({
        scrollHeight: 1_000,
        clientHeight: 400,
        scrollTop: 600,
      }),
    ).toBe(true);
    expect(
      isNearPepScrollBottom({
        scrollHeight: 1_000,
        clientHeight: 400,
        scrollTop: 600 - PEP_NEAR_BOTTOM_PX,
      }),
    ).toBe(true);
  });

  it("preserves manual scroll position above the threshold", () => {
    expect(
      isNearPepScrollBottom({
        scrollHeight: 1_000,
        clientHeight: 400,
        scrollTop: 600 - PEP_NEAR_BOTTOM_PX - 1,
      }),
    ).toBe(false);
  });
});
