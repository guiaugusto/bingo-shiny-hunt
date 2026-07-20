import { useRef } from 'react';
import { SIZES } from '../constants';
import { useI18n } from '../i18n/I18nContext';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  size: number;
  onSizeChange: (n: number) => void;
  onClearBoard: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export default function Header({
  size,
  onSizeChange,
  onClearBoard,
  onExportPNG,
  onExportSVG,
  onExportData,
  onImportData,
}: HeaderProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <LanguageToggle />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 60%, transparent)' }}>{t.grid}</label>
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
            {t.clearBoard}
          </button>
          <button className="btn btn-secondary" onClick={onExportPNG}>
            PNG
          </button>
          <button className="btn btn-primary" onClick={onExportSVG}>
            SVG
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onExportData}>
            {t.exportData}
          </button>
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            {t.importData}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) onImportData(file);
            }}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </header>
  );
}
