import { useEffect, useState } from 'react';

import { Button } from './ui/button';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const BASE_COLORS = [
  [46, 204, 113],
  [52, 152, 219],
  [155, 89, 182],
  [52, 73, 94],
  [241, 196, 15],
  [230, 126, 34],
  [231, 76, 60],
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);

  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return '#3498db';
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r},${g},${b})`;
  };

  const handleColorChange = (hex: string) => {
    setCurrentColor(hexToRgb(hex));
    onChange(hexToRgb(hex));
  };

  const handleBaseColorClick = (color: number[]) => {
    const rgb = `rgb(${color.join(',')})`;
    setCurrentColor(rgb);
    onChange(rgb);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2.5">
        {BASE_COLORS.map((color, index) => {
          const rgb = `rgb(${color.join(',')})`;
          const isActive = currentColor === rgb;
          return (
            <button
              key={index}
              onClick={() => handleBaseColorClick(color)}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-200",
                "ring-2 ring-offset-2 ring-offset-white",
                isActive 
                  ? "ring-blue-500 scale-110 shadow-lg" 
                  : "ring-transparent hover:scale-105 hover:shadow-md"
              )}
              style={{ backgroundColor: rgb }}
              aria-label={`Select color ${index + 1}`}
            />
          );
        })}
      </div>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPicker(!showPicker)}
          className="w-full rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-11 px-4 justify-start gap-3"
        >
          <div
            className="h-6 w-6 rounded-lg shadow-sm border border-gray-200"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-sm font-medium text-gray-700">Custom Color</span>
        </Button>
        {showPicker && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
            <HexColorPicker
              color={rgbToHex(currentColor)}
              onChange={handleColorChange}
              style={{ width: '100%' }}
            />
            <Button
              type="button"
              onClick={() => setShowPicker(false)}
              className="w-full mt-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
