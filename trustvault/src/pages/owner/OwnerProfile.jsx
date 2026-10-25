import React, { useState } from 'react';
import {
  User,
  Shield,
  Building,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/StatusBadge';
import { PasswordField } from '../../components/PasswordField';

export function OwnerProfile() {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const toast = useToast();

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdatingProfile(true);
    const res = updateProfile({ name, company });

    setTimeout(() => {
      if (res.success) {
        toast.success('Profile Updated', 'Your tenant owner attributes have been updated.');
      } else {
        toast.error('Update Failed', res.error || 'Could not update profile.');
      }
      setIsUpdatingProfile(false);
    }, 400);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    const res = updatePassword(currentPassword, newPassword);

    setTimeout(() => {
      if (res.success) {
        toast.success('Password Changed', 'Your security credentials were updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.error || 'Password update failed.');
      }
      setIsChangingPassword(false);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '850px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Owner Profile & Account Settings
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your verified corporate tenant attributes, security credentials, and access policies.
        </p>
      </div>

      {/* Identity Overview Card */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-emerald) 0%, #16A085 100%)',
              color: '#061A14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              boxShadow: 'var(--shadow-glow-emerald)'
            }}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                {currentUser?.name}
              </h3>
              <StatusBadge status={currentUser?.status || 'active'} />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentUser?.email} • {currentUser?.company || 'Corporate Tenant'}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '13px'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Assigned Persona</span>
            <span style={{ fontWeight: 600, color: 'var(--color-emerald)' }}>Document Owner (Verified Tenant)</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Tenant Perimeter</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Isolated Zero-Trust Mesh</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Corporate Domain</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser?.email.split('@')[1] || 'enterprise.com'}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Personal & Organization Attributes
        </h3>
        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Corporate / Organization Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Corporate Email Address (Read-Only)</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="form-control"
              style={{ opacity: 0.6 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-emerald"
              disabled={isUpdatingProfile}
            >
              <Save size={16} />
              <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Attributes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <KeyRound size={20} color="var(--color-violet-light)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Update Security Credentials
          </h3>
        </div>

        {passwordError && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--color-rose)',
              fontSize: '13px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <PasswordField
              id="owner-curr-pass"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              label="Current Password"
              placeholder="••••••••••••"
              required
            />
            <PasswordField
              id="owner-new-pass"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              label="New Password"
              placeholder="••••••••••••"
              required
            />
            <PasswordField
              id="owner-conf-pass"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm New Password"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isChangingPassword}
            >
              <Lock size={16} />
              <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
