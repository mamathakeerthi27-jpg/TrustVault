import React, { useState } from 'react';
import {
  Settings,
  RotateCcw,
  Shield,
  Server,
  Database,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { mockAuthService } from '../../services/mockAuthService';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export function AdminSettings() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const toast = useToast();

  const handleResetData = () => {
    setIsResetting(true);
    setTimeout(() => {
      localStorage.clear();
      toast.success('Environment Reset', 'All demo documents, users, and audit logs reset to initial seeded state.');
      setIsResetting(false);
      setResetDialogOpen(false);
      window.location.reload();
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Platform & Governance Settings
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure simulated security boundaries, mock storage constraints, and environment parameters.
        </p>
      </div>

      {/* Demo Environment Configuration */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Server size={20} color="var(--color-violet-light)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Simulated Storage & Cryptography Settings
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                Owner Tenant Approval Policy
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Newly registered document owners are quarantined until explicit Administrator approval.
              </div>
            </div>
            <span className="badge badge-success">Enforced (Active)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                Temporary Download Expiry Window
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Decrypted viewer download tokens expire automatically after 300 seconds (5 minutes).
              </div>
            </div>
            <span className="badge badge-primary">300 Seconds</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                Client Upload Payload Limit
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Maximum allowable client mock document size before simulated chunking.
              </div>
            </div>
            <span className="badge badge-muted">25.0 MB</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                Audit Log Retention & Scrubbing
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Zero secrets policy: Passwords, passcodes, and raw document payloads are never logged.
              </div>
            </div>
            <span className="badge badge-success">Active Sanitizer</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Demo State */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderColor: 'rgba(244, 63, 94, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <AlertTriangle size={20} color="var(--color-rose)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-rose)', margin: 0 }}>
            Demo Environment Reset
          </h3>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
          Resetting the demonstration environment restores all users, documents, permissions, and audit logs to the initial factory seed state. Any mock documents uploaded during this session will be reset.
        </p>

        <button
          type="button"
          onClick={() => setResetDialogOpen(true)}
          className="btn btn-outline-danger"
        >
          <RotateCcw size={15} />
          Reset All Demo Data
        </button>
      </div>

      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demo Environment?"
        message="This will clear your browser localStorage and reload the original seeded accounts and mock documents. Are you sure you wish to proceed?"
        confirmLabel="Reset Everything"
        confirmVariant="danger"
        loading={isResetting}
      />
    </div>
  );
}
