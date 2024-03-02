https://haseebmajid.dev/posts/2023-04-15--how-to-get-code-coverage-from-playwright-tests-in-a-sveltekit-app-/

https://axolo.co/blog/p/code-coverage-js-in-2023

This turned out to be a simple switch on Jest

```sh
npx jest --coverage
```

Or in the package.json

```json
  "scripts": {
    "test": "jest",
    "test-coverage": "jest --coverage  --coverageReporters json-summary",
    "test-coverage-report": "jest --coverage",
    "start": "node index.js",
    "lint": "eslint ."
  },
```

The `json-summary` produces a single report that can be used for building the coverage badge. Without that it builds an HTML file that demonstrates the coverage.

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

We can create badges to display the coverage using this:

https://dev.to/thejaredwilcurt/coverage-badge-with-github-actions-finally-59fa

It is pretty crazy. It makes a gist then updates it in the action. It then used some third party image generator that gets put into your readme.

https://github.com/marketplace/actions/jest-coverage-comment

This all feels very bittle, but maybe we can use it as an example of CI that is a mess of automation.
