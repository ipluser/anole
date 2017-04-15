module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },
  ecmaFeatures: {
    jsx: true,
  },
  plugins: [
    'react',
  ],
  extends: [
    'eslint-config-airbnb',
  ],
  rules: {
    'no-unused-expressions': 0,
    'max-len': [2, 120, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    semi: [2, 'never'],
    'no-console': 2,
    'react/jsx-filename-extension': [2, {
      extensions: ['.jsx'],
    }],
    'import/no-extraneous-dependencies': [2, {
      devDependencies: ['**/*.test.js', '**/.setup.js'],
    }],
    'react/no-unused-prop-types': [2, {
      skipShapeProps: true,
    }],
  }
}
