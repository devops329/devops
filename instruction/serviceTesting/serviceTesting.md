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
