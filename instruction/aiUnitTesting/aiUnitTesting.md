# AI unit testing

## Introduction

AI-powered tools are increasingly being used to assist with software testing, including the generation of unit tests. By leveraging large language models (LLMs) and prompt-based systems, developers can automate the creation of test cases, improve coverage, and accelerate the testing process. This approach comes with both significant benefits and notable challenges.

## Benefits of using AI for unit testing

- **Speed and Efficiency**: AI can quickly generate a large number of test cases, reducing manual effort and saving time.
- **Improved Coverage**: AI tools can analyze code and suggest tests for edge cases that developers might overlook.
- **Consistency**: Automated test generation ensures consistent structure and style across tests.
- **Learning and Documentation**: AI-generated tests can serve as examples for new team members and help document expected behavior.
- **Integration with CI/CD**: AI can continuously generate and update tests as code changes, supporting modern DevOps workflows.

## Problems and Challenges

- **Quality and Relevance**: AI-generated tests may not always be meaningful or relevant to business logic.
- **False Positives/Negatives**: Poorly generated tests can pass when they should fail, or vice versa, leading to a false sense of security.
- **Maintenance**: Automated tests may require frequent updates as code evolves, especially if generated without deep context.
- **Security and Privacy**: Using cloud-based AI tools may expose proprietary code or sensitive data.
- **Overfitting**: AI may generate tests that only match the current implementation, missing broader requirements or future changes.

## Generating tests with AI

Let's demonstrate how AI can be used to generate unit tests. We'll use a prompt-based approach to instruct the AI to create tests.

### Basic example

In this example we have code that adds numbers.

```js
function add(...numbers) {
  return numbers.reduce((a, c) => (a += c), 0);
}
module.exports = { add };
```

We could then use a chat prompt to automatically generate our tests for us.

> "Write Jest unit tests for the `add` function that covers adding two numbers, multiple numbers, and edge cases like no arguments."

```js
const { add } = require('./add');

test('add two numbers', () => {
  expect(add(1, 1)).toBe(2);
});

test('add multiple numbers', () => {
  expect(add(1, 2, 3, 4, 5)).toBe(15);
});

test('add no arguments', () => {
  expect(add()).toBe(0);
});

test('add negative numbers', () => {
  expect(add(-1, -2, -3)).toBe(-6);
});
```

### Advanced example

Suppose we have a class name `CatFact` that fetches data asynchronously. We can prompt the AI to generate tests that mock fetch requests and test error handling.

```js
class CatFact {
  constructor() {
    this.facts = [];
  }
  async add() {
    try {
      const response = await fetch('https://meowfacts.herokuapp.com/');
      const payload = await response.json();
      const fact = payload.data[0];
      this.facts.push(fact);
      return fact;
    } catch (error) {
      return null;
    }
  }
  history() {
    return this.facts;
  }
}
module.exports = CatFact;
```

We could then use the following prompt to generate tests.

> "Write Jest tests for the CatFact class, mocking fetch to return a fact and to throw an error."

```js
const CatFact = require('./CatFact');

describe('CatFact', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('add pushes fact to facts array', async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: ['Cats purr.'] }),
    });
    const catFact = new CatFact();
    const fact = await catFact.add();
    expect(fact).toBe('Cats purr.');
    expect(catFact.history()).toContain('Cats purr.');
  });

  test('add returns null on fetch error', async () => {
    fetch.mockRejectedValue(new Error('Network error'));
    const catFact = new CatFact();
    const fact = await catFact.add();
    expect(fact).toBeNull();
  });
});
```

## Conclusion

AI-assisted unit testing can dramatically improve productivity and coverage, but it is not a replacement for thoughtful, context-aware test design. Developers should review and refine AI-generated tests to ensure they are meaningful and maintainable. Used wisely, AI is a powerful tool in the modern DevOps toolkit.
