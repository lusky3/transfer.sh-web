import { useState, useEffect, useCallback } from 'react';

export type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'transfer-sh-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (globalThis.window === undefined) return 'light';
  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme(): { theme: Theme; setTheme: (newTheme: Theme) => void } {
  const [themeValue, setThemeValue] = useState<Theme>(() => {
    if (globalThis.window === undefined) return 'system';
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeValue(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  useEffect(() => {
    applyTheme(themeValue);

    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeValue === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeValue]);

  return { theme: themeValue, setTheme };
}
