import js from '@eslint/js'
import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.next/**',
      '**/out/**',
      'eslint.config.mts',
      'e2e/generated/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.eslint.json',
          './apps/api/tsconfig.eslint.json',
          './apps/web/tsconfig.eslint.json',
          './packages/db/tsconfig.eslint.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: fixupPluginRules(pluginReact),
      'react-hooks': pluginReactHooks,
      'jsx-a11y': fixupPluginRules(pluginJsxA11y),
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: [
      'apps/api/**/*.{js,ts}',
      'packages/**/*.{js,ts}',
      'scripts/**/*.{js,ts}',
      '**/*.config.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: { globals: globals.node },
  },
  prettier,
])
