https://haseebmajid.dev/posts/2023-04-15--how-to-get-code-coverage-from-playwright-tests-in-a-sveltekit-app-/

This turned out to be a simple switch on Jest

```sh
npx jest --coverage
```

Or in the package.json

```json
  "scripts": {
    "test": "jest",
    "test-coverage": "jest --coverage",
    "start": "node index.js",
    "lint": "eslint ."
  },
```

I got the coverage to fail by modifying the jest config.

```js
/** @type {import('jest').Config} */
const config = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

module.exports = config;
```
