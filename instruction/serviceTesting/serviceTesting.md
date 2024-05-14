# Service testing

[Jest](https://jestjs.io/)
[SuperTest](https://www.testim.io/blog/supertest-how-to-test-apis-like-a-pro/)

create a HTTP service using Express that has the following endpoints:

- a login endpoint that sets an authorization cookie
- a get endpoint that doesn't require authorization but returns a list of city names and their populations
- a post endpoint that requires an authorization cookie and inserts a new city with its population

## Create an example service

```sh
npm init -y
npm install express cookie-parser
```

Create `service.js` to represent a simple Express HTTP service.

```js

```

Create `index.js` to include a simple Express HTTP service.

```js
const app = require('./service.js');

const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Service started on port ${port}`);
});
```

## Add Jest and Supertest

```sh
npm install -D jest supertest
```

```json
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.4"
  }
```

## Setup service for testing

In order to test service endpoints you need to abstract the express app so that SuperTest can launch it. This is already done in `jwt-pizza-service` and so all you have to do is use it.

## Run the tests

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

## Create a service test
