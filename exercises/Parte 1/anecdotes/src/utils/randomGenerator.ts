function randRangeInt(start: number, stop: number) {
  return Math.floor(start + Math.random() * (stop - start));
}

function randInt(stop: number) {
  return randRangeInt(0, stop);
}

export { randRangeInt, randInt };
