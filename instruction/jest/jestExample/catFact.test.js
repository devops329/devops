const CatFact = require('./catFact');

function mockFetch(facts) {
  const factMock = jest.fn();
  factMock.mockReturnValue(facts[0]);
  facts.forEach((fact) => factMock.mockReturnValueOnce(fact));
  const fetchMock = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: [factMock()] }),
    })
  );
  global.fetch = fetchMock;

  return [factMock, fetchMock];
}

test('get', async () => {
  const [factMock, fetchMock] = mockFetch(['fact1']);

  const catFact = new CatFact();
  const factPromise = catFact.add();
  expect(factPromise).toBeInstanceOf(Promise);
  expect(await factPromise).toBe('fact1');
  expect(factMock).toBeCalledTimes(1);
  expect(fetchMock).toBeCalledWith('https://meowfacts.herokuapp.com/');
});

test('get fails', async () => {
  const fetchMock = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.reject(500),
    })
  );
  global.fetch = fetchMock;

  const catFact = new CatFact();
  expect(await catFact.add()).toBeNull();
});

test('history', async () => {
  const expectedFacts = ['fact1', 'fact2', 'fact3'];
  const [factMock, fetchMock] = mockFetch(expectedFacts);

  const catFact = new CatFact();
  await catFact.add();
  await catFact.add();
  await catFact.add();
  expect(factMock).toBeCalledTimes(3);
  expect(fetchMock).toBeCalledTimes(3);

  const history = await catFact.history();
  expect(history).toEqual(expectedFacts);
});

test('callback', async () => {
  jest.useFakeTimers({ now: 0 });

  const [factMock, fetchMock] = mockFetch(['fact1', 'fact2', 'fact3']);

  const timerMock = jest.fn();
  const catFact = new CatFact();
  catFact.call(1000, timerMock);

  await jest.advanceTimersByTimeAsync(1000);
  expect(timerMock).toBeCalledTimes(1);
  expect(fetchMock).toBeCalledTimes(1);

  await jest.advanceTimersByTimeAsync(2000);
  expect(timerMock).toBeCalledTimes(3);
  expect(fetchMock).toBeCalledTimes(3);
  expect(factMock.mock.results.length).toBe(3);

  const history = await catFact.history();
  expect(history).toEqual(['fact1', 'fact2', 'fact3']);

  jest.useRealTimers();
});
