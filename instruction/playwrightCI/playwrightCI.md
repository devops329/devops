# Playwright CI

## Adding coverage

This is proving to be more difficult than expected.

[Tutorial](https://mickydore.medium.com/adding-playwright-tests-to-your-vite-project-with-code-coverage-f6cfa65f0209)

The basic steps are to install

- playwright-test-coverage: wrap all the test calls with the calls that start and stop test coverage on each page. I believe this is just using the basic Playwright coverage API.
- vite-plugin-istanbul: use istanbul (aka nyc) as a vite plugin.
- nyc: Code coverage library used to generate and visualize the output.
- create nycrc.json to specify nyc parameters for failing the coverage test.

[NYC Docs](https://github.com/istanbuljs/nyc)

Create nycrc.json

```js
{
  "check-coverage": true,
  "branches": 80,
  "lines": 80,
  "functions": 80,
  "statements": 80
}
```

Modify vite.config.js

```js
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    ...,
    istanbul({
      include: ['src/**/*'], // files to track coverage on
      exclude: ['node_modules'], // files to NOT track coverage on
      requireEnv: false
    })
  ]
})
```

Change tests to use playwright-test-coverage

```js
// import { test, expect } from '@playwright/test' <- we can remove this
import { test, expect } from 'playwright-test-coverage';
```

add a new script that runs tests with coverage using nyc

```json
// package.json
"scripts": {
  ...,
  "test:e2e-coverage": "nyc --reporter=lcov  --reporter=text-summary playwright test"
}
```

The different reporters do different things. `lcov` will create an HTML report. `text-summary` prints out a simple display.

this produces a file named:

**coverage/lcov-reports/index.html**

## GitHub Action with coverage

Finally I modified the action to run the coverage test

```yaml
jobs:
  build:
    name: Build client
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Build
        run: npm ci && npm run build
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
      - name: Run Playwright tests
        run: npm run test:coverage
```

Now when I run the action it fails

```
Run npm run test:coverage

> pizza-client@0.0.1 test:coverage
> nyc --reporter=text-summary playwright test
Running 1 test using 1 worker
·
  1 passed (2.3s)
ERROR: Coverage for branches (50%) does not meet global threshold (80%)
=============================== Coverage summary ===============================
Statements   : 97.61% ( 41/42 )
Branches     : 50% ( 1/2 )
Functions    : 100% ( 12/12 )
Lines        : 97.61% ( 41/42 )
================================================================================
Error: Process completed with exit code 1.
```
