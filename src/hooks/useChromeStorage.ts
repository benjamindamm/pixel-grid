import { useEffect, useState } from 'react';

export function useChromeStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get([key], (result) => {
        if (result[key] !== undefined) {
          setValue(result[key]);
        }
      });
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          setValue(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse stored value', e);
        }
      }
    }
  }, [key]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ [key]: newValue });
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue];
}
