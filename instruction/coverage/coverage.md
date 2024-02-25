https://haseebmajid.dev/posts/2023-04-15--how-to-get-code-coverage-from-playwright-tests-in-a-sveltekit-app-/

This turned out to be a simple switch on Jest

```sh
npx jest --coverage
```

Or in the package.json

```json
  "scripts": {
    "test": "jest",
    "test-coverage": "jest --coverage",
    "start": "node index.js",
    "lint": "eslint ."
  },
```
