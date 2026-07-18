import { useRef } from 'react';
import type { Bingo } from '../types';
import { MAX_BINGOS } from '../constants';

interface BingoRailProps {
  bingos: Bingo[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function BingoRail({ bingos, activeId, onSelect, onDelete, onAdd }: BingoRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const r = railRef.current;
    if (r) r.scrollBy({ left: dir * Math.max(240, r.clientWidth * 0.7), behavior: 'smooth' });
  };

  return (
    <section
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 24px',
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <button className="btn btn-icon btn-secondary" onClick={() => scroll(-1)} aria-label="Previous">
        ‹
      </button>
      <div
        ref={railRef}
        className="sbm-rail"
        style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollBehavior: 'smooth', padding: 2, flex: 1 }}
      >
        {bingos.map((b) => {
          const total = b.cells.filter((c) => c.key).length;
          const caught = b.cells.filter((c) => c.key && c.caught).length;
          const active = b.id === activeId;
          return (
            <div
              key={b.id}
              className="sbm-chip"
              onClick={() => onSelect(b.id)}
              style={{
                flex: 'none',
                width: 180,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: active
                  ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-surface))'
                  : 'var(--color-surface)',
                border: active ? '1px solid var(--color-accent)' : '1px solid var(--color-divider)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {b.title || 'Untitled'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(b.id);
                  }}
                  aria-label="Delete"
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
                    cursor: 'pointer',
                    padding: 2,
                    lineHeight: 0,
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                  }}
                >
                  {b.size}×{b.size}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--color-neutral-800)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${total ? Math.round((caught / total) * 100) : 0}%`,
                      height: '100%',
                      background: 'var(--color-accent)',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {caught}/{total}
                </span>
              </div>
            </div>
          );
        })}
        {bingos.length < MAX_BINGOS && (
          <button
            onClick={onAdd}
            style={{
              flex: 'none',
              width: 54,
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-neutral-700)',
              background: 'transparent',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              fontSize: 20,
            }}
          >
            +
          </button>
        )}
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'color-mix(in srgb, var(--color-text) 45%, transparent)',
          whiteSpace: 'nowrap',
          padding: '0 4px',
        }}
      >
        {bingos.length}/{MAX_BINGOS}
      </span>
      <button className="btn btn-icon btn-secondary" onClick={() => scroll(1)} aria-label="Next">
        ›
      </button>
    </section>
  );
}
