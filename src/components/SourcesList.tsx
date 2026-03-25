import type { AnswerV2Source } from '../types';
import { ExternalLinkIcon, SearchIcon } from './Icons';

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

interface Props {
  sources: AnswerV2Source[];
}

export function SourcesList({ sources }: Props) {
  if (!sources.length) return null;

  return (
    <div className="sources-block">
      <div className="sources-header">
        <SearchIcon size={12} />
        <span>{sources.length} source{sources.length > 1 ? 's' : ''}</span>
      </div>
      <div className="sources-grid">
        {sources.map(s => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card"
          >
            <span className="source-num">{parseInt(s.id, 10) + 1}</span>
            <span className="source-info">
              <span className="source-title">{s.title || getDomain(s.url)}</span>
              <span className="source-domain">{getDomain(s.url)}</span>
            </span>
            <ExternalLinkIcon size={12} />
          </a>
        ))}
      </div>
    </div>
  );
}
