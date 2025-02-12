import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';

const sharedGlobals = {
    jest: true,
    expect: true,
    describe: true,
    it: true,
    beforeAll: true,
    beforeEach: true,
    afterAll: true,
    afterEach: true,
    test: true,
    console: true,
    process: true,
    window: true,
    global: true,
    module: true,
    require: true,
    __dirname: true
};

const sharedRules = {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'error'
};

export default [
    js.configs.recommended,
    {
        files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true }
            },
            globals: sharedGlobals
        },
        plugins: {
            'react': reactPlugin,
            'react-native': reactNativePlugin
        },
        rules: {
            ...sharedRules,
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: sharedGlobals
        },
        plugins: {
            'react': reactPlugin,
            'react-native': reactNativePlugin
        },
        rules: sharedRules
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true }
            },
            globals: sharedGlobals
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'react': reactPlugin,
            'react-native': reactNativePlugin
        },
        rules: {
            ...sharedRules,
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error']
        }
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '.expo/**',
            '**/__mocks__/**'
        ]
    }
];