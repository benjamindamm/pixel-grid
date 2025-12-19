/**
 * Parses a CSS value string (e.g., '16px', '1.5em') and returns its numeric value.
 * 
 * @param value - A CSS value string that includes a numeric value and unit (e.g., '16px').
 * @returns The numeric value extracted from the string, or 0 if parsing fails.
 */
export function parseValue(value: string): number {
  const match = value.match(/^([+-]?[0-9]+\.?[0-9]*)(px|em|ex|%|in|cm|mm|pt|pc)$/);
  if (!match) return 0;
  return parseFloat(match[1]);
}

/**
 * Validates whether a given string represents a valid CSS unit.
 * 
 * @param value - A string to validate as a CSS unit.
 * @returns True if the value is a valid CSS unit, false otherwise.
 */
export function isValidUnit(value: string): boolean {
  const pattern = /^(auto|0)$|^[+-]?[0-9]+\.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$/;
  return pattern.test(value);
}

/**
 * Calculates the number of columns that can fit within a given viewport width based on a base line.
 * 
 * @param viewportWidth - The width of the viewport in pixels.
 * @param baseLine - The base line value (e.g., '16px').
 * @returns The number of columns that fit within the viewport width.
 */
export function calculateColumns(viewportWidth: number, baseLine: string): number {
  const baseLineValue = parseValue(baseLine);
  if (baseLineValue === 0) return 0;
  return Math.floor(viewportWidth / baseLineValue);
}

/**
 * Calculates a repeating width CSS value based on the number of columns.
 * 
 * @param columns - The number of columns.
 * @returns A CSS width string using calc() to evenly distribute columns.
 */
export function calculateRepeatingWidth(columns: number): string {
  return `calc(100% / ${columns})`;
}
