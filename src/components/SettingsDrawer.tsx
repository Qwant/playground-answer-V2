import type { Settings } from '../types';
import { CloseIcon, PlusIcon, CloseIcon as RemoveIcon } from './Icons';
import { DEFAULT_BASE_URL } from '../lib/storage';

interface Props {
  open: boolean;
  settings: Settings;
  hasSources: boolean;
  onClose: () => void;
  onChange: (patch: Partial<Settings>) => void;
}

export function SettingsDrawer({ open, settings, hasSources, onClose, onChange }: Props) {
  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`settings-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Settings</span>
          <button className="btn-icon" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-field">
            <label htmlFor="s-apikey">API Key</label>
            <input
              id="s-apikey"
              type="password"
              placeholder="Bearer token"
              autoComplete="off"
              value={settings.apiKey}
              onChange={e => onChange({ apiKey: e.target.value })}
            />
          </div>

          <div className="drawer-field">
            <label htmlFor="s-baseurl">Base URL</label>
            <input
              id="s-baseurl"
              type="text"
              placeholder={DEFAULT_BASE_URL}
              autoComplete="off"
              value={settings.baseURL}
              onChange={e => onChange({ baseURL: e.target.value })}
            />
          </div>

          <div className="drawer-field">
            <label htmlFor="s-filter">
              Domain filter <span className="label-hint">(optional)</span>
            </label>
            <input
              id="s-filter"
              type="text"
              placeholder="e.g. frandroid.com"
              autoComplete="off"
              value={settings.filter}
              disabled={hasSources}
              title={hasSources ? 'Ignored when sources are provided' : undefined}
              onChange={e => onChange({ filter: e.target.value })}
            />
          </div>

          <div className="drawer-field">
            <label htmlFor="s-mode">Response length</label>
            <select
              id="s-mode"
              value={settings.mode}
              onChange={e => onChange({ mode: e.target.value as 'short' | 'long' })}
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-label">Options</div>

            <label className="drawer-checkbox">
              <input
                type="checkbox"
                checked={settings.markdown}
                onChange={e => onChange({ markdown: e.target.checked })}
              />
              <span>Markdown rendering</span>
            </label>

            <label className="drawer-checkbox">
              <input
                type="checkbox"
                checked={settings.relatedQueries}
                onChange={e => onChange({ relatedQueries: e.target.checked })}
              />
              <span>Related questions</span>
            </label>

            <label
              className="drawer-checkbox"
              title={hasSources ? 'Ignored when sources are provided' : undefined}
            >
              <input
                type="checkbox"
                checked={settings.queryRewrite}
                disabled={hasSources}
                onChange={e => onChange({ queryRewrite: e.target.checked })}
              />
              <span>Query rewrite</span>
            </label>
          </div>

          <div className="drawer-field">
            <label htmlFor="s-sources-mode">Sources mode</label>
            <select
              id="s-sources-mode"
              value={settings.sourcesMode}
              onChange={e => onChange({ sourcesMode: e.target.value as 'search' | 'context' })}
            >
              <option value="search">search — fetch + rerank</option>
              <option value="context">context — direct injection</option>
            </select>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-label">
              Custom sources
              <span className="drawer-section-hint">bypasses Bloom</span>
            </div>
            <div className="sources-entries">
              {settings.sources.map((source, i) => (
                <div key={i} className="source-entry">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={source.url}
                    onChange={e => {
                      const next = [...settings.sources];
                      next[i] = { url: e.target.value };
                      onChange({ sources: next });
                    }}
                  />
                  <button
                    type="button"
                    className="btn-remove-source"
                    title="Remove"
                    onClick={() => {
                      const next = settings.sources.filter((_, j) => j !== i);
                      onChange({ sources: next });
                    }}
                  >
                    <RemoveIcon size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-add-source"
              onClick={() => onChange({ sources: [...settings.sources, { url: '' }] })}
            >
              <PlusIcon />
              Add source
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
