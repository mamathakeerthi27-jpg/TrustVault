import React, { useState } from 'react';
import { KeyRound, ShieldCheck, AlertCircle, Copy, Check, Download, Info, X } from 'lucide-react';
import { mockDocumentService } from '../services/mockDocumentService';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function PasscodeModal({ isOpen, onClose, document, shareId, onDownloadSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const { recordDownloadSuccess } = useDocuments();
  const { currentUser } = useAuth();
  const toast = useToast();

  if (!isOpen || !document) return null;

  const demoPasscode = document.passcode || 'TV-SEC-2026';

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(demoPasscode);
    setCopied(true);
    setPasscode(demoPasscode);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickFill = () => {
    setPasscode(demoPasscode);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!passcode.trim()) {
      setError('Please enter the document download passcode.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const verification = mockDocumentService.verifyPasscode(document.id, passcode);

      if (verification.valid) {
        // Record download session in context
        recordDownloadSuccess(document, currentUser);

        toast.success(
          'Verification Successful',
          `Authorized access granted for "${document.title}". Temporary 5-minute session initialized.`
        );

        if (onDownloadSuccess) {
          onDownloadSuccess(document);
        }
        setIsVerifying(false);
        onClose();
      } else {
        setError(verification.error || 'Invalid passcode. Please check the simulated demo credentials.');
        setIsVerifying(false);
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '500px', padding: '26px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(120, 87, 255, 0.15)',
                color: 'var(--color-violet-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <KeyRound size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                Passcode Verification
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Time-bounded decryption protocol simulation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '4px', borderRadius: '4px' }}
            aria-label="Close passcode dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Document target card */}
        <div
          className="card-elevated"
          style={{
            padding: '14px 16px',
            marginBottom: '18px',
            background: 'rgba(11, 16, 32, 0.8)'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Target Confidential Document:
          </div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>
            {document.title}
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>{document.filename}</span>
            <span>•</span>
            <span>{document.size}</span>
            <span>•</span>
            <span style={{ color: 'var(--color-violet-light)' }}>{document.classification}</span>
          </div>
        </div>

        {/* Demo Helper Ribbon */}
        <div
          style={{
            background: 'rgba(120, 87, 255, 0.1)',
            border: '1px dashed rgba(120, 87, 255, 0.35)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            marginBottom: '18px',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-violet-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              Demo Mode Passcode Helper
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              style={{
                background: 'rgba(120, 87, 255, 0.2)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Autofill
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Expected passcode:</span>
            <code
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-emerald)',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              {demoPasscode}
            </code>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="passcode-input" className="form-label">
              <span>Enter Authorization Passcode <span style={{ color: 'var(--color-rose)' }}>*</span></span>
            </label>
            <input
              id="passcode-input"
              type="text"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder="e.g. TV-ACQ-9281"
              autoFocus
              className="form-control"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                letterSpacing: '1px',
                borderColor: error ? 'var(--color-rose)' : undefined
              }}
            />
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-rose)', fontSize: '12px', marginTop: '6px' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Legal / Architecture Disclaimer */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(167, 174, 220, 0.05)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              lineHeight: 1.5,
              display: 'flex',
              gap: '8px'
            }}
          >
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-secondary)' }} />
            <div>
              <strong>Security Protocol Notice:</strong> On verification, a 5-minute temporary portal token will be generated. Note: A web browser cannot erase files already saved to your local OS drive; the 5-minute expiry governs portal access state.
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-emerald"
              disabled={isVerifying || !passcode.trim()}
            >
              {isVerifying ? (
                'Verifying Passcode...'
              ) : (
                <>
                  <Download size={16} />
                  Authorize & Download
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
