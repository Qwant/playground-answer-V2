import { useCallback, useEffect, useState } from 'react';
import { loadTheme, saveTheme } from '../lib/storage';

type Theme = 'light' | 'dark' | null;

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = loadTheme();
    return (stored === 'light' || stored === 'dark' ? stored : null) as Theme;
  });

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    saveTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const opposite = preferred === 'dark' ? 'light' : 'dark';
    setThemeState(prev => {
      if (prev === preferred) return null;
      if (prev === opposite) return preferred;
      return opposite;
    });
  }, []);

  return { theme, toggle };
}
