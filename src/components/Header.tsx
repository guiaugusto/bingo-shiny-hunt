import { useRef, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Only collapses the menu on mobile, where actions live in the dropdown —
  // on desktop the actions row is always visible, so this is a harmless no-op.
  const runAndClose = (fn: () => void) => () => {
    fn();
    setMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        padding: '10px clamp(12px, 4vw, 24px)',
        borderBottom: '1px solid var(--color-divider)',
        backdropFilter: 'blur(8px)',
        background: 'color-mix(in srgb, var(--color-bg) 78%, transparent)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 10, columnGap: 16 }}>
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

        <button
          type="button"
          className="btn btn-icon btn-secondary sbm-header-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t.menu}
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div className={`sbm-header-actions${menuOpen ? ' sbm-open' : ''}`}>
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
            <button className="btn btn-ghost" onClick={runAndClose(onClearBoard)}>
              {t.clearBoard}
            </button>
            <button className="btn btn-secondary" onClick={runAndClose(onExportPNG)}>
              PNG
            </button>
            <button className="btn btn-primary" onClick={runAndClose(onExportSVG)}>
              SVG
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={runAndClose(onExportData)}>
              {t.exportData}
            </button>
            <button className="btn btn-secondary" onClick={runAndClose(() => fileInputRef.current?.click())}>
              {t.importData}
            </button>
          </div>
        </div>
      </div>

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

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="sbm-header-backdrop"
          style={{ position: 'fixed', inset: 0, zIndex: 4 }}
        />
      )}
    </header>
  );
}
