interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Toast({ message, actionLabel, onAction }: ToastProps) {
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
      <span style={{ fontSize: 13 }}>{message}</span>
      {actionLabel && onAction && (
        <button className="btn btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
