# Test-Driven Development (TDD)

🔑 **Key points**

- Test-driven development (TDD) accelerates development and enables confident refactoring.
- TDD follows a "Red-Green-Refactor" cycle.
- Mastery of TDD comes through consistent practice.

---

Test-driven development ([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) was popularized in the late 1990s as a core practice of [Extreme Programming (XP)](https://en.wikipedia.org/wiki/Extreme_programming). The methodology shifts the focus: instead of writing code and then testing it, you begin by creating tests that define the intended behavior of your software. You then use these tests to drive the implementation. When the tests pass, you have verification that your code meets the requirements.

Research suggests that TDD can add approximately 15% to initial development time. However, this investment yields significant long-term benefits: it encourages better abstractions, produces accurate domain models, provides "living" documentation through examples, results in fewer bugs, and creates a safety net that prevents regressions (introducing new bugs while fixing old ones).

TDD enhances the development process by integrating testing into the coding workflow. This forces you to focus first on *what* the code is supposed to do rather than *how* you will implement it. TDD works best as a continuous "conversation" between the implementation and the tests. You stub out a function, write a test case, implement just enough code to make it pass, and then repeat. This approach ensures your code is usable, satisfies the requirements, and remains stable as the codebase grows.

Today, TDD is a standard industry practice. While it takes effort to learn how to write effective and efficient tests, making TDD a foundational part of your workflow will provide a significant advantage in your professional career.

We will demonstrate TDD by implementing a function to calculate the Fibonacci sequence.

## Writing tests first

We begin by creating a "stub" version of the function in a file named `fibonacci.js`. This stub does the bare minimum to be executable.

```js
function fibonacci(pos) {
  return 0;
}

module.exports = fibonacci;
```

Next, we initialize our environment. We install Jest using the `-D` (or `--save-dev`) flag to specify that it is a development dependency, not required for the production environment.

```sh
npm install -D jest
```

We then modify the `scripts` section of the `package.json` file to define how to run our tests.

**package.json**

```json
  "scripts": {
    "test": "jest"
  },
```

## Running our first tests

Now we can write our first test. We will name the file `fibonacci.test.js` so Jest can automatically find it and associate it with our implementation.

Our first test ensures that the base case—the Fibonacci value at position zero—is calculated correctly.

```js
const fibonacci = require('./fibonacci.js');

test('fibonacci position 0', () => {
  expect(fibonacci(0)).toBe(0);
});
```

Run the test using the `npm test` command:

```sh
➜ npm test

PASS ./fibonacci.test.js
  ✓ fibonacci position 0 (1 ms)

Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

Interestingly, our test passes, but only because our stub happens to return `0`. This is a crucial TDD lesson: **never assume code is correct just because a test passes.** You should generally see a test fail first (the "Red" phase) before writing the code to make it pass (the "Green" phase). This ensures the test is actually validating the logic and isn't a "false positive."

Let's add a second test case to trigger a failure.

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
...
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

## Covering the basic functionality

Now that we have seen a failure, we can expand our test suite. We will use a loop to check multiple positions in the sequence. While some developers argue this violates the "test only one thing" principle, the clarity and coverage it provides for mathematical functions often justify the approach.

```js
test('fibonacci sequence', () => {
  const pos = [2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [1, 2, 3, 5, 8, 13, 21, 34];
  for (let i = 0; i < pos.length; i++) {
    expect(fibonacci(pos[i])).toBe(expected[i]);
  }
});
```

Now we drive the implementation. We will start with a simple recursive approach.

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

Running `npm test` now shows all three tests passing.

## Boundary cases and bug discovery

With the basic logic working, we should test "edge cases," such as negative numbers. Since the Fibonacci sequence is typically defined for non-negative integers, we will assume our function should return `0` for negative inputs.

```js
test('fibonacci negative', () => {
  expect(fibonacci(-1)).toBe(0);
});
```

Running this results in a failure:

```sh
 FAIL  ./fibonacci.test.js
...
  ✕ fibonacci negative (1 ms)

  ● fibonacci negative

    RangeError: Maximum call stack size exceeded
```

Our recursive logic causes an infinite loop for negative numbers, eventually overflowing the stack. We can fix this by updating our base case to handle any input less than or equal to zero.

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

Next, let's test a very large Fibonacci position.

```js
test('fibonacci position large', () => {
  expect(fibonacci(100)).toBe(354224848179261915075n);
});
```

This test causes the process to hang. The recursive implementation has a time complexity of $O(2^n)$, requiring roughly $1.26 \times 10^{30}$ operations for the 100th position. To fix this, we must refactor to an iterative approach.

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

Even with the iterative fix, the test fails because JavaScript's standard `Number` type cannot accurately represent integers of that size (it loses precision after `Number.MAX_SAFE_INTEGER`).

```sh
 Expected: 354224848179261915075n
 Received: 354224848179262000000
```

To solve this, we must use the `BigInt` primitive for both the implementation and the tests.

**fibonacci.js**

```js
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

```js
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
  expect(fibonacci(100)).toBe(354224848179261915075n);
});
```

## Refactoring and regression testing

The final stage of the TDD cycle is **Refactor**. Now that we have a full suite of passing tests, we can rewrite the implementation to be more concise. Because we have tests, we can refactor with confidence, knowing that any mistakes will be caught immediately.

```js
function fibonacci(pos) {
  let [prev, curr] = [0n, 1n];
  for (let i = 2; i <= pos; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return pos <= 0 ? prev : curr;
}
```

Running the tests again confirms our refactored code still works perfectly.

## Final thoughts

TDD allows you to discover architectural problems early, speed up development by reducing manual debugging, and provides the confidence to change code without fear of breaking existing functionality.

A helpful tip: whenever a test passes, it is a great time to commit your changes to version control (like Git), as you know the application is in a stable state.

## ☑ Exercise

Create a Node.js project named `tddExample`. Reproduce the steps provided above to solidify your understanding of the TDD cycle.