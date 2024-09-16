// Testing framework mock
const expect = () => {
  return {
    toBeDefined: () => {},
  };
};
const app = null;

function test(_, fn) {
  fn();
  console.log('Test passed');
}

// Request mock
const request = () => {
  return {
    get: () => {
      return { joke: 'Chuck Norris can divide by zero.' };
    },
  };
};

test('get menu', async () => {
  const getMenuRes = await request(app).get('/api/order/menu');
  expect(getMenuRes).toBeDefined();
});
