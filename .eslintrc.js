module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential'
    ],
    parserOptions: {
        ecmaVersion: 2021,
    },
    rules: {
        'no-console': 'warn',
        'no-debugger': 'warn'
    }
};
