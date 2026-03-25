interface Props {
  queries: string[];
  disabled: boolean;
  onSelect: (q: string) => void;
}

export function RelatedQueries({ queries, disabled, onSelect }: Props) {
  if (!queries.length) return null;

  return (
    <div className="related-block">
      <div className="related-header">Related questions</div>
      <div className="related-chips">
        {queries.map(q => (
          <button
            key={q}
            type="button"
            className="related-chip"
            disabled={disabled}
            onClick={() => onSelect(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
