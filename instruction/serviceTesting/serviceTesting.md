# Service testing

🔑 **Key points**

- Testing distributed services requires specialized tools to simulate network requests.
- Separating the service logic from the server listener makes testing easier.
- Aim for high test coverage to ensure all logical branches (including errors) are handled.

---

Apply your unit testing knowledge by creating a simple HTTP service and driving its tests with [Jest](https://jestjs.io/) and [SuperTest](https://www.testim.io/blog/supertest-how-to-test-apis-like-a-pro/), a popular service testing helper.

The example HTTP service is a simple Express-based application called `City` that provides the following endpoints:

- **Login**: Returns an authorization token.
- **List cities**: Returns a list of city names and their populations.
- **Add city**: Validates an authorization token and adds a new city to the list.

Follow these steps to create the City service and set it up for automated testing.

### Installing the necessary packages

First, create a new Node.js project and install the packages needed to create an HTTP service.

```sh
npm init -y
npm install express
```

### Configuring the project

Modify `package.json` to include a `start` script to serve the endpoints and a `test` script to run Jest.

```json
"scripts": {
  "start": "node index.js",
  "test": "jest"
},
```

Create a `.gitignore` file so you don't accidentally commit the `node_modules` folder or the `coverage` reports generated during testing.

```txt
node_modules
coverage
```

### Providing the service endpoints

Create a file named `service.js` to initialize Express and define the endpoints. Notice that this file does **not** start the service on a specific port; it only exports the `app` object. This separation is critical for testing, as it allows SuperTest to interact with the app without binding to a real network port.

**service.js**

```js
const express = require('express');

const app = express();
app.use(express.json());

const cities = [{ name: 'Provo', population: 116618 }];
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9';

app.post('/login', (req, res) => {
  res.json({ message: 'Success', authorization: authToken });
});

app.get('/cities', (req, res) => {
  res.json(cities);
});

app.post('/cities', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  if (token !== authToken) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    cities.push(req.body);
    res.json(cities);
  }
});

module.exports = app;
```

### Calling the service endpoints

You can call the service endpoints via standard HTTP requests or through automated tests.

![Endpoint requests](endpointRequests.png)

To host the endpoints over HTTP for manual use, create a file named `index.js` that calls `app.listen(port)`.

**index.js**

```js
const app = require('./service.js');

const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Service started on port ${port}`);
});
```

To drive the endpoints from tests, you will use SuperTest's `request(app)` function in a test file.

### Smoke test

Perform a quick manual "smoke test" to ensure the service works from the command line. First, start the service:

```sh
➜ node index.js

Service started on port 3000
```

Then, execute each endpoint using `curl`:

```sh
# Login
➜  curl -X POST localhost:3000/login
{"message":"Success","authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9"}

# List cities
➜  curl localhost:3000/cities
[{"name":"Provo","population":116618}]

# Add city (with authorization)
➜  curl -X POST localhost:3000/cities -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9' -d '{ "name":"Lehi", "population": 33435}'
[{"name":"Provo","population":116618},{"name":"Lehi","population":33435}]
```

## Add Jest and SuperTest

Now, set up Jest and create automated tests. Install both as development dependencies using the `-D` flag. SuperTest allows you to simulate HTTP requests without actually binding to a network port, making tests faster and more reliable.

```sh
npm install -D jest supertest
```

Your `package.json` should now reflect these additions:

```json
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  }
```

## Set up the service for testing

Create a file named `service.test.js` to house your test suite.

**service.test.js**

```js
const request = require('supertest');
const app = require('./service');

test('hello world', () => {
  expect(true).toBe(true);
});
```

This initial "sanity check" ensures your testing environment is configured correctly.

## Configuring for coverage

To see how much of your service code is covered by tests, create a `jest.config.json` file and set `collectCoverage` to `true`.

```json
{
  "collectCoverage": true
}
```

## Run the tests

Execute `npm test` in your terminal to run the initial test and view the coverage report.

```sh
➜  npm test

 PASS  ./service.test.js
  ✓ hello world (1 ms)

------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |   56.25 |        0 |       0 |   56.25 |
 service.js |   56.25 |        0 |       0 |   56.25 | 10,14,18-23
------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

The report shows **56.25%** coverage. This occurs because importing `service.js` into the test file executes the initialization code (like defining the endpoints), even though no endpoints have been called yet.

## Testing the endpoints

Replace the "hello world" test with tests that exercise the actual endpoints.

### Get cities

First, test the `[GET] /cities` endpoint.

```js
test('get cities', async () => {
  const getCitiesRes = await request(app).get('/cities');
  expect(getCitiesRes.status).toBe(200);
  expect(getCitiesRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(getCitiesRes.body).toMatchObject([{ name: 'Provo', population: 116618 }]);
});
```

The SuperTest `request(app)` function returns a response object containing the status, headers, and body. You can then use Jest matchers to validate the data. After running this, coverage should increase to **62.5%**.

### Login

Next, test the `[POST] /login` endpoint. This is necessary because subsequent tests will require an authorization token.

```js
test('login', async () => {
  const loginRes = await request(app).post('/login');
  expect(loginRes.status).toBe(200);
  expect(loginRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(loginRes.body.message).toMatch('Success');
  expect(loginRes.body.authorization).toMatch(/^[a-zA-Z0-9]*$/);
});
```

We use a regular expression to validate that the authorization token matches the expected alphanumeric pattern. Coverage should now be at **68.75%**.

### Add city

The `[POST] /cities` endpoint requires a valid authorization token. To avoid code duplication, we can reuse the login logic.

```js
test('get cities', async () => {
  const getCitiesRes = await request(app).get('/cities');
  expect(getCitiesRes.status).toBe(200);
  expect(getCitiesRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(getCitiesRes.body).toMatchObject([{ name: 'Provo', population: 116618 }]);
});

test('login', login);

async function login() {
  const loginRes = await request(app).post('/login');

  expect(loginRes.status).toBe(200);
  expect(loginRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(loginRes.body.message).toMatch('Success');
  expect(loginRes.body.authorization).toMatch(/^[a-zA-Z0-9]*$/);

  return loginRes.body.authorization;
}

test('add cities', async () => {
  const authToken = await login();

  const city = { name: 'Orem', population: 89932 };
  const addCitiesRes = await request(app)
    .post('/cities')
    .set('Authorization', `Bearer ${authToken}`)
    .send(city);

  expect(addCitiesRes.status).toBe(200);
  expect(addCitiesRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(addCitiesRes.body).toMatchObject([
    { name: 'Provo', population: 116618 },
    { name: 'Orem', population: 89932 },
  ]);
});
```

The `add cities` test retrieves the token from the `login()` helper and passes it in the `Authorization` header.

## Diagnosing missing coverage

With these tests, coverage is at **93.75%**. To find the missing **6.25%**, you can use the VS Code Jest extension to highlight uncovered lines. In this case, the failure case for a missing or invalid token is not yet tested.

![Missing coverage](missingCoverage.png)

Fix this by writing a test that omits the authorization token and expects a `401 Unauthorized` status.

```js
test('add cities no auth', async () => {
  const city = { name: 'Orem', population: 89932 };
  const addCitiesRes = await request(app).post('/cities').send(city);
  expect(addCitiesRes.status).toBe(401);
});
```

You now have **100% coverage**. In this example, 46 lines of test code are used to verify 30 lines of service code—a ratio of roughly 1.5:1. This investment allows you to refactor or extend the service with confidence.

## ☑ Exercise

Create a Node.js project named `serviceTestingExample`. Reproduce the steps above to solidify your understanding of service testing, Jest, and SuperTest.

Once complete, your coverage report should look like the image below.

![total coverage](totalCoverage.png)