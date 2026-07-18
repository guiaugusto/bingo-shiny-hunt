import { useI18n } from '../i18n/I18nContext';

interface ToastProps {
  onUndo: () => void;
}

export default function Toast({ onUndo }: ToastProps) {
  const { t } = useI18n();

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 24,
        transform: 'translateX(-50%)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <span style={{ fontSize: 13 }}>{t.boardCleared}</span>
      <button className="btn btn-secondary" onClick={onUndo}>
        {t.undo}
      </button>
    </div>
  );
}
