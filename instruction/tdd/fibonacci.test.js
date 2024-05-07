const fibonacci = require('./fibonacci');

test('fibonacci position 0', () => {
  expect(fibonacci(0)).toBe(0);
});

test('fibonacci position 1', () => {
  expect(fibonacci(1)).toBe(1);
});

test('fibonacci sequence', () => {
  const pos = [2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [1, 2, 3, 5, 8, 13, 21, 34];
  for (let i = 0; i < pos.length; i++) {
    expect(fibonacci(pos[i])).toBe(expected[i]);
  }
});

test('fibonacci negative', () => {
  expect(fibonacci(1)).toBe(1);
});

test('fibonacci position 100', () => {
  expect(fibonacci(100)).toBe(354224848179261915075);
});
