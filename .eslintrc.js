/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:canonical/recommended'
  ],
  plugins: ['@typescript-eslint', 'canonical'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  ignorePatterns: ["*/**.js"],
  rules: {
    'canonical/destructuring-property-newline': 0,
    'canonical/export-specifier-newline': 0,
    'canonical/virtual-module': 2,
    'canonical/sort-keys': 0,
    'canonical/import-specifier-newline': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/unbound-method': 0
  }
};
