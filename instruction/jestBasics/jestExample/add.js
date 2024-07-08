function add(...numbers) {
  return numbers.reduce((a, c) => (a += c), 0);
}

module.exports = { add };
