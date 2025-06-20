const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

module.exports = [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            prettier, 
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            'prettier/prettier': 'error',
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
            'semi': ['error', 'always'],
            'no-extra-semi': 'error',
            'quotes': ['error', 'single', { avoidEscape: true }],
            'comma-dangle': ['error', 'always-multiline'],
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unexpected-multiline': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
];
