export function nthPosition(n: number) {
  return (
    [`${n}st`, `${n}nd`, `${n}rd`][((((n + 90) % 100) - 10) % 10) - 1] ||
    `${n}th`
  );
}