const Pipeline = require('./pipeline');

// Mocking functions

test('mocking functions', () => {
  const mockFn = jest.fn((p) => `${p}`);

  mockFn(1);
  mockFn(2);

  expect(mockFn.mock.calls[0][0]).toBe(1);
  expect(mockFn.mock.results[0].value).toBe('1');

  expect(mockFn.mock.calls[1][0]).toBe(2);
  expect(mockFn.mock.results[1].value).toBe('2');
});

test('mocking function matchers', () => {
  const mockFn = jest.fn((p) => `${p}`);

  expect(mockFn(1)).toBe('1');
  expect(mockFn(2)).toBe('2');

  expect(mockFn).toHaveBeenCalledWith(1);
  expect(mockFn).toHaveBeenLastCalledWith(2);
});

test('mocking function multiple calls', () => {
  const mockFn = jest.fn();

  // Set the default return value to 42
  mockFn.mockReturnValue(42);
  expect(mockFn()).toBe(42);

  // Override the default for the next two calls to 1 and 2
  mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);
  expect(mockFn()).toBe(1);
  expect(mockFn()).toBe(2);

  // Next call is back to the default
  expect(mockFn()).toBe(42);
});

test('mocking callback functions', () => {
  const mockStep = jest.fn();

  new Pipeline().add(mockStep).add(mockStep).run('data');

  expect(mockStep).toHaveBeenCalledTimes(2);
  expect(mockStep.mock.calls).toEqual([['data'], ['data']]);
});

test('mocking promises', async () => {
  const mockFn = jest.fn().mockResolvedValue(42);

  const result = await mockFn();
  expect(result).toBe(42);
});

// Fake timers
test('fake timers', async () => {
  jest.useFakeTimers({ now: 0 });
  expect(Date.now()).toBe(0);

  jest.advanceTimersByTime(1000);
  expect(Date.now()).toBe(1000);

  // Still 1000 even after waiting
  const timeoutMock = jest.fn();
  setTimeout(() => {
    timeoutMock();
  }, 1000);
  expect(timeoutMock).not.toHaveBeenCalled();
  expect(Date.now()).toBe(1000);

  jest.advanceTimersByTime(2000);
  expect(timeoutMock).toHaveBeenCalled();
  expect(Date.now()).toBe(3000);

  jest.useRealTimers();
});

// Async fake timers
test('async fake timers', async () => {
  jest.useFakeTimers({ now: 0 });

  const timerMock = jest.fn();

  setInterval(async () => {
    timerMock(Date.now());
  }, 1000);

  await jest.advanceTimersByTimeAsync(1000);
  expect(timerMock).toHaveBeenCalledTimes(1);

  await jest.advanceTimersByTimeAsync(1000);
  expect(timerMock).toHaveBeenCalledTimes(2);

  jest.useRealTimers();
});

// Fetch mock
test('fetches data', async () => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      json: () => {
        switch (url) {
          case 'https://one.com':
            return Promise.resolve({ data: 'one data' });
          case 'https://two.com':
            return Promise.resolve({ data: 'two data' });
          default:
            return Promise.resolve({ data: 'default data' });
        }
      },
    })
  );

  const response = await fetch('https://two.com');
  const data = await response.json();
  expect(data).toEqual({ data: 'two data' });
  expect(fetch).toHaveBeenCalledWith('https://two.com');
});

// Mocking class using module mock

jest.mock('./pipeline', () => {
  const originalModule = jest.requireActual('./pipeline');
  return class MockPipeline extends originalModule {
    constructor() {
      super();
      this.mockRun = jest.fn();
    }
    run(p) {
      super.run(p);
      return this.mockRun(p);
    }
  };
});

test('mocking modules', () => {
  const pipeline = new Pipeline();

  const stepMock = jest.fn();
  pipeline.add(stepMock);
  pipeline.add(stepMock);

  pipeline.run('call1');
  pipeline.run('call2');

  expect(stepMock).toHaveBeenCalledTimes(4);
  expect(pipeline.mockRun.mock.calls).toEqual([['call1'], ['call2']]);
});
