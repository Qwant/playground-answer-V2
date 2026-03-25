import type { Settings } from '../types';

const KEYS = {
  theme: 'answer-v2:theme',
  filter: 'answer-v2:filter',
  mode: 'answer-v2:mode',
  markdown: 'answer-v2:markdown',
  relatedQueries: 'answer-v2:related-queries',
  queryRewrite: 'answer-v2:query-rewrite',
  sourcesMode: 'answer-v2:sources-mode',
  sources: 'answer-v2:sources',
  baseURL: 'answer-v2:base-url',
  // apiKey is session-only
  apiKey: 'answer-v2:apikey',
} as const;

export const DEFAULT_BASE_URL = 'https://api.staan.ai/v2';

export function loadSettings(): Settings {
  const get = (k: string) => localStorage.getItem(k);

  let sources: { url: string }[] = [];
  try {
    const raw = get(KEYS.sources);
    if (raw) sources = JSON.parse(raw);
  } catch {
    /* ignore */
  }

  return {
    apiKey: sessionStorage.getItem(KEYS.apiKey) ?? '',
    baseURL: get(KEYS.baseURL) ?? DEFAULT_BASE_URL,
    filter: get(KEYS.filter) ?? '',
    mode: (get(KEYS.mode) as 'short' | 'long') ?? 'short',
    markdown: get(KEYS.markdown) !== 'false',
    relatedQueries: get(KEYS.relatedQueries) === 'true',
    queryRewrite: get(KEYS.queryRewrite) !== 'false',
    sourcesMode: (get(KEYS.sourcesMode) as 'search' | 'context') ?? 'search',
    sources,
  };
}

export function saveSettings(s: Partial<Settings>) {
  if (s.apiKey !== undefined) sessionStorage.setItem(KEYS.apiKey, s.apiKey);
  if (s.baseURL !== undefined) localStorage.setItem(KEYS.baseURL, s.baseURL);
  if (s.filter !== undefined) localStorage.setItem(KEYS.filter, s.filter);
  if (s.mode !== undefined) localStorage.setItem(KEYS.mode, s.mode);
  if (s.markdown !== undefined) localStorage.setItem(KEYS.markdown, String(s.markdown));
  if (s.relatedQueries !== undefined) localStorage.setItem(KEYS.relatedQueries, String(s.relatedQueries));
  if (s.queryRewrite !== undefined) localStorage.setItem(KEYS.queryRewrite, String(s.queryRewrite));
  if (s.sourcesMode !== undefined) localStorage.setItem(KEYS.sourcesMode, s.sourcesMode);
  if (s.sources !== undefined) localStorage.setItem(KEYS.sources, JSON.stringify(s.sources));
}

export function loadTheme(): string | null {
  return localStorage.getItem(KEYS.theme);
}

export function saveTheme(theme: string | null) {
  if (theme) localStorage.setItem(KEYS.theme, theme);
  else localStorage.removeItem(KEYS.theme);
}
