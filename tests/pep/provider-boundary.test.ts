import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PEP_ALLOWED_MODELS,
  PEP_DEFAULT_MODEL,
  PEP_MAX_OUTPUT_TOKENS,
  resolvePepModel,
} from "@/lib/pep/config";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

describe("PEP provider boundary", () => {
  it("is explicitly server-only and has no public OpenRouter variable", () => {
    const source = fs.readFileSync(
      path.join(projectRoot, "src/lib/pep/provider.ts"),
      "utf8",
    );

    expect(source).toContain('import "server-only";');
    expect(source).not.toContain("NEXT_PUBLIC_OPENROUTER");
  });

  it("falls back when a configured model is not allowlisted", () => {
    expect(resolvePepModel("attacker/expensive-model")).toBe(PEP_DEFAULT_MODEL);
    expect(resolvePepModel(PEP_ALLOWED_MODELS[0])).toBe(PEP_ALLOWED_MODELS[0]);
    expect(PEP_MAX_OUTPUT_TOKENS).toBe(900);
  });
});
