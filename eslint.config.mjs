import nextConfig from "eslint-config-next/core-web-vitals";

/**
 * Péptidos Fácil Cali — flat ESLint config.
 *
 * eslint-config-next@16 ships a native flat-config array as its default
 * export, so we spread it rather than wrapping it through FlatCompat
 * (which would fail on the plugin config objects).
 */
export default [
  ...nextConfig,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "docs/**",
      "**/*.config.{js,mjs,ts}",
      "**/*.d.ts",
    ],
  },
];
