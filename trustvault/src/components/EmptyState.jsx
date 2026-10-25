import React from 'react';
import { FolderLock } from 'lucide-react';

export function EmptyState({
  icon: Icon = FolderLock,
  title = 'No items found',
  description = 'There are no active records matching your criteria.',
  action = null
}) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(120, 87, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-violet-light)',
          marginBottom: '4px'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
        {description}
      </p>
      {action && <div style={{ marginTop: '12px' }}>{action}</div>}
    </div>
  );
}
