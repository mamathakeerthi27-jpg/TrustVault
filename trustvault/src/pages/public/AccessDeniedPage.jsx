import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AccessDeniedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, isAuthenticated, status } = useAuth();
  const reason = location.state?.reason || 'You do not have the required role or authorization to access this protected resource.';

  const handleReturn = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'owner') {
      if (status === 'pending' || status === 'rejected') {
        navigate('/auth/pending-approval');
      } else {
        navigate('/owner/dashboard');
      }
    } else {
      navigate('/viewer/dashboard');
    }
  };

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
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            color: 'var(--color-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: 'var(--shadow-glow-violet)'
          }}
        >
          <ShieldAlert size={34} />
        </div>

        <span className="badge badge-danger" style={{ marginBottom: '12px' }}>
          403 Forbidden
        </span>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
          Access Restricted
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
          {reason}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={handleReturn} className="btn btn-primary">
            <ArrowLeft size={16} />
            Return to Authorized Workspace
          </button>
          <Link to="/" className="btn btn-secondary">
            <Home size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
