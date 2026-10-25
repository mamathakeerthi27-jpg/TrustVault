import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, AlertTriangle, ArrowRight, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockAuthService } from '../../services/mockAuthService';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';

export function PendingApprovalPage() {
  const { currentUser, logout, status, quickSwitchUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const isRejected = status === 'rejected';

  const handleRefresh = () => {
    if (!currentUser) return;
    const freshUser = mockAuthService.getUserById(currentUser.id);
    if (freshUser && freshUser.status === 'active') {
      const updatedSession = { ...currentUser, status: 'active' };
      localStorage.setItem('trustvault_demo_session_v1', JSON.stringify(updatedSession));
      toast.success('Approved!', 'Your account has been approved by the platform administrator.');
      navigate('/owner/dashboard');
    } else {
      toast.info('Status Check', `Current account status remains "${freshUser?.status || status}".`);
    }
  };

  const handleDemoAdminShortcut = () => {
    quickSwitchUser('admin@trustvault.internal');
    toast.info('Admin Persona Activated', 'Switched to Sarah Connor (Admin) to review pending owners.');
    navigate('/admin/owners');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.08) 0%, var(--bg-primary) 70%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
          {/* Header Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isRejected ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isRejected ? 'var(--color-rose)' : 'var(--color-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: isRejected ? '0 0 25px rgba(244, 63, 94, 0.2)' : '0 0 25px rgba(245, 158, 11, 0.2)'
            }}
          >
            {isRejected ? <AlertTriangle size={32} /> : <Clock size={32} />}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <StatusBadge status={status || 'pending'} label={isRejected ? 'Application Rejected' : 'Pending Administrator Approval'} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
            {isRejected ? 'Account Request Denied' : 'Verification In Progress'}
          </h2>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {isRejected
              ? 'Your document owner registration has been reviewed and rejected by the platform administrator in accordance with tenant compliance policies. The owner workspace is currently inaccessible.'
              : 'Thank you for registering as a Document Owner. In accordance with zero-trust tenant policies, all new owner accounts must be verified and approved by a system administrator before access to the document management workspace is granted.'}
          </p>

          {/* Account Details Box */}
          <div
            className="card-elevated"
            style={{
              padding: '18px',
              textAlign: 'left',
              marginBottom: '24px',
              background: 'rgba(11, 16, 32, 0.8)'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
              Registration Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Applicant Name</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser?.name || 'David Kim'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Corporate Email</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser?.email || 'david.kim@synthetix.tech'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Organization</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser?.company || 'Synthetix AI Labs'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Requested Role</span>
                <span style={{ fontWeight: 600, color: 'var(--color-emerald)' }}>Document Owner</span>
              </div>
            </div>
          </div>

          {/* Demo Shortcut helper */}
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(120, 87, 255, 0.1)',
              border: '1px dashed rgba(120, 87, 255, 0.35)',
              marginBottom: '24px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-violet-light)' }}>
                  Demo Evaluation Flow:
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Switch to Admin persona to approve this registration request.
                </div>
              </div>
              <button
                type="button"
                onClick={handleDemoAdminShortcut}
                className="btn btn-primary btn-sm"
              >
                Switch to Admin
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleRefresh}
              className="btn btn-secondary"
            >
              <RefreshCw size={15} />
              Check Status
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ color: 'var(--text-muted)' }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
