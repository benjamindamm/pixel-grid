import { GridSettings } from '@/types/grid';
import { parseValue } from './grid-calculator';

export function generateGridBackground(
  settings: GridSettings
): string {
  const { baseLine, innerColumnWidth, color, alpha } = settings;
  
  const innerColumnValue = parseValue(innerColumnWidth);
  
  // Calculate outer column as square of inner column (like original Angular component)
  const outerColumn = Math.pow(innerColumnValue, 2);
  const outerColumnPx = `${outerColumn}px`;
  
  const innerColumnPx = innerColumnWidth;
  const baseLinePx = baseLine;
  
  // Convert RGB color to RGBA with alpha - match old extension alpha values
  const rgbaColorInner = colorToRgba(color, alpha / 100);
  const rgbaColorOuter = colorToRgba(color, (alpha / 100) * 0.5 + 0.3); // Slightly more opaque for outer
  
  // Inner column gradient - matches old extension format exactly
  const innerGradient = `repeating-linear-gradient(to right, ${rgbaColorInner}, ${rgbaColorInner} 1px, transparent 1px, transparent calc(${innerColumnValue - 1}px), ${rgbaColorInner} calc(${innerColumnValue - 1}px), ${rgbaColorInner} ${innerColumnPx}, transparent ${innerColumnPx}, transparent ${innerColumnPx})`;
  
  // Outer column gradient - matches old extension format exactly
  const outerGradient = `repeating-linear-gradient(to right, ${rgbaColorOuter}, ${rgbaColorOuter} 1px, transparent 1px, transparent calc(${outerColumn - 1}px), ${rgbaColorOuter} calc(${outerColumn - 1}px), ${rgbaColorOuter} ${outerColumnPx}, transparent ${outerColumnPx}, transparent ${outerColumnPx})`;
  
  // Baseline gradients (vertical) - matches old extension format exactly
  const innerBaseline = `repeating-linear-gradient(${rgbaColorInner}, ${rgbaColorInner} 1px, transparent 1px, transparent ${baseLinePx})`;
  
  const outerBaseline = `repeating-linear-gradient(${rgbaColorOuter}, ${rgbaColorOuter} 1px, transparent 1px, transparent ${outerColumnPx})`;
  
  return `${innerGradient}, ${outerGradient}, ${innerBaseline}, ${outerBaseline}`;
}

export function colorToRgba(color: string, alpha: number): string {
  // Handle rgb(r, g, b) format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }
  
  // Handle hex colors
  const hexMatch = color.match(/#([0-9a-f]{3}|[0-9a-f]{6})/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const r = hex.length === 3 
      ? parseInt(hex[0] + hex[0], 16)
      : parseInt(hex.substring(0, 2), 16);
    const g = hex.length === 3
      ? parseInt(hex[1] + hex[1], 16)
      : parseInt(hex.substring(2, 4), 16);
    const b = hex.length === 3
      ? parseInt(hex[2] + hex[2], 16)
      : parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Fallback
  return color;
}

export function calculateGridWidth(
  viewportWidth: number,
  baseLine: string,
  innerColumnWidth: string
): string {
  const baseLineValue = parseValue(baseLine);
  const innerColumnValue = parseValue(innerColumnWidth);
  const columns = Math.floor(viewportWidth / baseLineValue);
  
  // Sets an overlay width divisible by baseLine to prevent flickering
  return Math.floor(columns * innerColumnValue) + 'px';
}
