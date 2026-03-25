import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '../types';
import { SourcesList } from './SourcesList';
import { RelatedQueries } from './RelatedQueries';
import { SearchIcon, UserIcon } from './Icons';

interface Props {
  message: ChatMessageType;
  isStreaming: boolean;
  onRelatedSelect: (q: string) => void;
  useMarkdown: boolean;
}

export function ChatMessage({ message, isStreaming, onRelatedSelect, useMarkdown }: Props) {
  const isAssistant = message.role === 'assistant';

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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          )}

          {isAssistant && message.sources && message.sources.length > 0 && (
            <SourcesList sources={message.sources} />
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
