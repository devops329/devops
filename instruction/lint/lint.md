# Lint

- What is Linting
- Who does it work
- Customizing or not customizing

with the simple actions-demo repo I added linting to the server.

```sh
npx eslint --init
```

I had to edit the .eslintrc.js so that it knows how to handle `jest`, but with this in place I can now update the action workflow to do linting.

```js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {},
};
```
