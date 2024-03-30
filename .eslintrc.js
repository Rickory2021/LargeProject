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
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'warn',
    'no-unreachable': 'warn',
    'react/prop-types': 'warn',
    'no-dupe-keys': 'warn',
    'react/no-unknown-property': 'warn',
    'react/no-unescaped-entities': 'warn',
    'no-useless-catch': 'warn'
  }
};
