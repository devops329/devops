# Service testing

[Jest](https://jestjs.io/)
[SuperTest](https://www.testim.io/blog/supertest-how-to-test-apis-like-a-pro/)

Rewrite this with the example fo an actual simple service.

Add Jest and Supertest

```sh
npm install -D jest supertest
```

```json
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.4"
  }
```

In order to test service endpoints you need to abstract the express app so that SuperTest can launch it.

Write a test

```js
const request = require('supertest');
const app = require('./server');

test('getStore returns the desired store', (done) => {
  request(app)
    .get('/store/provo')
    .expect(200)
    .expect({ name: 'provo' })
    .end((err) => (err ? done(err) : done()));
});

test('putStore update a store without new information', (done) => {
  request(app)
    .post('/store/orem')
    .expect(200)
    .expect(obj.name)
    .toBe('orem')
    .expect({ name: 'orem' })
    .end((err) => (err ? done(err) : done()));
});
```

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
