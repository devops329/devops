const add = require('./add');
const Pipeline = require('./pipeline');

// Simple introduction

test('add two numbers', () => {
  expect(add(1, 1)).toBe(2);
});

test('add multiple numbers', () => {
  expect(add(1, 2, 3, 4, 5)).toBe(15);
});

// Examples of expect and matchers

test('equality', () => {
  expect(add(1, 1)).toBe(2);
  expect({ id: 2 }.id).toBe(2);

  expect({ id: 2, data: { name: 'cow' }, xid: undefined }).toEqual({ id: 2, data: { name: 'cow' } });
});

test('truthy falsy', () => {
  expect(true).toBeTruthy();
  expect(true).not.toBeFalsy();
  expect(false).not.toBeTruthy();
  expect(false).toBeFalsy();

  expect(undefined).not.toBeDefined();
  expect(undefined).toBeUndefined();

  expect(null).toBeNull();
  expect(null).toBeDefined();
  expect(null).not.toBeUndefined();
  expect(null).not.toBeTruthy();
  expect(null).toBeFalsy();

  expect(0).not.toBeNull();
  expect(0).toBeDefined();
  expect(0).not.toBeUndefined();
  expect(0).not.toBeTruthy();
  expect(0).toBeFalsy();
});

test('numbers', () => {
  expect(4).toBeGreaterThan(3);
  expect(4).toBeGreaterThanOrEqual(3.5);
  expect(4).toBeLessThan(5);
  expect(4).toBeLessThanOrEqual(4.5);
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});

test('regular expressions', () => {
  const body = JSON.stringify({ date: '20240202T00:00:10Z', name: 'orem' });
  expect(body).toMatch(/{"date":".*","name":"orem"}/);
});

test('arrays objects', () => {
  expect('abcd').toContain('bc');
  expect([1, 2, 3]).toContain(2);
  expect([1, 2, 3]).toEqual(expect.arrayContaining([2, 3]));
  expect({ id: 2, cost: 3 }).toHaveProperty('cost', 3);
  expect({ id: 2, cost: 3 }).toEqual(expect.objectContaining({ id: 2 }));
  expect({ id: 2, cost: 3 }).toMatchObject({ id: 2 });
});

test('exceptions', () => {
  expect(() => {
    throw new Error('error');
  }).toThrow();
  expect(() => {}).not.toThrow();
});

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
  await setTimeout(() => {
    timeoutMock();
  }, 1000);
  expect(timeoutMock).not.toHaveBeenCalled();
  expect(Date.now()).toBe(1000);

  jest.advanceTimersByTime(2000);
  expect(Date.now()).toBe(3000);

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
  const stepMock = jest.fn();
  const pipeline = new Pipeline();

  pipeline.add(stepMock);
  pipeline.add(stepMock);

  pipeline.run('call1');
  pipeline.run('call2');

  expect(stepMock).toHaveBeenCalledTimes(4);
  expect(pipeline.mockRun.mock.calls).toEqual([['call1'], ['call2']]);
});
