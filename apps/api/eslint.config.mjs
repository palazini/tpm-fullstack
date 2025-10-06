import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

const [baseConfig, eslintRecommended, recommended] =
  tseslint.configs["flat/recommended"];

export default defineConfig([
  globalIgnores(["dist", "build", "node_modules"]),
  {
    ...baseConfig,
    files: ["**/*.ts"],
    languageOptions: {
      ...baseConfig.languageOptions,
      parser,
      parserOptions: {
        ...baseConfig.languageOptions?.parserOptions,
      },
    },
  },
  {
    ...eslintRecommended,
    files: ["**/*.ts"],
  },
  {
    ...recommended,
    files: ["**/*.ts"],
    rules: {
      ...recommended.rules,
      // The existing codebase intentionally uses `any` and temporary variables.
      // Keep parity with the legacy config by disabling the stricter defaults
      // introduced by the flat recommended preset until the routes can be
      // incrementally typed.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
    },
  },
]);