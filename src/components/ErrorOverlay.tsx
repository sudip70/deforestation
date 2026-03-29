interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorOverlay({ message, onRetry }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2,5,8,0.92)',
        backdropFilter: 'blur(8px)',
        gap: '16px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid rgba(248,113,113,0.4)',
          background: 'rgba(220,38,38,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          marginBottom: '4px',
        }}
      >
        ✕
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#f87171',
          textTransform: 'uppercase',
        }}
      >
        Data Load Failed
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'rgba(226,232,240,0.45)',
          maxWidth: '320px',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {message}
      </div>

      <button
        onClick={onRetry}
        style={{
          marginTop: '8px',
          background: 'rgba(34,197,94,0.12)',
          border: '1px solid rgba(34,197,94,0.4)',
          color: '#22c55e',
          padding: '9px 24px',
          borderRadius: '24px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '2px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'rgba(34,197,94,0.22)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'rgba(34,197,94,0.12)')
        }
      >
        RETRY
      </button>
    </div>
  );
}