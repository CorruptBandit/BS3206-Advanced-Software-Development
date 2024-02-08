module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
  plugins: ['react'],
  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'react/display-name': 'warn',
    'react/prop-types': 'warn'
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
