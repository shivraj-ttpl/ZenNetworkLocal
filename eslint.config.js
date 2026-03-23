import js from "@eslint/js";
import importX from "eslint-plugin-import-x";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
  { ignores: ["dist", "build", "coverage"] },

  // Main config for all JS/JSX files
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import-x": importX,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Extend recommended rulesets
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      ...importX.configs.recommended.rules,

      // Core rules
      "no-console": "error",
      "no-debugger": "error",
      "no-unused-vars": "off",
      "no-duplicate-imports": "error",
      "no-shadow": "error",
      "no-use-before-define": "error",
      eqeqeq: ["error", "always"],
      "consistent-return": "error",

      // Unused imports (STRICT)
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // Import rules
      "import-x/no-cycle": "error",
      "import-x/no-unused-modules": "error",
      "import-x/order": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-key": "error",
      "react/no-unstable-nested-components": "error",
      "react/jsx-no-bind": ["warn", { allowArrowFunctions: true }],

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // React Refresh
      ...reactRefresh.configs.vite.rules,

      // Complexity control
      complexity: ["warn", 10],
      "max-depth": ["warn", 4],
      "max-lines-per-function": ["warn", 80],

      // Prettier
      "prettier/prettier": "error",
    },
  },

  // Prettier config (must be last to override formatting rules)
  prettier,
];
