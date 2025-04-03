import path from "node:path"
import { fileURLToPath } from "node:url"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "*.{mjs,cjs,js}",
      "src-tauri",
      "vite.config.ts",
      "src/components/ui/**",
      "src/components/minimal-tiptap/**",
    ],
  },
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/strict-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked"
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "react-hooks": reactHooks,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },

    rules: {
      eqeqeq: "error",
      "no-else-return": "error",

      "no-implicit-coercion": [
        "error",
        {
          disallowTemplateShorthand: true,
        },
      ],

      "no-unneeded-ternary": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      radix: ["error", "always"],
      "react-hooks/exhaustive-deps": "error",
    },
  },
])
