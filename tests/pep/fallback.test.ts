import { describe, expect, it } from "vitest";

import { buildPepFallback } from "@/lib/pep/fallback";

describe("PEP fallback", () => {
  it("returns an educational response with the medical boundary", () => {
    const response = buildPepFallback("¿Qué es un péptido?");

    expect(response.kind).toBe("educational");
    expect(response.status).toBe("fallback");
    expect(response.safetyNote).toContain("no sustituye");
  });

  it("preserves comparison and calculator routes", () => {
    expect(buildPepFallback("Quiero comparar dos péptidos").kind).toBe(
      "comparison",
    );
    expect(buildPepFallback("Ayúdame a calcular una reconstitución").kind).toBe(
      "calculator",
    );
  });
});
