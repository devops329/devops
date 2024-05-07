# Test driven development (TDD)

Describe what TDD is and why it is valuable.

1. Our development environments make it more efficient to run the tests.
1. Creating the tests first make us think about the implementation from the user's perspective.
1. We can run the tests again later to make sure we don't break the functionality. This is called regression testing.
1. We can refactor the code to make it more efficient and still feel confident that the implementation is correct.

We will demonstrate the use of TDD by implementing Fibonacci.

We start by creating an stub version of the function that simply returns zero and place it in a file named `fibonacci.js`.

```js
function fibonacci(pos) {
  return 0;
}

module.exports = fibonacci;
```

Next we install Jest and modify the package.json to tell NPM to use Jest. We install Jest using the `-D` parameter to specify that this is only used during development.

```sh
npm install -D jest
```

```json
  "scripts": {
    "test": "jest"
  },
```

Now we can write a test. We name the test file `fibonacci.test.js` so that we can easily associate the test with the implementation.

Our first test will make sure that the base case for calculating fibonacci at position zero works correctly.

```js
import { fibonacci } from './fibonacci';

test('fibonacci zero', () => {
  expect(fibonacci(0)).toBe(0);
});
```

We then implement the function using a recursive algorithm.

```js
const fibonacci = require('./fibonacci');

test('fibonacci position 0', () => {
  expect(fibonacci(0)).toBe(0);
});
```

We run our tests using the `npm test` command. This finds the script in our `package.json` file and executes what we specified there. In this case it runs `jest`.

```sh
npm test

PASS ./fibonacci.test.js
  ✓ fibonacci position 0 (1 ms)

Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

Strangely our test passes, but that is only because we threw in a default value of zero for our stub implementation and that is the correct response for the fibonacci position zero. We will leave that test there to serve as a base case and to make sure we don't break anything as we implement the actual code.

Let's add another test and run it.

```js
test('fibonacci position 1', () => {
  expect(fibonacci(1)).toBe(1);
});
```

Our original test still passes, but now we get a failure for the position 1 test.

```sh
npm test

 FAIL  ./fibonacci.test.js
  ✓ fibonacci position 0 (1 ms)
  ✕ fibonacci position 1 (1 ms)

  ● fibonacci position 1

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

       6 |
       7 | test('fibonacci position 1', () => {
    >  8 |   expect(fibonacci(1)).toBe(1);
         |                        ^
       9 | });
      10 |

      at Object.toBe (fibonacci.test.js:8:24)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

Let's add one more test before we actually implement the function. This test will execute an array of positions. This will save us from write a single test for each position. When writing testing you want to try and comply with the following principles.

1. **Don't repeat yourself** - If one test covers the case then don't keep writing tests that do the same thing.
1. **Only test one thing** - Don't put a bunch of related tests into the same test. This is makes it harder to debug a test when only part of the test is failing.
1. **Include boundaries** - There are often natural boundaries to a test. Make sure you include them in your tests.

The following test might be considered as violating the **Only test one thing** principle, but the clarity that it provides and the simplicity of the test seems to justify the exception.

```js
test('fibonacci sequence', () => {
  const pos = [2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [1, 2, 3, 5, 8, 13, 21, 34];
  for (let i = 0; i < pos.length; i++) {
    expect(fibonacci(pos[i])).toBe(expected[i]);
  }
});
```

Now we are ready to drive the implementation of our code with our tests.

```js
function fibonacci(pos) {
  if (pos === 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  return fibonacci(pos - 1) + fibonacci(pos - 2);
}
```

We also need to add a couple boundary tests. For example, what happens if we pass a negative number for our position, or if we pass a really large position. If we run these tests we will confirm that they are also failing.

```js
test('fibonacci negative', () => {
  expect(fibonacci(-1)).toBe(0);
});

test('fibonacci position 100', () => {
  expect(fibonacci(100)).toBe(354224848179261915075);
});
```

```js
function fibonacci(pos) {
  if (pos <= 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= pos; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
```
