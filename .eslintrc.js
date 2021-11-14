module.exports = {
    extends: [
        'plugin:vue/vue3-recommended',
    ],
    rules: {
        // 多行的数组或对象在最后加上逗号
        'comma-dangle': ['error', 'always-multiline'],
        // 禁止句尾分号
        semi: ['error', 'never'],
        // 使用单引号
        quotes: ['error', 'single'],
        // 关掉prop默认值的建议
        'vue/require-default-prop': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/html-self-closing': 'off',
        'vue/multi-word-component-names': 'off',
    },
}