test('find method test', () => {
  const array = [1, 2, 3, 4, 5];
  expect(array.find((value) => value === 2)).toBe(2);
  expect(array.map((value) => value === 2)).toBe(2);
});
