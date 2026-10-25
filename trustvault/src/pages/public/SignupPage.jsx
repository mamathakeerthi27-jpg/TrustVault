import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, CheckCircle2, User, Eye, Briefcase, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PasswordField } from '../../components/PasswordField';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('owner'); // 'owner' or 'viewer' ONLY
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full legal or corporate name.');
      return;
    }

    if (!email.trim()) {
      setError('Please provide a valid corporate email.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for enterprise policy.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (role !== 'owner' && role !== 'viewer') {
      setError('Invalid role selection. Only Document Owner or Viewer allowed.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name,
      email,
      password,
      role,
      company
    });

    if (result.success) {
      if (result.isPending) {
        toast.info(
          'Registration Submitted',
          'Your owner account has been registered and is pending administrator approval.'
        );
        navigate('/auth/pending-approval');
      } else {
        toast.success(
          'Account Created',
          'Your viewer account has been activated. Welcome to TrustVault.'
        );
        navigate('/viewer/dashboard');
      }
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
      setIsSubmitting(false);
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
        background: 'radial-gradient(circle at 50% 20%, rgba(32, 201, 151, 0.06) 0%, var(--bg-primary) 70%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
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
            Create Your Account
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Join TrustVault for verifiable confidential document sharing.
          </p>
        </div>

        {/* Signup Card */}
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
            {/* Role Selector: EXACTLY OWNER OR VIEWER */}
            <div style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>
                <span>Select Account Role <span style={{ color: 'var(--color-rose)' }}>*</span></span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: role === 'owner' ? 'rgba(32, 201, 151, 0.12)' : 'rgba(11, 16, 32, 0.6)',
                    border: `2px solid ${role === 'owner' ? 'var(--color-emerald)' : 'var(--border-subtle)'}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: role === 'owner' ? 'var(--color-emerald)' : 'var(--text-main)' }}>
                      Document Owner
                    </span>
                    <Briefcase size={16} color={role === 'owner' ? 'var(--color-emerald)' : 'var(--text-dim)'} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    Upload and manage documents. Requires admin approval.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: role === 'viewer' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(11, 16, 32, 0.6)',
                    border: `2px solid ${role === 'viewer' ? '#818CF8' : 'var(--border-subtle)'}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: role === 'viewer' ? '#818CF8' : 'var(--text-main)' }}>
                      Viewer
                    </span>
                    <Eye size={16} color={role === 'viewer' ? '#818CF8' : 'var(--text-dim)'} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    Restricted view & temporary download access. Active immediately.
                  </p>
                </button>
              </div>

              {/* Role explanation alert */}
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(167, 174, 220, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Info size={15} style={{ flexShrink: 0, color: 'var(--color-violet-light)' }} />
                <span>
                  {role === 'owner'
                    ? 'Owner registration enters "Pending Approval" until platform admin reviews and approves your tenant request.'
                    : 'Viewers can immediately sign in and decrypt documents that owners have shared with their email.'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">
                <span>Full Name <span style={{ color: 'var(--color-rose)' }}>*</span></span>
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">
                <span>Corporate Email <span style={{ color: 'var(--color-rose)' }}>*</span></span>
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@company.com"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-company" className="form-label">
                <span>Organization / Company</span>
              </label>
              <input
                id="signup-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="form-control"
              />
            </div>

            <PasswordField
              id="signup-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password (min. 8 characters)"
              required
              autoComplete="new-password"
            />

            <PasswordField
              id="signup-confirm-password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              required
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="btn btn-emerald btn-lg"
              style={{ width: '100%', marginTop: '10px', marginBottom: '20px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing Registration...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/auth/login" style={{ color: 'var(--color-violet-light)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
