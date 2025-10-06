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
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
      "prefer-const": "off",
    },
  },
]);