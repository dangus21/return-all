import * as eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.ts"],
        },
      },
    },
    rules: {
      // General best practices
      eqeqeq: ["error", "always"],
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "object-shorthand": ["error", "properties"],
      "arrow-body-style": ["error", "as-needed"],
      // TypeScript-specific
      "@typescript-eslint/no-use-before-define": ["error", { classes: false }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
    },
  },
);
