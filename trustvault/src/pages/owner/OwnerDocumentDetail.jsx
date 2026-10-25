import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Share2,
  Trash2,
  Shield,
  Clock,
  User,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Activity,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { useToast } from '../../context/ToastContext';
import { mockAuditService } from '../../services/mockAuditService';
import { StatusBadge } from '../../components/StatusBadge';
import { PermissionBadge } from '../../components/PermissionBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { formatDate, formatTimeAgo } from '../../utils/formatters';

export function OwnerDocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { documents, shares, deleteDocument } = useDocuments();
  const toast = useToast();

  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Find document
  const doc = useMemo(() => {
    return documents.find(d => d.id === id);
  }, [documents, id]);

  // Document shares
  const docShares = useMemo(() => {
    return shares.filter(s => s.documentId === id);
  }, [shares, id]);

  // Scoped audit events for this document
  const docEvents = useMemo(() => {
    if (!doc) return [];
    const allOwnerLogs = mockAuditService.getLogsForOwner(currentUser?.id);
    return allOwnerLogs.filter(l =>
      l.target.includes(doc.title) ||
      (l.details && l.details.includes(doc.title)) ||
      l.target.includes(doc.id)
    );
  }, [doc, currentUser]);

  // Check if document belongs to current owner
  if (!doc) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Document Not Found
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          The requested document could not be found or you do not have permission to view it.
        </p>
        <Link to="/owner/documents" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to My Documents
        </Link>
      </div>
    );
  }

  // Enforce tenant boundary: Cannot view documents of other owners
  if (doc.ownerId !== currentUser?.id) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <Shield size={36} color="var(--color-rose)" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Tenant Boundary Restriction
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          This asset belongs to another enterprise tenant ({doc.ownerName}). Owners cannot access documents outside their tenant perimeter.
        </p>
        <Link to="/owner/documents" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to My Documents
        </Link>
      </div>
    );
  }

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(doc.passcode);
    setCopiedPasscode(true);
    toast.info('Passcode Copied', `Copied ${doc.passcode} to clipboard for demo distribution.`);
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(doc.fileHash);
    setCopiedHash(true);
    toast.info('Integrity Hash Copied', 'SHA-256 hash copied.');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    const res = deleteDocument(doc.id, currentUser);
    setTimeout(() => {
      if (res.success) {
        toast.success('Document Deleted', `"${doc.title}" has been removed.`);
        navigate('/owner/documents');
      } else {
        toast.error('Deletion Error', res.error || 'Could not delete document.');
        setIsDeleting(false);
      }
    }, 350);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Navigation Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/owner/documents" className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '13px' }}>
          <ArrowLeft size={16} />
          <span>Back to Documents</span>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/owner/sharing" className="btn btn-secondary btn-sm" style={{ color: 'var(--color-violet-light)' }}>
            <Share2 size={14} />
            <span>Manage Access Grants</span>
          </Link>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="btn btn-outline-danger btn-sm"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Asset Header Card */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(32, 201, 151, 0.15)',
                color: 'var(--color-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileText size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span className="badge badge-muted">{doc.category}</span>
                <span
                  className="badge"
                  style={{
                    background: doc.classification === 'Highly Confidential' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(120, 87, 255, 0.15)',
                    color: doc.classification === 'Highly Confidential' ? 'var(--color-rose)' : 'var(--color-violet-light)'
                  }}
                >
                  {doc.classification}
                </span>
                <StatusBadge status={doc.status} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {doc.title}
              </h2>
            </div>
          </div>

          {/* Passcode Chip for Demo Reviewer */}
          <div
            style={{
              background: 'rgba(11, 16, 32, 0.9)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Simulated Decryption Passcode</div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--color-emerald)' }}>
                {doc.passcode}
              </code>
            </div>
            <button
              onClick={handleCopyPasscode}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px' }}
              title="Copy passcode"
            >
              {copiedPasscode ? <Check size={14} color="var(--color-emerald)" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Metadata Details Grid */}
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
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>File Name</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.filename}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Payload Size</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.size}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Ingested At</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatDate(doc.uploadedAt)}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Owner Profile</span>
            <span style={{ fontWeight: 600, color: 'var(--color-emerald)' }}>{doc.ownerName}</span>
          </div>
        </div>

        {/* Description */}
        {doc.description && (
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Document Description:
            </span>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {doc.description}
            </p>
          </div>
        )}

        {/* Integrity Hash */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(9, 11, 22, 0.7)', borderRadius: 'var(--radius-xs)', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <Lock size={14} color="var(--color-violet-light)" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--text-muted)' }}>Integrity Checksum:</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.fileHash}
            </code>
          </div>
          <button onClick={handleCopyHash} className="btn-ghost" style={{ padding: '4px', borderRadius: '4px' }}>
            {copiedHash ? <Check size={14} color="var(--color-emerald)" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Two Columns: Active Sharing Grants & Document Activity Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Active Permissions for this doc */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Active Viewer Permissions ({docShares.filter(s => s.status === 'active').length})
            </h3>
            <Link to="/owner/sharing" className="btn btn-secondary btn-sm">
              <Share2 size={13} />
              <span>Modify Access</span>
            </Link>
          </div>

          {docShares.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No sharing grants have been created for this document yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {docShares.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(11, 16, 32, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>
                      {s.recipientName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {s.recipientEmail} • Granted {formatTimeAgo(s.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PermissionBadge permission={s.permission} />
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Timeline for this doc */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Document Activity Timeline
            </h3>
            <span className="badge badge-muted">Immutable Log</span>
          </div>

          {docEvents.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No operations logged for this document yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {docEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(11, 16, 32, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-violet-light)' }}>
                      {evt.action}
                    </code>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatTimeAgo(evt.timestamp)}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {evt.details || evt.target}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Document?"
        message={`Are you sure you wish to delete "${doc.title}"? This cannot be undone.`}
        confirmLabel="Delete Permanently"
        confirmVariant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
