import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading secure records...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: 'var(--text-muted)',
        gap: '16px'
      }}
    >
      <Loader2
        size={36}
        color="var(--color-violet-light)"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
