import { useCallback, useState } from 'react';
import { loadSettings, saveSettings } from '../lib/storage';
import type { Settings } from '../types';

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(loadSettings);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...patch };
      saveSettings(patch);
      return next;
    });
  }, []);

  const hasSources = settings.sources.some(s => s.url.trim());

  return { settings, updateSettings, hasSources };
}
