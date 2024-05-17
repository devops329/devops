# Deliverable ⓸: UI test

![course overview](../courseOverview.png)

With the UI testing skills you have learned you are now ready to test the JWT Pizza frontend. As part of these tests you will mock out the backend service so that you don't have to worry about the problems that come with integration testing.

You previously created a fork of `jwt-pizza`. Now you need to add Playwright and the coverage functionality. The first step is to install the required packages and setup the project using the [Playwright instruction](../playwright/playwright.md) that you studied earlier. This includes the following:

1. Install Playwright. You can choose if you want to use JavaScript or TypeScript.
   ```sh
   npm playwright test
   ```
1. Add the `test` script to `package.json`.
   ```json
     "scripts": {
      "test": "playwright test"
    },
   ```
1. Verify that you can run the example test.
1. Install the Playwright Chromium testing browser.
1. Cleanup the `playwright.config.ts` file and add the ability to launch the jwt-pizza-service using Vite.

   ```js
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     timeout: 3000,
     use: {
       baseURL: 'http://localhost:5173',
       trace: 'on-first-retry',
     },
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 300 } },
       },
     ],
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:5173',
       reuseExistingServer: !process.env.CI,
       timeout: 5000,
     },
   });
   ```

1. Install coverage support

   ```sh
   npm install -D nyc vite-plugin-istanbul playwright-test-coverage
   ```

1. Modify `.gitignore` to excluded `.nyc_output`.
1. Add the configuration files
   **.nycrc.json**

   ```js
   {
     "check-coverage": true,
     "branches": 80,
     "lines": 80,
     "functions": 80,
     "statements": 80
   }
   ```

   **vite.config.js**

   ```js
   import istanbul from 'vite-plugin-istanbul';

   export default defineConfig({
     plugins: [
       istanbul({
         include: ['src/**/*'],
         exclude: ['node_modules'],
         requireEnv: false,
       }),
     ],
   });
   ```

   **package.json**

   ```json
   "scripts": {
     "test:coverage": "nyc --reporter=json-summary --reporter=text playwright test"
   }
   ```

1. Replace the `@playwright/test` import for all your test files

   ```js
   import { test, expect } from 'playwright-test-coverage';
   ```

## Running the first test

After all that setup you should be able to run the default Playwright tests and see the results with coverage turned on.

```sh
➜ npm run test:coverage

Running 2 tests using 2 workers
  2 passed (2.8s)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |
----------|---------|----------|---------|---------|-------------------
```

This isn't very exciting since the default test doesn't actually execute any of the Pizza code. Let's write a simple test to get the ball rolling. Delete `example.spec.js` and create a new test file called `pizza.spec.js`.

```js
import { test, expect } from 'playwright-test-coverage';

test('login/profile/logout', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
}
```

Now when we run the test we get **14.75%** coverage. Just for loading the home page.

```sh
➜  npm run test:coverage
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |   14.69 |    13.66 |      17 |   14.75 |
```

## Recording a test

We can use the VS Code Playwright extension `Record at coursor` functionality to give us a jump start on writing our tests. Open your `pizza.spec.js` file and add a new empty test.

```js
test('buy pizza with login', async ({ page }) => {});
```

Put your cursor in the body of the test function, open the `Test Explorer` tab and press the `Record at cursor` action. This wil start up the recorded. Then go through the steps of ordering a pizza and logging in as prompted.

![alt text](playwrightTestRecord.gif)

After all that is done you should end up with a test that looks something like the following.

```js
test('login/profile/logout', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Order now' }).click();
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByRole('main')).toContainText('0.008 ₿');
});
```

Go ahead and run the test in VS Code to make sure it works and then run the test again with coverage from the command console.

```sh
➜  npm run test:coverage
ERROR: Coverage for lines (35.12%) does not meet global threshold (80%)
-------------------------|---------|----------|---------|---------|-----------------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-----------------------------
All files                |   34.74 |    35.25 |    35.5 |   35.12 |
-------------------------|---------|----------|---------|---------|-----------------------------
```

That takes us to **35%** line coverage. This seems really promising and if we keep going down this path it feels like will have 80% coverage in no time. However, there is a demon waiting in the wings. Currently the `.env.development` configuration file has you using the JWT Headquarters deployment Pizza service. That is nice from the integration testing standpoint, but the data hosted on that service is going to change constantly and that will make it hard to write tests that are consistent.

To solve this you could start your own JWT service in your dev environment and run against that. However, we eventually want to run our test with GitHub Actions and so that strategy will be difficult.

A different option is to mock out the JWT service. That way the we are only testing the frontend. This will make the tests more stable and even make they run faster, but it has the disadvantage of insulating us from bugs that might get introduced when the protocol between the front and backend changes. Still this seems like the right option. So let's look at converting the test we just created over to using a mocked out service.

## Mocking JWT Pizza Service

First we need to figure out what endpoints this series of calls will make. To accomplish this, we can use the Playwright Trace Viewer and then mock out each request it makes.

### Recording network traffic

This shows us that we made four requests. After we simplify them down we have the following.

| method | endpoint        | request body                                                                                                                                       | response body                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/order/menu |                                                                                                                                                    | [{"id":1,"title":"Veggie","image":"pizza1.png","price":0.0038,"description":"A garden of delight"},{"id":2,"title":"Pepperoni","image":"pizza2.png","price":0.0042,"description":"Spicy treat"},{"id":3,"title":"Margarita","image":"pizza3.png","price":0.0014,"description":"Essential classic"},{"id":4,"title":"Crusty","image":"pizza4.png","price":0.0024,"description":"A dry mouthed favorite"}}] |
| GET    | /api/franchise  |                                                                                                                                                    | [{"id":2,"name":"LotaPizza","stores":[{"id":4,"name":"Lehi"},{"id":5,"name":"Springville"},{"id":6,"name":"American Fork"}]},{"id":3,"name":"PizzaCorp","stores":[{"id":7,"name":"Spanish Fork"}]},{"id":4,"name":"topSpot","stores":[]}]                                                                                                                                                                 |
| PUT    | /api/auth       | {"email":"d@jwt.com","password":"a"}                                                                                                               | {"id":3,"name":"Kai Chen","email":"d@jwt.com","roles":[{"role":"diner"}]}                                                                                                                                                                                                                                                                                                                                 |
| POST   | /api/order      | {"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1} | {"order":{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1,"id":23},"jwt":"eyJpYXQ"}                                                                                                                                                                                                                      |

### Create the mocks

```js
test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/order/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '1',
      franchiseId: 1,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '1',
        franchiseId: 1,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('http://localhost:5173/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('₿')).toHaveText('0.008 ₿');
});
```
