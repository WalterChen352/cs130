import eslint from '@eslint/js';
import tseslint from 'typescript-eslint'; 
import * as tsParser from '@typescript-eslint/parser'; 
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["**/__tests__/**/*.{js,ts,jsx,tsx}", "**/__mocks__/**/*.{js,ts,jsx,tsx}"],
    
    languageOptions: {
      parser: tsParser, 
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
    
    plugins: {
      jest: jestPlugin,
    },
    
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
);
