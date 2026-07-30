/**
 * Defensive runtime check: this module is server-only.
 * Importing it from a client component is a build error, but we also
 * belt-and-suspenders at runtime in case the bundler changes.
 */
export function assertServerOnly(scope: string) {
  if (typeof window !== "undefined") {
    throw new Error(`[${scope}] attempted to run in the browser. Server-only module.`);
  }
}
