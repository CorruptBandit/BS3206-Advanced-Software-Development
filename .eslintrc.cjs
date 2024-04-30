module.exports = {
  root: true, // Ensure ESLint picks up the config at the root of the directory
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for parsing JSX
    },
  },
  settings: {
    cache: false,
    react: {
      version: 'detect', // React version is automatically detected
    },
  },
  env: {
    browser: true,
    es2021: true, // Use modern features
    node: true, // Applies to server-side code as well
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime' // Ensures rules for the JSX runtime are correctly applied
  ],
  plugins: [
    'react', // Uses the React plugin
  ],
  rules: {
    'no-unused-vars': 'warn',
    'react/display-name': 'warn',
    'react/prop-types': 'warn',
  },
  overrides: [
    {
      files: ['client/src/**/*.{js,jsx,ts,tsx}'], // Applies only to files in client/src with these extensions
      env: {
        browser: true, // Enable browser environment for client-side
        node: false, // Disable node environment for client-side
      },
      rules: {
        // Client-specific rules or overrides can be defined here
      },
    },
    {
      files: ['server/**/*.{js,ts}'], // Applies only to files in server directory
      env: {
        node: true, // Enable node environment for server-side
        browser: false, // Disable browser environment for server-side
      },
      rules: {
        // Server-specific rules or overrides can be defined here
      },
    }
  ]
};
