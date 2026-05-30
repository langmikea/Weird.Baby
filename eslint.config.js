import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore non-source trees + backup files so `eslint .` sweeps real source
  // only and the problem count stays a meaningful regression tripwire.
  // Without these it also lints minified vendor backups (dist.pre_*), the
  // _cowork/ scratch dir, retired files, and *.pre-*/*.old_v*/*.bak_* backups
  // — ~252 noise errors that bury the real ~4-error src/ baseline.
  // (lint-baseline restore, 2026-05-30)
  globalIgnores([
    'dist',
    'dist.pre_*',
    '_cowork',
    '.phase1_retired_files',
    '**/*.pre-*',
    '**/*.old_v*',
    '**/*.bak_*',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        __BUILD_TIME__: 'readonly', // injected by vite.config.js define{}
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
