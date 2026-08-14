# Dependency security review

Reviewed during the engineering-guardrails pass. This document records repository evidence, not production-runtime verification.

## Applied low-risk remediation

- The transitive `nanoid` 3.x dependency is locked to the patched `3.3.18` release.
- The development-only transitive packages `brace-expansion` and `js-yaml` are locked to their patched releases.

These are patch-level dependency-only changes and do not alter application code.

## Temporarily accepted findings

- `next@16.2.12` includes a nested PostCSS release reported by `npm audit`. The patched Next.js release is outside the repository's exact framework pin, so updating it belongs in a dedicated framework-upgrade pull request with regression testing.
- Next.js currently resolves optional `sharp@0.34.5`, which is reported by `npm audit`. The available remediation also changes the exact Next.js version and therefore requires the same dedicated upgrade review.
- `npm ci` reports optional WASM resolver peer-dependency override warnings involving `@emnapi/*`. Installation and all repository checks succeed, but the warning should be rechecked when the ESLint/Next.js toolchain is upgraded.

Do not use `npm audit fix --force` on this repository. Re-run `npm audit --omit=dev` and the full audit after each dependency change, and validate the complete application before accepting a framework upgrade.
