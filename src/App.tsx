import { useEffect, useRef, useState } from 'react';
import { useChat } from './hooks/useChat';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SettingsDrawer } from './components/SettingsDrawer';
import { EmptyState } from './components/EmptyState';
import { SearchIcon, SettingsIcon, AutoThemeIcon, SunIcon, MoonIcon, GitHubIcon } from './components/Icons';

const GITHUB_URL = 'https://github.com/Qwant/playground-answer-V2';

export default function App() {
  const { settings, updateSettings, hasSources } = useSettings();
  const { messages, isStreaming, sendQuery, stop, clear } = useChat(settings);
  const { theme, toggle: toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const activeSources = settings.sources.filter(s => s.url.trim());

  const ThemeIcon = theme === null ? AutoThemeIcon : theme === 'dark' ? MoonIcon : SunIcon;

  return (
    <>
      <SettingsDrawer
        open={drawerOpen}
        settings={settings}
        hasSources={hasSources}
        onClose={() => setDrawerOpen(false)}
        onChange={updateSettings}
      />

      <div className="app-shell">
        <section className="chat-column">
          <header className="chat-header">
            <div className="header-left">
              <SearchIcon size={20} />
              <h1>Answer V2</h1>
            </div>
            <div className="header-actions">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="View on GitHub"
              >
                <GitHubIcon size={18} />
              </a>
              <button
                type="button"
                className="btn-icon"
                title="Toggle theme"
                onClick={toggleTheme}
              >
                <ThemeIcon size={18} />
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={isStreaming || messages.length === 0}
                onClick={clear}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn-icon"
                title="Settings"
                onClick={() => setDrawerOpen(true)}
              >
                <SettingsIcon size={16} />
              </button>
            </div>
          </header>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <EmptyState
                filter={settings.filter}
                hasSources={hasSources}
                sourceCount={activeSources.length}
                sourcesMode={settings.sourcesMode}
              />
            ) : (
              messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={isStreaming}
                  onRelatedSelect={sendQuery}
                  useMarkdown={settings.markdown}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={sendQuery} onStop={stop} isStreaming={isStreaming} />
        </section>
      </div>
    </>
  );
}
