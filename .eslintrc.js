module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    // 'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'standard',
  //  "prettier",
   // "plugin:@typescript-eslint/eslint-recommended",
   // "plugin:@typescript-eslint/recommended",
  ],
  // "parser": "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    'vue', '@typescript-eslint',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-var': 'error',
    // allow paren-less arrow functions
    'arrow-parens': ['error', 'as-needed'],
    // set maximum line characters
    'max-len': ['error', {
      code: 150,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
    }],
    complexity: ['error', 32], /*
    quotes: ['error', 'single', {
      avoidEscape: false,
      allowTemplateLiterals: true,
    }], */
    'no-console': 'off',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-return-assign': 'off',
    'no-unused-vars': 'error',
    'no-empty': 'error',
    'array-bracket-spacing': ['error', 'never'],
    // 'object-curly-spacing': ['error', 'always'],
    'vue/object-curly-spacing': [2, 'always'],
    'vue/html-closing-bracket-spacing': [2, {
      selfClosingTag: 'always',
    }],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always',
      },
    ],
    'no-return-await': 'warn',
    'object-shorthand': ['error', 'always'],
    'no-extra-semi': 'error',
    'prefer-const': ['error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    }],
    'no-prototype-builtins': 'off',
    'no-void': 'off',
    'no-case-declarations': 'off',
    'sort-imports': ['warn', {
      ignoreDeclarationSort: true,
      ignoreCase: true,
    }],
    'multiline-ternary': 'off',
    indent: 'off',
    // Not in override, these apply to non-.vue files too
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/one-component-per-file': 'off',
    'vue/custom-event-name-casing': ['error', { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }],
    'vue/max-attributes-per-line': [2, {
      singleline: {
          max: 1,
      },
      multiline: {
          max: 1,
      },
    }],
    semi: [2, 'never'],
  },
  overrides: [
    {
      files: '**/*.vue',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        /*
        'vue/script-indent': ['error', 2, {
          baseIndent: 1,
          switchCase: 1,
          ignores: [],
        }],
        */
        'vue/html-closing-bracket-newline': ['error', {
          singleline: 'never',
          multiline: 'never',
        }],
        'vue/html-closing-bracket-spacing': 'error',
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 5,
          },
          multiline: {
            max: 5,
          },
        }],
        'vue/valid-v-on': 'off', // This rule doesn't allow empty event listeners
        'vue/no-v-html': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/valid-v-slot': ['error', { allowModifiers: true }],
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
}
