import type { Cell as CellType } from '../types';
import { GAME_MAP, CAUGHT_COLOR } from '../constants';
import { spriteUrl } from '../lib/dex';
import { gameTextColor } from '../lib/color';

interface CellProps {
  cell: CellType;
  index: number;
  onEdit: (i: number) => void;
}

export default function Cell({ cell, index, onEdit }: CellProps) {
  const has = !!cell.key;
  const gm = GAME_MAP[cell.game];

  return (
    <div
      className="sbm-cell"
      role="button"
      tabIndex={0}
      onClick={() => onEdit(index)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: '1',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: 4,
        background: 'color-mix(in srgb, var(--color-text) 7%, transparent)',
        boxShadow: has && cell.caught ? `0 0 0 2px ${CAUGHT_COLOR}` : '0 0 0 1px var(--color-neutral-800)',
        transition: 'box-shadow 0.12s',
      }}
    >
      {has ? (
        <>
          <div style={{ position: 'relative', width: '100%', flex: 1, display: 'grid', placeItems: 'center', minHeight: 0 }}>
            <img
              src={spriteUrl(cell.key)}
              loading="lazy"
              alt={cell.name}
              crossOrigin="anonymous"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: cell.caught ? 'none' : 'grayscale(0.85) opacity(0.55)',
                transition: 'filter 0.15s',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center', padding: '4px 2px 2px' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cell.name}
            </span>
            {gm && gm.id && (
              <span
                className="tag"
                style={{
                  padding: '1px 6px',
                  fontSize: 9,
                  flex: 'none',
                  background: `linear-gradient(90deg, ${gm.c1}, ${gm.c2})`,
                  color: gameTextColor(gm),
                }}
              >
                {gm.abbr}
              </span>
            )}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--color-neutral-700)', fontSize: 22 }}>
          +
        </div>
      )}
    </div>
  );
}
