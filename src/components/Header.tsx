import { SIZES } from '../constants';

interface HeaderProps {
  size: number;
  onSizeChange: (n: number) => void;
  onClearBoard: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
}

export default function Header({ size, onSizeChange, onClearBoard, onExportPNG, onExportSVG }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: 10,
        columnGap: 16,
        padding: '10px clamp(12px, 4vw, 24px)',
        borderBottom: '1px solid var(--color-divider)',
        position: 'sticky',
        top: 0,
        zIndex: 5,
        backdropFilter: 'blur(8px)',
        background: 'color-mix(in srgb, var(--color-bg) 78%, transparent)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 auto', minWidth: 0 }}>
        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 30,
            height: 30,
            flex: 'none',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-800)',
            color: 'var(--color-accent-200)',
            fontSize: 15,
          }}
        >
          ✦
        </span>
        <span
          style={{
            fontWeight: 600,
            fontSize: 15,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Bingo Shiny Hunt
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>Grid</label>
          <select
            className="input"
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            style={{ width: 'auto', minWidth: 78, cursor: 'pointer' }}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}×{s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={onClearBoard}>
            Clear board
          </button>
          <button className="btn btn-secondary" onClick={onExportPNG}>
            PNG
          </button>
          <button className="btn btn-primary" onClick={onExportSVG}>
            SVG
          </button>
        </div>
      </div>
    </header>
  );
}
