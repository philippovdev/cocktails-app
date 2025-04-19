import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginVitest from '@vitest/eslint-plugin';
import pluginPlaywright from 'eslint-plugin-playwright';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

/** @type {import('eslint').FlatConfig[]} */
export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      'dist/*',
      '**/dist/*',
      'node_modules/*',
      '**/node_modules/*',
      'coverage/*',
      '**/coverage/*',
      'build/*',
      '**/build/*',
    ],
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
      '@typescript-eslint-plugin': tsPlugin,
      'unused-imports': unusedImportsPlugin,
    },
  },

  {
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^vue?x$'],
            ['^\\u0000'],
            ['^node:'],
            ['^@?\\w'],
            ['^'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'vue/no-multiple-template-root': 'off',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'CONDITIONALS',
            'LIST_RENDERING',
            'RENDER_MODIFIERS',
            'TWO_WAY_BINDING',
            'CONTENT',
            'OTHER_DIRECTIVES',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'DEFINITION',
            'OTHER_ATTR',
            'EVENTS',
          ],
          alphabetical: false,
        },
      ],
      'vue/attribute-hyphenation': ['error'],
      'vue/multi-word-component-names': 'off',
      'vue/require-name-property': 'off',

      '@typescript-eslint-plugin/no-var-requires': 'off',
      '@typescript-eslint-plugin/no-empty-interface': 'off',
      '@typescript-eslint-plugin/consistent-type-imports': 'warn',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          semi: true,
          singleQuote: true,
          printWidth: 80,
          trailingComma: 'es5',
          arrowParens: 'always',
        },
      ],

      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'lines-around-comment': [
        'error',
        {
          beforeBlockComment: false,
          afterBlockComment: false,
          beforeLineComment: false,
          afterLineComment: false,
          allowBlockStart: true,
          allowBlockEnd: true,
          allowObjectStart: true,
          allowObjectEnd: true,
          allowArrayStart: true,
          allowArrayEnd: true,
          allowClassStart: true,
          allowClassEnd: true,
          applyDefaultIgnorePatterns: true,
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'block' },
        { blankLine: 'always', prev: 'block', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: 'directive', next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var', 'export'],
          next: ['const', 'let', 'var', 'export'],
        },
        { blankLine: 'any', prev: '*', next: ['case', 'default'] },
        { blankLine: 'any', prev: ['case', 'default'], next: '*' },
        { blankLine: 'any', prev: '*', next: 'class' },
        { blankLine: 'any', prev: 'class', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        Chargebee: 'readonly',
        module: 'readonly',
        T: 'readonly',
        U: 'readonly',
        R: 'readonly',
        defineSlots: 'readonly',
        defineOptions: 'readonly',
        defineProps: 'readonly',
        defineExpose: 'readonly',
      },
    },
  },

  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    name: 'override-vue-formatting-rules',
    rules: {
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
];
