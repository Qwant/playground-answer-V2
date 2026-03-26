import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { ChatMessage as ChatMessageType, AnswerV2Source } from '../types';
import { SourcesList } from './SourcesList';
import { RelatedQueries } from './RelatedQueries';
import { SearchIcon, UserIcon } from './Icons';

interface Props {
  message: ChatMessageType;
  isStreaming: boolean;
  onRelatedSelect: (q: string) => void;
  useMarkdown: boolean;
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function preprocessCitations(content: string): string {
  return content.replace(/\[\^cite:(\d+)\]/g, (_, id) => {
    return `[${parseInt(id, 10) + 1}](cite://${id})`;
  });
}

function makeLinkComponent(sources: AnswerV2Source[]): Components['a'] {
  return function CitationLink({ href, children, ...props }) {
    if (href?.startsWith('cite://')) {
      const id = href.slice(7);
      const source = sources.find(s => s.id === id);
      return (
        <a
          href={source?.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="citation-btn"
          title={source ? (source.title || getDomain(source.url)) : ''}
        >
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  };
}

export function ChatMessage({ message, isStreaming, onRelatedSelect, useMarkdown }: Props) {
  const isAssistant = message.role === 'assistant';
  const sources = message.sources ?? [];

  const components: Components = { a: makeLinkComponent(sources) };

  const processedContent = useMarkdown
    ? preprocessCitations(message.content)
    : message.content;

  return (
    <div className={`message ${message.role}`}>
      <div className="message-row">
        <div className="msg-avatar">
          {isAssistant ? <SearchIcon size={16} /> : <UserIcon size={14} />}
        </div>
        <div className="msg-bubble">
          {message.error ? (
            <div className="msg-error">{message.error}</div>
          ) : message.isStreaming && !message.content ? (
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          ) : (
            <div className="msg-content">
              {useMarkdown ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={components}
                  urlTransform={(url) => url}
                >
                  {processedContent}
                </ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          )}

          {isAssistant && !message.isStreaming && sources.length > 0 && (
            <SourcesList sources={sources} />
          )}

          {isAssistant && message.relatedQueries && message.relatedQueries.length > 0 && (
            <RelatedQueries
              queries={message.relatedQueries}
              disabled={isStreaming}
              onSelect={onRelatedSelect}
            />
          )}

          {isAssistant && message.usage && (
            <div className="msg-usage">
              <span>{message.usage.input_tokens.toLocaleString()} in</span>
              <span className="usage-sep">/</span>
              <span>{message.usage.output_tokens.toLocaleString()} out</span>
              <span className="usage-sep">/</span>
              <span>{(message.usage.input_tokens + message.usage.output_tokens).toLocaleString()} total</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
