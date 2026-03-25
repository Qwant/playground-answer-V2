import { useCallback, useEffect, useRef } from 'react';
import { SendIcon, StopIcon } from './Icons';

interface Props {
  onSend: (query: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const value = el.value.trim();
    if (!value || isStreaming) return;
    el.value = '';
    el.style.height = 'auto';
    onSend(value);
  }, [isStreaming, onSend]);

  return (
    <div className="chat-input-area">
      <div className="input-wrapper">
        <div className="input-form">
          <textarea
            ref={textareaRef}
            placeholder="Ask anything..."
            rows={1}
            onInput={resize}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="input-actions">
            <button
              type="button"
              className="btn-stop"
              disabled={!isStreaming}
              title="Stop"
              onClick={onStop}
            >
              <StopIcon />
            </button>
            <button
              type="button"
              className="btn-send"
              disabled={isStreaming}
              title="Send"
              onClick={handleSubmit}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="input-footer">
        <span>Shift + Enter for newline</span>
      </div>
    </div>
  );
}
