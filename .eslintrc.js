// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // 'eol-last': 0,
    // 'lines-around-comment': 0,
    // 'no-multiple-empty-lines': 0,
    // 'spaced-comment': 0,
    // 'require-jsdoc': 0,
    // 'no-irregular-whitespace': 0,
    // allow async-await
    'no-multi-spaces': 0, // 允许出现多余的空格（注释格式用）
    'no-trailing-spaces': 0, // 一行最后允许有空格
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  globals: { 
    '$': false,
    'jquery': false
  }
}
