import React, { useState, useMemo } from 'react';
import {
  Share2,
  FolderLock,
  User,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { useToast } from '../../context/ToastContext';
import { mockAuthService } from '../../services/mockAuthService';
import { PermissionBadge } from '../../components/PermissionBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function OwnerSharing() {
  const { currentUser } = useAuth();
  const { documents, shares, grantShare, revokeShare } = useDocuments();
  const toast = useToast();

  // Load registered viewers from mockAuthService
  const allUsers = mockAuthService.getUsers();
  const activeViewers = useMemo(() => {
    return allUsers.filter(u => u.role === 'viewer' && u.status === 'active');
  }, [allUsers]);

  // Strictly filter documents owned by current owner
  const myDocs = useMemo(() => {
    return documents.filter(d => d.ownerId === currentUser?.id);
  }, [documents, currentUser]);

  // Strictly filter shares granted by current owner
  const myShares = useMemo(() => {
    return shares.filter(s => s.grantedBy === currentUser?.id);
  }, [shares, currentUser]);

  // Grant Form State
  const [selectedDocId, setSelectedDocId] = useState(() => myDocs[0]?.id || '');
  const [selectedViewerId, setSelectedViewerId] = useState(() => activeViewers[0]?.id || '');
  const [permissionLevel, setPermissionLevel] = useState('read_download'); // default least privilege
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Revoke Dialog State
  const [shareToRevoke, setShareToRevoke] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleGrant = (e) => {
    e.preventDefault();
    setError('');

    const effectiveDocId = selectedDocId || myDocs[0]?.id;
    const effectiveViewerId = selectedViewerId || activeViewers[0]?.id;

    if (!effectiveDocId) {
      setError('Please select a document to share.');
      return;
    }

    if (!effectiveViewerId) {
      setError('Please select a registered viewer.');
      return;
    }

    const doc = myDocs.find(d => d.id === effectiveDocId);
    const viewer = activeViewers.find(v => v.id === effectiveViewerId);

    if (!doc || !viewer) {
      setError('Invalid document or recipient selection.');
      return;
    }

    setIsSubmitting(true);
    const res = grantShare({
      documentId: doc.id,
      recipientId: viewer.id,
      recipientEmail: viewer.email,
      recipientName: viewer.name,
      permission: permissionLevel
    }, currentUser);

    setTimeout(() => {
      if (res.success) {
        toast.success(
          res.updated ? 'Permission Updated' : 'Access Granted',
          `Authorized "${viewer.name}" for "${doc.title}" with permission "${permissionLevel}".`
        );
      } else {
        setError(res.error || 'Failed to grant sharing permission.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleConfirmRevoke = () => {
    if (!shareToRevoke) return;
    setIsRevoking(true);

    const res = revokeShare(shareToRevoke.id, currentUser);
    setTimeout(() => {
      if (res.success) {
        toast.success(
          'Access Revoked',
          `Revoked access for "${shareToRevoke.recipientName}". Viewer can no longer download this document.`
        );
      } else {
        toast.error('Revocation Error', res.error || 'Could not revoke share.');
      }
      setIsRevoking(false);
      setShareToRevoke(null);
    }, 300);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Access & Document Sharing
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Assign time-bounded least-privilege download access to verified tenant viewers.
        </p>
      </div>

      {/* Grant New Permission Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(120, 87, 255, 0.15)',
              color: 'var(--color-violet-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Share2 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Grant Authorized Viewer Access
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Least privilege defaults apply automatically
            </span>
          </div>
        </div>

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

        {myDocs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You need to upload at least one document before you can grant sharing permissions.
          </div>
        ) : (
          <form onSubmit={handleGrant}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '20px' }}>
              {/* Select Document */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="share-doc-select" className="form-label">
                  <span>Select Document <span style={{ color: 'var(--color-rose)' }}>*</span></span>
                </label>
                <select
                  id="share-doc-select"
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="form-control"
                  disabled={isSubmitting}
                >
                  {myDocs.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title} ({doc.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Viewer */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="share-viewer-select" className="form-label">
                  <span>Authorized Viewer Recipient <span style={{ color: 'var(--color-rose)' }}>*</span></span>
                </label>
                <select
                  id="share-viewer-select"
                  value={selectedViewerId}
                  onChange={(e) => setSelectedViewerId(e.target.value)}
                  className="form-control"
                  disabled={isSubmitting}
                >
                  {activeViewers.map(viewer => (
                    <option key={viewer.id} value={viewer.id}>
                      {viewer.name} ({viewer.email}) — {viewer.company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permission Level */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="share-perm-select" className="form-label">
                  <span>Permission Level</span>
                </label>
                <select
                  id="share-perm-select"
                  value={permissionLevel}
                  onChange={(e) => setPermissionLevel(e.target.value)}
                  className="form-control"
                  disabled={isSubmitting}
                >
                  <option value="read_download">Read / Download Only (Default Least Privilege)</option>
                  <option value="edit">Edit / Manage (Elevated Permission)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-emerald"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Recording Grant...'
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Authorize & Issue Passcode</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active & Revoked Shares Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Active & Revoked Access Grants
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Governed strictly by your owner tenant account
            </span>
          </div>
          <span className="badge badge-primary">
            {myShares.filter(s => s.status === 'active').length} Active Grants
          </span>
        </div>

        {myShares.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No sharing grants created yet"
            description="Use the form above to grant time-bounded passcode access to registered partner viewers."
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Target Document</th>
                  <th>Recipient Viewer</th>
                  <th>Permission Level</th>
                  <th>Passcode (Demo)</th>
                  <th>Granted On</th>
                  <th>Grant Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {myShares.map((share) => {
                  const isActive = share.status === 'active';

                  return (
                    <tr key={share.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                          {share.documentTitle}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '13px' }}>
                            {share.recipientName}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {share.recipientEmail}
                          </div>
                        </div>
                      </td>
                      <td>
                        <PermissionBadge permission={share.permission} />
                      </td>
                      <td>
                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'rgba(0, 0, 0, 0.4)', padding: '3px 6px', borderRadius: '4px', color: 'var(--color-emerald)' }}>
                          {share.passcode || 'TV-GEN-0000'}
                        </code>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {formatDate(share.createdAt)}
                      </td>
                      <td>
                        <StatusBadge status={share.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isActive ? (
                          <button
                            type="button"
                            onClick={() => setShareToRevoke(share)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <Trash2 size={13} />
                            <span>Revoke Access</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                            Access Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revoke Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!shareToRevoke}
        onClose={() => setShareToRevoke(null)}
        onConfirm={handleConfirmRevoke}
        title="Revoke Viewer Access?"
        message={`Are you sure you want to revoke access for ${shareToRevoke?.recipientName} to "${shareToRevoke?.documentTitle}"? The viewer will immediately be barred from downloading this document.`}
        confirmLabel="Revoke Permission"
        confirmVariant="danger"
        loading={isRevoking}
      />
    </div>
  );
}
