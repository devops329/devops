# Deliverable ⓸ User Interface testing: JWT Pizza

🔑 **Key points**

- Use Playwright for JWT Pizza testing
- Learn to create tests by recording browser interactions
- Compute coverage
- Mock out the JWT Pizza Service
- Update the CI pipeline to run the tests

[🎥 Video overview](https://youtu.be/qvf1kaT_wr0)

---

![course overview](../sharedImages/courseOverview.png)

## Prerequisites

Before you start work on this deliverable make sure you have read all of the preceding instruction topics and have completed all of the dependent exercises (topics marked with a ☑). This includes:

- [UI testing](../uiTesting/uiTesting.md)
- ☑ [Playwright](../playwright/playwright.md)

Failing to do this will likely slow you down as you will not have the required knowledge to complete the deliverable.

## Getting started

With the UI testing skills you have learned you are now ready to test the JWT Pizza frontend. As part of these tests you will mock out the backend service so that you don't have to worry about the problems that come with integration testing.

## Configuring Playwright

You previously created a fork of `jwt-pizza`. Now you need to add Playwright and the coverage functionality. The first step is to install the required packages and set up the project using the [Playwright instruction](../playwright/playwright.md) that you studied earlier. This includes the following:

1. Install Playwright. You can choose if you want to use JavaScript or TypeScript.
   ```sh
   npm init playwright@latest
   ```
1. Add the `test` script to `package.json`.
   ```json
     "scripts": {
      "test": "playwright test"
    },
   ```
1. Install the Playwright Chromium testing browser. This may be done already from initially completing the [Playwright Test Browser Installation](../playwright/playwright.md#install-a-testing-browser) instructions.
1. Cleanup the `playwright.config.js` file and add the ability to launch the JWT Pizza frontend using Vite so that the tests can call it.

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
         use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 600 } },
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

1. Modify `.gitignore` to exclude `.nyc_output`.
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
   import { defineConfig } from 'vite';
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

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});
```

Now when we run the test we get **19.93%** line coverage. Just for loading the home page!

```sh
➜  npm run test:coverage
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |   20.49 |    23.45 |   23.07 |   19.93 |
```

## Recording a test

We can use the VS Code Playwright extension `Record at cursor` functionality to give us a jump start on writing our tests. Open your `pizza.spec.js` file and add a new empty test.

```js
test('buy pizza with login', async ({ page }) => {});
```

Put your cursor in the body of the test function, open the `Test Explorer` tab and press the `Record at cursor` action. This wil start up the recording. Then go through the steps of ordering a pizza and logging in as prompted.

![Playwright test record](playwrightTestRecord.gif)

After all that is done you should end up with a test that looks something like the following.

```js
test('buy pizza with login', async ({ page }) => {
  await page.goto('/');
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
All files                |   49.37 |    61.72 |   46.15 |   48.41 |
-------------------------|---------|----------|---------|---------|-----------------------------
```

That takes us to **49%** line coverage. This seems really promising and if we keep going down this path it feels like will have 80% coverage in no time. However, there is a demon waiting in the wings. Currently, the `.env.development` configuration file has you using the JWT Headquarters deployment Pizza service. That is nice from the integration testing standpoint, but the data hosted on that service is going to change constantly and that will make it hard to write tests that are consistent.

To solve this, you can start your own JWT service and change your `.env.development` file so that it references your local JWT Pizza Service instead of the headquarters' service. This will make it so that you can add users and play with the data in a controlled environment.

```sh
VITE_PIZZA_SERVICE_URL=http://localhost:3000
VITE_PIZZA_FACTORY_URL=https://pizza-factory.cs329.click
```

However, we eventually want to run our tests with GitHub Actions, and we don't want that to be dependent on any external environment that can change.

## Mocking JWT Pizza Service

A different option is to mock out the JWT service. That way, we are only testing the frontend. This will make the tests more stable and even make them run faster, but it has the disadvantage of insulating us from bugs that might get introduced when the protocol between the front and backend changes. Still, this seems like the right option. So let's look at converting the test we just created over to using a mocked out service.

First we need to figure out which endpoints the test uses. To accomplish this, we can use the Playwright Trace Viewer. This will show us all the network requests that were made at each step of the test. We can then use the Playwright `route` method to create mocks for each network request.

### Recording endpoint requests

Follow these steps to use Trace Viewer to get the network requests.

1. Open up the Test Explorer in VS Code.
1. Select `Show trace viewer` from the Playwright pane located under the list of tests.
1. Run the test that we recorded earlier.
1. Trace Viewer should open at this point and execute all the test steps.
1. In the **tools** pane at the bottom of the browser, select the `Network` tab.
1. Sort by 'Content Type'. This should move all the fetch requests to the top of the list.
1. Examine the requests to see what URL, HTTP method, request and response bodies were used for each request.

![TraceViewer](traceViewer.gif)

This shows us that we made four requests. After we simplify them, we have the following.

| method | endpoint        | request body                                                                                                                                       | response body                                                                                                                                                                                                                                                                                                                                                                                            |
| ------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/order/menu |                                                                                                                                                    | [{"id":1,"title":"Veggie","image":"pizza1.png","price":0.0038,"description":"A garden of delight"},{"id":2,"title":"Pepperoni","image":"pizza2.png","price":0.0042,"description":"Spicy treat"},{"id":3,"title":"Margarita","image":"pizza3.png","price":0.0014,"description":"Essential classic"},{"id":4,"title":"Crusty","image":"pizza4.png","price":0.0024,"description":"A dry mouthed favorite"}] |
| GET    | /api/franchise  |                                                                                                                                                    | [{"id":2,"name":"LotaPizza","stores":[{"id":4,"name":"Lehi"},{"id":5,"name":"Springville"},{"id":6,"name":"American Fork"}]},{"id":3,"name":"PizzaCorp","stores":[{"id":7,"name":"Spanish Fork"}]},{"id":4,"name":"topSpot","stores":[]}]                                                                                                                                                                |
| PUT    | /api/auth       | {"email":"d@jwt.com","password":"a"}                                                                                                               | {"id":3,"name":"Kai Chen","email":"d@jwt.com","roles":[{"role":"diner"}]}                                                                                                                                                                                                                                                                                                                                |
| POST   | /api/order      | {"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1} | {"order":{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1,"id":23},"jwt":"eyJpYXQ"}                                                                                                                                                                                                                     |

> [!NOTE]
> To access endpoints that an require admin user, you will need to change your `.env.development` file so that it references your local JWT Pizza Service, instead of the headquarters' service. Then you can log in with the default admin credentials.

### Create the mocks

Now that we have the endpoints that the test uses we can use the Playwright `route` function to mock each one out. Let's start with the `Login` endpoint.

We specify the URL path to match with the glob sequence `*/**/api/auth`. This will match any fetch request that ends in `api/auth`. Next we define what the expected request body will be, and what we will return as the response.

Then we assert that the HTTP method was `PUT` and that we got the expected request body. Finally, we fulfill the route request by returning the mocked response body.

```js
await page.route('*/**/api/auth', async (route) => {
  const loginReq = { email: 'd@jwt.com', password: 'a' };
  const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
  expect(route.request().method()).toBe('PUT');
  expect(route.request().postDataJSON()).toMatchObject(loginReq);
  await route.fulfill({ json: loginRes });
});
```

We repeat this process by looking at each of the expected endpoint calls and creating a a route to verify and respond to them.

The final version of the test, with all the mocks, looks like this. Note that there are a few things that were altered from the original recording to clean things up a bit.

```js
test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
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
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
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
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
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
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});
```

This should be enough to get you started. Your goal is to get at least 80% line coverage by creating meaningful tests that assure the quality of the frontend code.

## Testing CI

With your automated tests in place, you can now update the GitHub Actions script that you created previously to include the execution of the tests and to publicly report your coverage.

Running the test requires that you first install the desired Playwright browser driver, and then execute the test command.

```yml
- name: Run tests
  run: |
    npx playwright install --with-deps chromium
    npm run test:coverage
```

You can then parse the coverage output to build a new coverage badge that is displayed in the README.md for your repository.

```yml
- name: Update coverage
  run: |
    coverage_pct=$(grep -o '"pct":[0-9.]*' coverage/coverage-summary.json | head -n 1 | cut -d ':' -f 2)
    color=$(echo "$coverage_pct < 80" | bc -l | awk '{if ($1) print "yellow"; else print "green"}')
    curl https://img.shields.io/badge/Coverage-$coverage_pct%25-$color -o coverageBadge.svg
    git config user.name github-actions
    git config user.email github-actions@github.com
    git add .
    git commit -m "generated"
    git push
```

Carefully study these steps until you understand what each line does. Then add them to your GitHub Actions workflow file and push it to GitHub.

This should trigger the workflow to execute, and if everything works properly you should see something similar to the following on the Actions page of the GitHub console for your repository.

![Action result](actionResult.png)

## ⭐ Deliverable

In order to demonstrate your mastery of the concepts for this deliverable, complete the following.

1. Create Playwright tests for `jwt-pizza` that provide at least 80% coverage.
1. Create a GitHub Actions workflow that executes the tests.
1. Add the configuration necessary so that the workflow fails if there is not 80% coverage.
1. Add the reporting of the coverage to the workflow by creating a coverage badge in the README.md file.

Once this is all working, go to the [AutoGrader](https://cs329.cs.byu.edu) and submit your work for the deliverable.

### Rubric

| Percent | Item                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| 30%     | Successful execution of GitHub Actions to run test on commit                       |
| 70%     | At least 80% code coverage as documented by workflow execution and README.md badge |
