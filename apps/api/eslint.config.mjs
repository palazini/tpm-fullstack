import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

const [baseConfig, eslintRecommended, recommended] =
  tseslint.configs["flat/recommended"];

const tsFiles = ["**/*.ts"];
const legacyRouteGlobs = ["src/routes/**/*.ts"];

export default defineConfig([
  globalIgnores(["dist", "build", "node_modules"]),
  {
    ...baseConfig,
    files: tsFiles,
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
    files: tsFiles,
  },
  {
    ...recommended,
    files: tsFiles,
    rules: {
      ...recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "prefer-const": "off",
    },
  },
  {
    files: legacyRouteGlobs,
    rules: {
      // The legacy routers rely heavily on `any` and unused parameters. Keep the
      // previous lint behavior locally so new modules benefit from stricter
      // defaults while we incrementally type the routes.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
