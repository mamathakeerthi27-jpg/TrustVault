import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'var(--bg-primary)'
      }}
    >
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(120, 87, 255, 0.15)',
            color: 'var(--color-violet-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}
        >
          <HelpCircle size={34} />
        </div>

        <span className="badge badge-muted" style={{ marginBottom: '12px' }}>
          404 Not Found
        </span>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
          Resource Does Not Exist
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          The requested endpoint or confidential URI could not be resolved in the TrustVault registry.
        </p>

        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <Home size={16} />
          Return to Platform Homepage
        </Link>
      </div>
    </div>
  );
}
