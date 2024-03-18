module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es2021: true,
    es6: true,
    jquery: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {}
};
