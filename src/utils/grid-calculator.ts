export function parseValue(value: string): number {
  const match = value.match(/^([+-]?[0-9]+\.?[0-9]*)(px|em|ex|%|in|cm|mm|pt|pc)$/);
  if (!match) return 0;
  return parseFloat(match[1]);
}

export function isValidUnit(value: string): boolean {
  const pattern = /^(auto|0)$|^[+-]?[0-9]+\.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$/;
  return pattern.test(value);
}

export function calculateColumns(viewportWidth: number, baseLine: string): number {
  const baseLineValue = parseValue(baseLine);
  if (baseLineValue === 0) return 0;
  return Math.floor(viewportWidth / baseLineValue);
}

export function calculateRepeatingWidth(columns: number): string {
  return `calc(100% / ${columns})`;
}
