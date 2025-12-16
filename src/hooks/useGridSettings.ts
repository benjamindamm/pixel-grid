import { DEFAULT_GRID_SETTINGS, GridSettings } from '@/types/grid';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'plugin.pixelGrid';

export function useGridSettings() {
  const [settings, setSettings] = useState<GridSettings>(DEFAULT_GRID_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Chrome storage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
          setSettings({ ...DEFAULT_GRID_SETTINGS, ...result[STORAGE_KEY] });
        }
        setIsLoading(false);
      });
    } else {
      // Fallback to localStorage for development
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setSettings({ ...DEFAULT_GRID_SETTINGS, ...JSON.parse(stored) });
        } catch (e) {
          console.error('Failed to parse stored settings', e);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Save to Chrome storage
  const saveSettings = useCallback((newSettings: GridSettings) => {
    setSettings(newSettings);
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ [STORAGE_KEY]: newSettings });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    }
  }, []);

  // Update single setting
  const updateSetting = useCallback(<K extends keyof GridSettings>(
    key: K,
    value: GridSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    const reset = { ...DEFAULT_GRID_SETTINGS, visible: true };
    saveSettings(reset);
  }, [saveSettings]);

  return {
    settings,
    isLoading,
    updateSetting,
    updateSettings: saveSettings,
    resetSettings,
  };
}
