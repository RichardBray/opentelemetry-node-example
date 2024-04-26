function rollOnce(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function rollTheDice(rolls: number) {
  const result: number[] = [];
  for (let i = 0; i < rolls; i++) {
    result.push(rollOnce(1, 6));
  }
  return result;
}
