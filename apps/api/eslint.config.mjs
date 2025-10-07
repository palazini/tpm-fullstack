import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

const [baseConfig, eslintRecommended, recommended] =
  tseslint.configs["flat/recommended"];

// Padrões úteis
const tsFiles = ["**/*.ts"];
const legacyRouteGlobs = ["src/routes/**/*.ts"];

export default defineConfig([
  // Ignora saídas de build
  globalIgnores(["dist", "build", "node_modules"]),

  // Base do TS/ESLint
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

  // Regras recomendadas do ESLint
  {
    ...eslintRecommended,
    files: tsFiles,
  },

  // Regras recomendadas do @typescript-eslint com ajustes do projeto
  {
    ...recommended,
    files: tsFiles,
    rules: {
      ...recommended.rules,
      // Aviso (não erro) para variáveis não usadas e ignora as que começam com "_"
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Mantém comportamento atual do codebase
      "prefer-const": "off",
    },
  },

  // Afrouxa regras apenas nas rotas legadas
  {
    files: legacyRouteGlobs,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
