import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, CheckCircle2, UserCheck, Lock, Mail, KeyRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PasswordField } from '../../components/PasswordField';

const DEMO_PRESETS = [
  {
    role: 'Admin',
    email: 'admin@trustvault.internal',
    pass: 'AdminPass123!',
    desc: 'Platform Administrator (Full Oversight)',
    badgeColor: 'var(--color-violet-light)',
    badgeBg: 'rgba(120, 87, 255, 0.15)'
  },
  {
    role: 'Owner (Active)',
    email: 'elena.rostova@acmecorp.com',
    pass: 'OwnerPass123!',
    desc: 'Approved Document Owner (Upload & Sharing)',
    badgeColor: 'var(--color-emerald)',
    badgeBg: 'rgba(32, 201, 151, 0.15)'
  },
  {
    role: 'Owner (Pending)',
    email: 'david.kim@synthetix.tech',
    pass: 'PendingPass123!',
    desc: 'New Owner (Locked in Approval Screen)',
    badgeColor: 'var(--color-amber)',
    badgeBg: 'rgba(245, 158, 11, 0.15)'
  },
  {
    role: 'Viewer',
    email: 'charlotte.lin@partnerfirm.com',
    pass: 'ViewerPass123!',
    desc: 'Restricted Viewer (Shared Docs & Downloads)',
    badgeColor: '#818CF8',
    badgeBg: 'rgba(79, 70, 229, 0.15)'
  }
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isSendingForgot, setIsSendingForgot] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsSendingForgot(true);
    setTimeout(() => {
      setIsSendingForgot(false);
      setForgotSent(true);
      toast.info('Reset Instructions Sent', `Simulated recovery link dispatched to ${forgotEmail}`);
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);

    if (result.success) {
      const user = result.user;
      toast.success('Welcome back', `Signed in as ${user.name} (${user.role}).`);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'owner') {
        if (user.status === 'pending' || user.status === 'rejected') {
          navigate('/auth/pending-approval');
        } else {
          navigate('/owner/dashboard');
        }
      } else {
        navigate('/viewer/dashboard');
      }
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setEmail(preset.email);
    setPassword(preset.pass);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'radial-gradient(circle at 50% 20%, rgba(120, 87, 255, 0.08) 0%, var(--bg-primary) 70%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-indigo) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-glow-violet)'
              }}
            >
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Trust<span style={{ color: 'var(--color-emerald)' }}>Vault</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Enterprise Authentication
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Enter your credentials to access your secure workspace.
          </p>
        </div>

        {/* Demo Fast Login Box */}
        <div
          className="card-elevated"
          style={{
            padding: '16px',
            marginBottom: '20px',
            background: 'rgba(17, 22, 42, 0.75)',
            border: '1px solid rgba(120, 87, 255, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <UserCheck size={16} color="var(--color-violet-light)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-violet-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Demo Access Presets
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleApplyPreset(p)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(23, 29, 53, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = p.badgeColor;
                  e.currentTarget.style.background = 'rgba(28, 36, 66, 0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'rgba(23, 29, 53, 0.8)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: p.badgeColor }}>
                    {p.role}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.email.split('@')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {error && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--color-rose)',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                <span>Corporate Email <span style={{ color: 'var(--color-rose)' }}>*</span></span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                autoComplete="email"
                className="form-control"
              />
            </div>

            <PasswordField
              id="login-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
              autoComplete="current-password"
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-violet)' }}
                />
                <span>Remember session</span>
              </label>
              <span style={{ fontSize: '13px', color: 'var(--color-violet-light)', cursor: 'default' }}>
                Single Sign-On Enabled
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Verifying Credentials...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Need an account?{' '}
            <Link to="/auth/signup" style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>
              Register as Owner or Viewer
            </Link>
          </div>
        </div>

        {/* Security disclaimer note */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--text-dim)' }}>
          Admin accounts are provisioned via internal security policy only and excluded from public registration.
        </div>
      </div>
    </div>
  );
}
