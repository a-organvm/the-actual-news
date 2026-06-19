import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Build artifacts and vendored output are not source — never lint them.
    // (Flat-config `ignores` are gitignore-style globs; bare 'dist' only
    // matches a top-level dir, so the per-package outputs need '**/' prefixes.)
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.open-next/**',
      '**/.vercel/**',
      '**/out/**',
      '**/coverage/**',
      '**/*.min.js',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      // Sources span the browser (public-web) and Node (services, tooling).
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Lenient posture: style/typing rules inform but do not block CI.
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Best-effort cleanup catches (e.g. ROLLBACK on a failed txn) are allowed.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    // CommonJS config files (e.g. next.config.js) legitimately use require().
    files: ['**/*.config.{js,cjs}', '**/*.cjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
