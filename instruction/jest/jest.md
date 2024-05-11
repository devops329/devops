# Jest

[Jest](https://jestjs.io/)

🚧 Who created Jest?

In order to use Jest a your unit testing framework you need to first create an NPM project and install Jest package. Note that then installing we use the `-D` parameter to tell NPM that Jest is only used during development and it shouldn't be included in any production deployment.

```sh
mkdir jesttest && cd jesttest
npm init -y
npm install -D jest
```

Then change the package.json script so that the `test` command runs Jest.

```json
{
  "name": "jesttest",
  "main": "index.js",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

Now you need a simple test that will demonstrate that everything is wired up correctly. All you need to do is include the phrase `.test.` as part of your file name and Jest will pick the test up automatically. In this test we just expect that one plus one will be 2. Notice how the Jest syntax reads naturally.

**index.test.js**

```js
test('1 + 1 equals 2', () => {
  expect(1 + 1).toBe(2);
});
```

With the Jest package installed and our first test written, we can run it with the NPM test command. This results in the following:

```sh
npm test

 PASS  ./index.test.js
  ✓ 1 + 1 equals 2 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.122 s
Ran all test suites.
```

## Calling code from the test

That run isn't very interesting since it only runs code within the test itself. So instead let's create a function called add in an `index.js` file and have the test call that instead.

```js
function add(...numbers) {
  return numbers.reduce((a, c) => (a += c), 0);
}

module.exports = { add };
```

You can then rewrite the test to import and use our new test. Let's add another test that is a little more complex.

```js
const { add } = require('./index');

test('add two numbers', () => {
  expect(add(1, 1)).toBe(2);
});

test('add multiple numbers', () => {
  expect(add(1, 2, 3, 4, 5)).toBe(2);
});
```

When we rerun the tests, the first test works great, but the second test fails. This is because the test is incorrectly expected the wrong resulting value. After fixing the value to be the correct result of `15`, everything works great.

```sh
npm test

 FAIL  ./index.test.js
  ✓ add two numbers (1 ms)
  ✕ add multiple numbers (1 ms)

  ● add multiple numbers
    Expected: 2
    Received: 15

       6 |
       7 | test('add multiple numbers', () => {
    >  8 |   expect(add(1, 2, 3, 4, 5)).toBe(2);
         |                              ^
       9 | });
      10 |

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

## Jest configuration

[Jest configuration docs](https://jestjs.io/docs/configuration)

You may have noticed that you didn't have to import the Jest dependencies or specify where your test files were in order for the tests to run. That is because when Jest runs it analyzes all of the project paths and looks for files that match a regex pattern of `**/?(*.)+(spec|test).[tj]s?(x)`. When it finds those files, it runs them in an environment where the Jest code is already loaded.

You can override the default configuration for Jest by adding a `jest.config.json` file to your project. In that file you can specify options such as a different regex pattern for matching tests, making the output verbose, collecting coverage, and automatically generating mocks.

Here is a configuration file that tests jest to collect coverage information and output verbose information. Everything looks great. All the tests are passing and you have 100% coverage.

```json
{
  "collectCoverage": true,
  "verbose": true
}
```

Now you get simple coverage information returned when you run the tests.

```sh
npm test

 PASS  ./index.test.js
  ✓ add two numbers (1 ms)
  ✓ add multiple numbers (1 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 index.js |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

## Jest test primitives

## Mocking with Jest

## Making fetch requests

You can then run Jest and it will gi

To [debug](https://jestjs.io/docs/troubleshooting#debugging-in-vs-code) you need to add a launch config.

```json
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--inspect-brk",
        "${workspaceRoot}/server/node_modules/.bin/jest",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
```

and add a `jest.config.js` empty file to the root of your project.

I rewrote the tests to use async await instead of the `done` Jest callback. This makes it easier to call multiple endpoints.

Also note the use of regex to match the response.

```js
test('update a store', async () => {
  await request(app).post('/store/orem');
  await request(app)
    .put('/store/orem')
    .send({ manager: 'joe' })
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(/{"date":".*","name":"orem","manager":"joe"}/);
});
```

I install the vs code extension for jest and now I can just push a button. to run the tests and debug. Much easier than setting up a run config!
