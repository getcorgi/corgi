module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    'eslint-plugin-simple-import-sort',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'prettier/prettier': 'error',
    'simple-import-sort/sort': 'error',
  },
};
