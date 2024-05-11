const { add } = require('./index');

test('add two numbers', () => {
  expect(add(1, 1)).toBe(2);
  expect(Number('2')).toBe(2);
  expect({ id: 2 }.id).toBe(2);
  expect({ id: 2, data: { name: 'cow' }, xid: undefined }).toEqual({ id: 2, data: { name: 'cow' } });
});

test('add multiple numbers', () => {
  expect(add(1, 2, 3, 4, 5)).toBe(15);
});

test('null', () => {
  expect('abcd').toContain('bc');
  expect([1, 2, 3]).toContain(2);
  expect([1, 2, 3]).toEqual(expect.arrayContaining([2, 3]));
  expect({ id: 2, cost: 3 }).toHaveProperty('cost', 3);
  expect({ id: 2, cost: 3 }).toEqual(expect.objectContaining({ id: 2 }));

  expect(() => {
    throw new Error('error');
  }).toThrow();
  expect(() => {}).not.toThrow();
});
