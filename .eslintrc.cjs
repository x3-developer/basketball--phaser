module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-empty-function': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
              regex: '^I[A-Z]',
              match: true,
          },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
          allowExpressions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-require-imports': 'off',
  },
}
