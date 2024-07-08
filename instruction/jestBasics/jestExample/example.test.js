const { add } = require('./add');

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
