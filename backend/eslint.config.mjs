import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['*.mjs', 'jest.config.js']
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  
  {
    // plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc'],
    // rules: {
    //   'tsdoc/syntax': 'warn',
    // },
    languageOptions: {
      parser: tseslint.parser, 
      parserOptions: {
        project: './tsconfig.json', // Specify the path to your TypeScript config file
        tsconfigRootDir: process.cwd(), // Ensure correct resolution of `tsconfig.json`
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...jestPlugin.environments.globals.globals,
      },
    },
  },
  {
    // Jest
    files: ["**/__tests__/**/*.{js,ts,jsx,tsx}", "**/__mocks__/**/*.{js,ts,jsx,tsx}"],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
        globals: jestPlugin.environments.globals.globals,
    },
    rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
    },
  }
);