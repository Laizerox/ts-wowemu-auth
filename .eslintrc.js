module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier',
        'plugin:compat/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'compat', 'import', 'jest', 'prettier', 'simple-import-sort'],
    rules: {
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: true, optionalDependencies: true, peerDependencies: true },
        ],
        'import/order': 'off',
        'max-len': ['error', { code: 120, ignoreUrls: true, ignoreComments: true, ignoreStrings: true }],
        'no-bitwise': [0],
        'no-underscore-dangle': 'error',
        'no-param-reassign': ['error', { props: false }],
        'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'es5' }],
        'simple-import-sort/imports': 'error',
        'sort-imports': 'off',
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
        polyfills: ['Object.values', 'Object.entries', 'Promises'],
    },
};
