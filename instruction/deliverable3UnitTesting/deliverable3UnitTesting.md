# Deliverable ⓷: Unit testing

![course overview](../courseOverview.png)

Now that you have the JWT Pizza Service in your hands you can start to assure its quality by writing unit tests. We will then use GitHub Actions to run your tests whenever a commit is made to your fork of the repository.

If you haven't already done so, make sure you fork the [jwt-pizza-service](../jwtPizzaService/jwtPizzaService.md) repository and clone it to your development environment.

```sh
npm install -D jest supertest
```

```json
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.4"
  }
```

In order to test service endpoints you need to abstract the express app so that SuperTest can launch it. This is already done in `jwt-pizza-service` and so all you have to do is use it.

## Coverage

Added the Jest config `jest.config.json` so coverage would be turned on.

```json
{
  "collectCoverage": true
}
```

With coverage added I had to add `coverage` to `.gitignore` so that the resulting coverage reports don't get added to gitHub.

## NPM test script

Added node script to `package.json` to run Jest for tests.

```json
  "scripts": {
    "run": "node index.js",
    "test": "jest --detectOpenHandles --forceExit"
  },
```

## Creating the first test

Now you can create your first test by creating the following directory structure in your fork of the jwt-pizza-service project code.

```txt
dir stuff
```

## Demonstrate that all systems are go

Now that you have set up jwt-pizza-service to be tested with Jest we can make sure it is all working right by opening up a command console and running test.

```sh

```

## Write a test

```js
const request = require('supertest');
const app = require('../../src/service');

test('get menu', async () => {
  const getMenuRes = await request(app).get('/api/order/menu');
  expect(getMenuRes.status).toBe(200);
  expect(getMenuRes.headers['content-type']).toMatch('application/json; charset=utf-8');

  expect(getMenuRes.body.length).toBe(6);
});
```

The cookie management should work with the `agent` functionality, but I couldn't get it to work. So I managed the cookies by hand. I also created a global user that is already authenticated for tests to use.

```js
const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
let testUserCookie;

beforeAll(async () => {
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserCookie = registerRes.headers['set-cookie'];
});
```

## Open handles

I get a warning that the test isn't shutting down correctly. I think this is MySQL connections begin left open.

```sh
 jest --detectOpenHandles --forceExit

 Jest has detected the following 1 open handle potentially keeping Jest from exiting:

  ●  TCPWRAP

      199 |
      200 |   async _getConnection(setUse = true) {
    > 201 |
```

Running with the above setting I can see it is the MySQL connections.

## Coverage report

Four simple tests and I already have 56% coverage

```sh

 PASS  test/order/menu.test.js
  ✓ get menu (5 ms)
  ✓ register (57 ms)
  ✓ login (63 ms)
  ✓ get orders (4 ms)

---------------------|---------|----------|---------|---------|-----------------------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-----------------------------------
All files            |   55.89 |    38.46 |   52.72 |    56.7 |
 src                 |   82.85 |       50 |   42.85 |   82.35 |
  config.js          |     100 |      100 |     100 |     100 |
  endpointHelper.js  |   66.66 |      100 |   66.66 |      60 | 3-4
  service.js         |   85.71 |       50 |      25 |   85.71 | 26,33,40-41
 src/database        |   46.95 |       50 |   64.28 |   47.23 |
  database.js        |   47.58 |       50 |   56.52 |   47.96 | 39-41,58,75-76,82-180,193-197,297
  testData.js        |      45 |       50 |     100 |      45 | 7-17,26-48,57-96,107-134
 src/model           |     100 |      100 |     100 |     100 |
  model.js           |     100 |      100 |     100 |     100 |
 src/routes          |   60.41 |     25.8 |      40 |   63.04 |
  authRouter.js      |   84.21 |    72.72 |   66.66 |   88.88 | 51,61,81-82
  franchiseRouter.js |   34.21 |        0 |       0 |   36.11 | 38,46-52,60-65,73-78,86-91,99-105
  orderRouter.js     |      65 |        0 |   66.66 |      65 | 43-54
---------------------|---------|----------|---------|---------|-----------------------------------
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

With one more order test I got 95% coverage. However, we are going to need some mocking in order to get the last 5% since it is the error handling cases.

```js
if (r.ok) {
  res.send({ order, jwt: j.jwt });
} else {
  throw new StatusCodeError(`Failed to fulfill order at factory. ${JSON.stringify(j)}`, 500);
}
```

A couple auth tests and I am up to 63%.

```sh
 PASS  test/order/menu.test.js
  ✓ get menu (6 ms)
  ✓ register (58 ms)
  ✓ register bad params (3 ms)
  ✓ login (65 ms)
  ✓ logout (59 ms)
  ✓ auth bad token (1 ms)
  ✓ get orders (4 ms)
  ✓ create order (307 ms)

---------------------|---------|----------|---------|---------|-----------------------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-----------------------------------
All files            |   62.62 |    46.15 |      60 |   63.57 |
 src                 |   82.85 |       50 |   42.85 |   82.35 |
  config.js          |     100 |      100 |     100 |     100 |
  endpointHelper.js  |   66.66 |      100 |   66.66 |      60 | 3-4
  service.js         |   85.71 |       50 |      25 |   85.71 | 26,33,40-41
 src/database        |   53.04 |    53.33 |   71.42 |   53.37 |
  database.js        |   55.64 |    54.54 |   65.21 |   56.09 | 39-41,58,75-76,94-180,197,297
  testData.js        |      45 |       50 |     100 |      45 | 7-17,26-48,57-96,107-134
 src/model           |     100 |      100 |     100 |     100 |
  model.js           |     100 |      100 |     100 |     100 |
 src/routes          |   70.83 |     38.7 |      50 |   73.91 |
  authRouter.js      |   94.73 |      100 |   77.77 |     100 |
  franchiseRouter.js |   34.21 |        0 |       0 |   36.11 | 38,46-52,60-65,73-78,86-91,99-105
  orderRouter.js     |      95 |       50 |     100 |      95 | 54
---------------------|---------|----------|---------|---------|-----------------------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.876 s, estimated 1 s
```

I just need franchise tests now. That should also cover the last of the database code. However, this is a problem because I don't have an admin user.

## CI: Testing

## CI: Linting

## CI: Coverage

# Reporting Code Coverage

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
