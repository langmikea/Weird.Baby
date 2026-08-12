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
    // [D4 2026-08-08] THE LIVE PREVIEW'S BUILT BUNDLE, which is `dist` by
    // another name. `npm run dictation` writes a minified IIFE with React
    // inside it to `docs/dictation-20260807/_preview/`; leaving it swept took
    // the count from 11 errors to 116 in one generator run and would have
    // buried the src/ baseline the same way `dist.pre_*` once did. The SOURCE
    // it is built from (`tools/dictation/preview/entry.jsx`) is still linted.
    'docs/**/_preview',
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
        __WB_STAGE__: 'readonly',      // [V1] the stage — see reveal/stage.mjs
        __WB_PLACEMENT__: 'readonly',  // [V1] stage + the public placement set
        // [CH5 2026-08-12] the Record's clock. `__WB_RECORD_ASSETS__` is the
        // date→file schedule vite bakes into the worker (A3); `HTMLRewriter` is
        // the Cloudflare Workers runtime global the worker uses to write
        // `__WB_TODAY__` into every HTML response. Both are real at runtime and
        // invisible to eslint, which is exactly what this block is for.
        __WB_RECORD_ASSETS__: 'readonly',
        HTMLRewriter: 'readonly',
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
  // [V1 2026-08-06] vite.config.js runs in NODE, not in a browser. It reads
  // `process.env.WB_STAGE` to pick the stage (reveal/stage.mjs), and the
  // browser-globals block above made that one `no-undef` error — a new error in
  // a count whose whole job is to be a regression tripwire. The tool files under
  // `reveal/` and `tools/` are `.mjs` and are not swept at all; this block is
  // the two config files that are.
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
])
