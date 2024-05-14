# Deliverable ⓷: Unit testing

![course overview](../courseOverview.png)

Now that you have the JWT Pizza Service in your hands you can start to assure its quality by writing unit tests. Once you have your tests written, you will then use GitHub Actions to run your tests whenever a commit is made to your fork of the repository. If during the automatic execution of the test, the coverage requirements of your tests do not meet the required thresholds, then an error is generated.

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

In order to test service endpoints you need to decompose the creation of the Express app from the use of it for serving HTTP requests or running tests.

![](../serviceTesting/endpointRequests.png)

This is already done in `jwt-pizza-service` and so you don't need to worry about it, but you should clearly understand the implications of the design.

## Coverage

Add the Jest config file, `jest.config.json`, so coverage would be turned on.

```json
{
  "collectCoverage": true,
  "coverageReporters": ["json-summary", "text"]
}
```

We request to different coverage reports to be generated. The `text` report generates a summary that is output to the console window. The `json-summary` report is created in the `coverage` directory and contains a JSON representation of the coverage information.

Note that the `.gitignore` file ignores the `coverage` directory so that the resulting coverage reports don't get added to GitHub.

## NPM test script

Add the `test` script to `package.json` so that it knows to use Jest for testing. The options for `detectOpenHandles` and `forceExit` help for cases where the test cannot properly terminate when the application code is not properly configured to shutdown cleanly. This can expose serious problems in the code base.

```json
  "scripts": {
    "run": "node index.js",
    "test": "jest --detectOpenHandles --forceExit"
  },
```

## Creating the first test

Now that you have set up jwt-pizza-service to be tested with Jest we can make sure it is all working right by writing a simple test. Create a file named `authRouter.test.js` in the `src/routes` directory and place the following `hello world` test in file.

```sh
test('hello world', () => {
  expect('hello' + ' world').toBe('hello world');
});
```

Now execute the test by either using the VS Code Jest extension or by opening up a command console and running `npm test`. If you run it from the command console you should see the following result.

```sh
➜  npm test

 PASS  src/routes/authRouter.test.js
  ✓ hello world (1 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

This is not very interesting from a coverage perspective, but it does demonstrate that you are configured correctly.

Make sure you commit and push you code at this important milestone.

## Write a real test

Now you get to start writing all the tests necessary to get at least 80% coverage of the `jwt-pizza-service` code. You should review everything you learned in the following instruction topics before proceeding.

- [Jest](../jest/jest.md)
- [Service Testing](../serviceTesting/serviceTesting.md)

We will give you your first test for free. Replace the `hello world` test found in `src/authRouter.test.js`

```js
const request = require('supertest');
const app = require('../service');

const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
let testUserCookie;

beforeAll(async () => {
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserCookie = registerRes.headers['set-cookie'];
});

test('login', async () => {
  const loginRes = await request(app).put('/api/auth').send(testUser);

  expect(loginRes.status).toBe(200);

  const cookies = loginRes.headers['set-cookie'];
  expect(cookies[0]).toMatch(/token=.+; Path=\/; HttpOnly; Secure; SameSite=Strict/);

  const { password, ...user } = { ...testUser, roles: [{ role: 'diner' }] };
  expect(loginRes.body).toMatchObject(user);
});
```

In this code the `beforeAll` function registers a random user every time the tests run. You can use the user and its associated cookie for tests that require an existing registered user.

The `login` test logs the test user in and verifies that it gets back an authorization token cookie along with the expected user information.

This one test should bump your line coverage up to **50%**. Only 30% more to go. You can verify this by running the test.

```sh
➜  npm test

 PASS  src/routes/authRouter.test.js
  ✓ login (65 ms)

---------------------|---------|----------|---------|---------|-----------------------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-----------------------------------
All files            |   49.83 |     32.3 |      40 |   50.51 |
 src                 |   82.85 |       50 |   42.85 |   82.35 |
  config.js          |     100 |      100 |     100 |     100 |
  endpointHelper.js  |   66.66 |      100 |   66.66 |      60 | 3-4
  service.js         |   85.71 |       50 |      25 |   85.71 | 26,33,40-41
 src/database        |   41.46 |    46.66 |   53.57 |   41.71 |
  database.js        |   40.32 |    45.45 |   43.47 |   40.65 | 23-26,39-41,58,70-184,193-197,297
  testData.js        |      45 |       50 |     100 |      45 | 7-17,26-48,57-96,107-134
 src/model           |     100 |      100 |     100 |     100 |
  model.js           |     100 |      100 |     100 |     100 |
 src/routes          |   51.04 |    16.12 |      20 |   53.26 |
  authRouter.js      |   65.78 |    45.45 |   44.44 |   69.44 | 39-44,50-53,61,81-82
  franchiseRouter.js |   34.21 |        0 |       0 |   36.11 | 38,46-52,60-65,73-78,86-91,99-105
  orderRouter.js     |      55 |        0 |       0 |      55 | 25,34,43-54
---------------------|---------|----------|---------|---------|-----------------------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

Now it is your turn. Keep writing tests until you have more than 80% coverage.

## Linting

Install eslint as a development dependency.

```sh
npm install -D eslint
```

## CI: Testing, linting, and coverage

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
