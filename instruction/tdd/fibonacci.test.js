const fibonacci = require('./fibonacci');

test('fibonacci position 0', () => {
  expect(fibonacci(0)).toBe(0n);
});

test('fibonacci position 1', () => {
  expect(fibonacci(1)).toBe(1n);
});

test('fibonacci sequence', () => {
  const pos = [2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [1n, 2n, 3n, 5n, 8n, 13n, 21n, 34n];
  for (let i = 0; i < pos.length; i++) {
    expect(fibonacci(pos[i])).toBe(expected[i]);
  }
});

test('fibonacci negative', () => {
  expect(fibonacci(-1)).toBe(0n);
});

test('fibonacci position large', () => {
  const x = fibonacci(100);
  console.log(x);
  const t = x === 354224848179261915075n;
  expect(t).toBe(true);
});
