# PlayWright

- Why are we using PlayWright?

# Old stuff

[CS260 Playwright docs](https://learn.cs260.click/page/webServices/uiTesting/uiTesting_md)

This will install the package, a browser engine, and create some sample tests.

```sh
npm init playwright@latest
```

Install VS Code extension: Playwright Test for VSCode

put your test in /tests

Running UI mode

```sh
npx playwright test --ui
```

[Playwright with github actions](https://mmazzarolo.com/blog/2022-09-09-visual-regression-testing-with-playwright-and-github-actions/)

# More old stuff

https://playwright.dev/

[Best Practices](https://playwright.dev/docs/best-practices)

To get Playwright to run I followed the instructions in [cs260](https://learn.cs260.click/page/webServices/uiTesting/uiTesting_md). I did have to change the created file so use ES modules instead of Common modules. This was a simple change from the `required` syntax to the `import` syntax.

```js
const { defineConfig, devices } = require('@playwright/test');
import { defineConfig, devices } from '@playwright/test';
```

I also modified the config file to drop out the extra browsers and to specify the webServer to work with Vite on startup.

```js
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
```

## Install Playwright extension

> Playwright Test for VSCode
> v1.0.22
> Microsoft

This creates a little beaker icon in the tools

![playwright](playwright-extension.png)

### Show browser and Trace viewer

These tools are great. They allow you to interactively see what the tests are doing.

## Writing tests

https://playwright.dev/docs/writing-tests

## Modify the tests

I then deleted the examples and modified the simple `example.spec.js` to be `store.spec.js` and to contain the following.

```js
// @ts-check
import { test, expect } from '@playwright/test';

test('testAddStoreButton', async ({ page }) => {
  let serverStoreJson = [
    { name: 'nyc', date: '2028-01-01' },
    { name: 'san diego', date: '2032-10-31' },
  ];

  // Mock out the server
  await page.route('*/**/api/store', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: { store: serverStoreJson } });
  });

  await page.route('*/**/api/store/provo', async (route) => {
    expect(route.request().method()).toBe('POST');
    serverStoreJson = [...serverStoreJson, { name: 'provo', date: '2021-10-31' }];
    await route.fulfill({ json: { store: serverStoreJson } });
  });

  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle('DevOps Demo');

  // add a new store
  await page.locator('css=input').fill('provo');
  const addStoreBtn = page.getByRole('button', { name: 'Add' });
  await addStoreBtn.click();
  const storeTable = page.getByRole('cell', { name: 'provo' });
  await expect(storeTable).toHaveText('provo');
});
```

## Install Browser

Because I didn't install any browsers on startup I had to do that before the tests would run.

Press `Shift+Command+P` to open the Command Palette in VSCode, type 'Playwright' and select 'Install Playwright Browsers'.

I only selected Chromium.

I then went to the VS Code test extension and ran the tests.

## Debugging Playwright

https://playwright.dev/docs/debug

## Other UI testing libraries

https://www.accelq.com/blog/ui-testing-tools/

### React Testing Library

Alternatives to Playwright include using Jest with the [react testing library](https://medium.com/expedia-group-tech/ui-testing-with-react-testing-library-and-jest-f3bd9d4ec2ea).

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
