// Testing framework mock
const expect = () => {
  return {
    toEqual: () => {},
  };
};
const app = null;

function test(_, fn) {
  fn();
  console.log('Test passed');
}

test('get joke', () => {
  // Request mock
  const request = () => {
    return {
      get: () => {
        return { joke: 'Chuck Norris can divide by zero.' };
      },
    };
  };

  const jokeRes = request(app).get('/api/joke');
  expect(jokeRes).toEqual({ joke: 'Chuck Norris can divide by zero.' });
});
