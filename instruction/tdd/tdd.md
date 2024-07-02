# Test driven development (TDD)

🔑 **Key points**

- Test driven development (TDD) accelerates development and enables refactoring.
- Master TDD through practice.

---

Test driven development inverts the development process by focusing first on what the code is supposed to do, and then implementing the code until all of the tests pass.

1. You can isolate your testing to the specific objects you are currently implementing.
1. Development environments make it more efficient to run the tests than just manually building, executing, and interacting with the code.
1. Creating the tests first make you focus on the implementation from the user's perspective.
1. You can run the tests again whenever you make a change to the code to make sure we don't unintentionally break the functionality. This is called regression testing.
1. You can refactor the code to make it cleaner or more efficient and still feel confident that the implementation is correct by rerunning the tests.

When writing testing you want to try and comply with the following principles.

1. **Don't repeat yourself** - If one test covers the case then don't keep writing tests that do the same thing.
1. **Only test one thing** - Don't put a bunch of related tests into the same test. This is makes it harder to debug a test when only part of the test is failing.
1. **Include boundaries** - There are often natural boundaries to a test. Make sure you include them in your tests.

We will demonstrate the use of TDD by implementing Fibonacci.

## Writing tests first

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

We also modify the scripts section of the `package.json` file to specify that we want to use Jest when we run tests.

**package.json**

```json
  "scripts": {
    "test": "jest"
  },
```

## Running our first tests

Now we can write a test. We will name the test file `fibonacci.test.js` so that we can easily associate the test with the implementation found in `fibonacci.js`.

Our first test will make sure that the base case for calculating fibonacci at position zero works correctly.

```js
const fibonacci = require('./fibonacci.js')

test('fibonacci zero', () => {
  expect(fibonacci(0)).toBe(0);
});
```

We then run our tests using the `npm test` command. This uses the script named `test` that we created in our `package.json` file.

```sh
➜ npm test

PASS ./fibonacci.test.js
  ✓ fibonacci position 0 (1 ms)

Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

Strangely our test passes, but that is only because we threw in a default value of zero for our stub implementation and that is the correct response for the fibonacci position zero. This is a good reminder that you shouldn't assume the code is correct just because a test passes. Usually you want to see your test fail first and then correct the code to make it pass. That way you know it isn't a bug in the test that is hiding a bug in your code.

We will leave that test there to serve as a base case and to make sure we don't break anything as we implement the actual code.

Let's add another test that covers another basic case so that we can see a failure.

```js
test('fibonacci position 1', () => {
  expect(fibonacci(1)).toBe(1);
});
```

```sh
➜ npm test

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

## Covering the basic functionality

Now that we are confident that the tests are working correctly, let's another test that covers multiple calls to our fibonacci implementation. By running through a list of positions we will save ourselves from write a single test for each position. this be considered as violating the **Only test one thing** principle, but the clarity and simplicity that it provides seems to justify the exception.

```js
test('fibonacci sequence', () => {
  const pos = [2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [1, 2, 3, 5, 8, 13, 21, 34];
  for (let i = 0; i < pos.length; i++) {
    expect(fibonacci(pos[i])).toBe(expected[i]);
  }
});
```

Now we are ready to drive the implementation of our code with our tests. Let's start with a simple recursive implementation.

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

When we run our tests we see that they are all passing now.

```sh
➜ npm test

 PASS  ./fibonacci.test.js
  ✓ fibonacci position 0 (1 ms)
  ✓ fibonacci position 1
  ✓ fibonacci sequence (2 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.184 s
Ran all test suites.
```

## Boundary cases and bug discovery

That looks great. Now let's add a boundary test case where we provide a negative number. Since fibonacci doesn't define what to do with a negative position we will assume it should be zero.

```js
test('fibonacci negative', () => {
  expect(fibonacci(-1)).toBe(0);
});
```

This fails with a stack size exceeded error.

```sh
➜  npm test

 FAIL  ./fibonacci.test.js
  ✓ fibonacci position 0 (1 ms)
  ✓ fibonacci position 1 (2 ms)
  ✓ fibonacci sequence (1 ms)
  ✕ fibonacci negative (1 ms)

  ● fibonacci negative

    RangeError: Maximum call stack size exceeded
```

A review of our code show that providing a negative number will just keep going negative infinitely. We fix this by modifying the first condition to also handle negative numbers. Now all the tests pass.

```js
function fibonacci(pos) {
  if (pos <= 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  return fibonacci(pos - 1) + fibonacci(pos - 2);
}
```

Let's add one more boundary test that represents a large fibonacci position.

```js
test('fibonacci position large', () => {
  expect(fibonacci(100)).toBe(354224848179261915075);
});
```

When we run this test, it seems to block and never return. That is because a recursive implementation is O(2^n) which is 1.2676506002×10³⁰ calculations for the 100th position. To solve this we need to rewrite the function using an iterative approach.

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

This implementation passes all the tests except for the `position large` test. Here we hit a problem with the JavaScript numeric type is not large enough to represent the desired value.

```sh
 FAIL  ./fibonacci.test.js
  ✕ fibonacci position large (1 ms)
  ● fibonacci position large

    expect(received).toBe(expected) // Object.is equality

    Expected: 354224848179261900000
    Received: 354224848179262000000
```

To solve this we need to convert both our tests and our code to use the BigInt numeric type. That makes our code look like the following.

**fibonacci.js**

```sh
function fibonacci(pos) {
  if (pos <= 0) {
    return 0n;
  }
  if (pos === 1) {
    return 1n;
  }
  let prev = 0n;
  let curr = 1n;
  for (let i = 2; i <= pos; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

module.exports = fibonacci;
```

**fibonacci.test.js**

```sh
const fibonacci = require('./fibonacci');

test('fibonacci position 0', () => {
  expect(fibonacci(0)).toBe(0n);
});

test('fibonacci position 1', () => {
  expect(fibonacci(1)).toBe(1n);
});

test('fibonacci sequence', () => {
  const pos = [2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [1n, 2n, 3n, 5n, 8n, 13n, 21n, 34n];
  for (let i = 0; i < pos.length; i++) {
    expect(fibonacci(pos[i])).toBe(expected[i]);
  }
});

test('fibonacci negative', () => {
  expect(fibonacci(-1)).toBe(0n);
});

test('fibonacci position large', () => {
  const x = fibonacci(100);
  console.log(x);
  const t = x === 354224848179261915075n;
  expect(t).toBe(true);
});
```

Now the tests all pass.

## Refactoring and regression testing

As a final step we can refactor the implementation to make it more concise and then run the tests again to make sure we didn't break anything with our new representation.

```js
function fibonacci(pos) {
  let [prev, curr] = [0n, 1n];
  for (let i = 2; i <= pos; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return pos <= 0 ? prev : curr;
}
```

## Final thoughts

Hopefully you have seen how TDD allows you to discover problems you would not have otherwise found, speed up your development, and generate confidence that your code still works when you make changes.

When your tests pass it is also a good place to commit your changes to your version repository since you know you are in a stable state.

## ☑ Assignment

Create a node.js project named tddExample. Reproduce the steps given above in order to solidify your understanding of the concepts.

Once you are done, go over to Canvas and submit that you have completed this.
