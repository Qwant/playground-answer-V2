import { SearchIcon } from './Icons';

interface Props {
  filter: string;
  hasSources: boolean;
  sourceCount: number;
  sourcesMode: 'search' | 'context';
}

export function EmptyState({ filter, hasSources, sourceCount, sourcesMode }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <SearchIcon size={48} />
      </div>
      <h2 className="empty-title">Answer V2</h2>
      <p className="empty-subtitle">
        {hasSources ? (
          sourcesMode === 'context'
            ? <><strong>{sourceCount} source{sourceCount > 1 ? 's' : ''}</strong> injected directly — Bloom disabled</>
            : <><strong>{sourceCount} source{sourceCount > 1 ? 's' : ''}</strong> fetched & reranked — Bloom bypassed</>
        ) : filter ? (
          <>Search restricted to <strong>{filter}</strong></>
        ) : (
          <>Ask anything — answers grounded on <strong>the open web</strong></>
        )}
      </p>
    </div>
  );
}
