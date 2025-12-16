export interface GridSettings {
  baseLine: string;
  innerColumnWidth: string;
  outerColumnWidth: string;
  color: string;
  alpha: number;
  offsetX: number;
  offsetY: number;
  zIndex: number;
  visible: boolean;
}

export const DEFAULT_GRID_SETTINGS: GridSettings = {
  baseLine: '8px',
  innerColumnWidth: '8px',
  outerColumnWidth: '64px',
  color: 'rgb(52,152,219)',
  alpha: 10,
  offsetX: 0,
  offsetY: 0,
  zIndex: 100000,
  visible: false,
};
