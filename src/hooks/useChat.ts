import { useCallback, useRef, useState } from 'react';
import { AnswerClient, AnswerApiError, AnswerNetworkError } from '@qwant/answer';
import type { Settings, ChatMessage, AnswerV2Source, AnswerV2UsageEntry } from '../types';

function uid() {
  return Math.random().toString(36).slice(2);
}

export function useChat(settings: Settings) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<{ cancel: () => void } | null>(null);

  const updateLast = useCallback((patch: Partial<ChatMessage>) => {
    setMessages(prev => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...patch };
      return next;
    });
  }, []);

  const sendQuery = useCallback(async (query: string) => {
    if (isStreaming) return;

    const history = messages
      .filter(m => !m.isStreaming && !m.error)
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [
      ...prev,
      { id: uid(), role: 'user', content: query },
      { id: uid(), role: 'assistant', content: '', isStreaming: true },
    ]);
    setIsStreaming(true);

    const client = new AnswerClient({
      apiKey: settings.apiKey,
      baseURL: settings.baseURL || undefined,
    });

    const activeSources = settings.sources
      .filter(s => s.url.trim())
      .map(s => ({ url: s.url }));

    try {
      const stream = client.stream({
        query,
        history,
        filter: settings.filter || undefined,
        mode: settings.mode,
        markdown: settings.markdown,
        related_queries: settings.relatedQueries,
        query_rewrite: activeSources.length > 0 ? false : settings.queryRewrite,
        sources_mode: settings.sourcesMode,
        ...(activeSources.length > 0 && { sources: activeSources }),
      });

      streamRef.current = stream;

      let content = '';
      let sources: AnswerV2Source[] = [];
      const usageMap = new Map<string, AnswerV2UsageEntry>();

      for await (const event of stream) {
        if (event.type === 'sources') {
          sources = event.sources;
        } else if (event.type === 'assistant') {
          content += event.delta;
          updateLast({ content });
        } else if (event.type === 'usages') {
          for (const u of event.usages) usageMap.set(u.step, u);
          const totals = [...usageMap.values()].reduce(
            (acc, u) => ({
              input_tokens: acc.input_tokens + u.input_tokens,
              output_tokens: acc.output_tokens + u.output_tokens,
            }),
            { input_tokens: 0, output_tokens: 0 },
          );
          updateLast({ usage: totals });
        } else if (event.type === 'related') {
          updateLast({ relatedQueries: event.related_queries });
        }
      }

      updateLast({ isStreaming: false, sources });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        updateLast({ isStreaming: false });
        return;
      }
      let msg = 'Unknown error';
      if (err instanceof AnswerApiError) msg = `HTTP ${err.status}`;
      else if (err instanceof AnswerNetworkError) msg = err.message;
      else if (err instanceof Error) msg = err.message;
      updateLast({ isStreaming: false, error: msg });
    } finally {
      streamRef.current = null;
      setIsStreaming(false);
    }
  }, [isStreaming, messages, settings, updateLast]);

  const stop = useCallback(() => {
    streamRef.current?.cancel();
  }, []);

  const clear = useCallback(() => {
    if (isStreaming) return;
    setMessages([]);
  }, [isStreaming]);

  return { messages, isStreaming, sendQuery, stop, clear };
}
