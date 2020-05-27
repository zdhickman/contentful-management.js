module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: '**/*.js',
      parser: 'babel-eslint',
      extends: ['eslint:recommended', 'prettier'],
      plugins: ['promise'],
      globals: {
        __VERSION__: true,
      },
    },
    {
      files: '**/*.ts',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
      plugins: ['promise'],
      globals: {
        __VERSION__: true,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-this-alias': [
          'error',
          {
            allowDestructuring: true, // Allow `const { props, state } = this`; false by default
            allowedNames: ['self'], // Allow `const self = this`; `[]` by default
          },
        ],
      },
    },
  ],
}
