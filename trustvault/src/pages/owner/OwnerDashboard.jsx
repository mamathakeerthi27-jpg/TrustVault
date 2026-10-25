import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  Share2,
  UploadCloud,
  FileText,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { mockAuditService } from '../../services/mockAuditService';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate, formatTimeAgo } from '../../utils/formatters';

export function OwnerDashboard() {
  const { currentUser } = useAuth();
  const { documents, shares } = useDocuments();
  const allLogs = mockAuditService.getLogsForOwner(currentUser?.id);

  // Strictly filter documents owned by current owner
  const myDocs = useMemo(() => {
    return documents.filter(d => d.ownerId === currentUser?.id);
  }, [documents, currentUser]);

  // Strictly filter shares granted by current owner
  const myShares = useMemo(() => {
    return shares.filter(s => s.grantedBy === currentUser?.id && s.status === 'active');
  }, [shares, currentUser]);

  const recentDocs = useMemo(() => myDocs.slice(0, 3), [myDocs]);
  const recentLogs = useMemo(() => allLogs.slice(0, 5), [allLogs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(32, 201, 151, 0.1) 0%, rgba(17, 22, 42, 0.9) 100%)',
          borderColor: 'rgba(32, 201, 151, 0.25)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="pulse-indicator pulse-emerald" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Tenant Verified • Active Document Owner
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Welcome back, {currentUser?.name}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {currentUser?.company || 'Enterprise Tenant'} • Upload, manage, and share confidential documents.
          </p>
        </div>

        <Link to="/owner/upload" className="btn btn-emerald" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UploadCloud size={18} />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="My Stored Documents"
          value={myDocs.length}
          icon={FolderLock}
          delta="Owned by you"
          deltaType="positive"
          glowColor="emerald"
        />
        <StatCard
          title="Active Access Grants"
          value={myShares.length}
          icon={Share2}
          delta="Authorized viewers"
          deltaType="positive"
          glowColor="violet"
        />
        <StatCard
          title="Security Status"
          value="Optimal"
          icon={Shield}
          delta="Enforced Passcodes"
          deltaType="positive"
          glowColor="emerald"
        />
        <StatCard
          title="My Audit Events"
          value={allLogs.length}
          icon={Activity}
          delta="Scoped to your account"
          deltaType="positive"
          glowColor="indigo"
        />
      </div>

      {/* Recent Documents & Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Document Cards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Owned Documents
            </h3>
            <Link to="/owner/documents" style={{ fontSize: '13px', color: 'var(--color-emerald)', fontWeight: 600 }}>
              View All ({myDocs.length}) →
            </Link>
          </div>

          {myDocs.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>You haven't uploaded any documents yet.</p>
              <Link to="/owner/upload" className="btn btn-emerald btn-sm" style={{ marginTop: '12px' }}>
                <Plus size={14} /> Upload First File
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentDocs.map((doc) => {
                const docShares = shares.filter(s => s.documentId === doc.id && s.status === 'active');
                return (
                  <Link
                    key={doc.id}
                    to={`/owner/documents/${doc.id}`}
                    className="card-elevated"
                    style={{
                      padding: '16px',
                      background: 'rgba(11, 16, 32, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(32, 201, 151, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(32, 201, 151, 0.12)',
                          color: 'var(--color-emerald)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', marginBottom: '2px' }}>
                          {doc.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {doc.category} • {doc.size} • {docShares.length} active share{docShares.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={16} color="var(--text-dim)" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity Log (Scoped strictly to current owner) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              My Activity Timeline
            </h3>
            <Link to="/owner/activity" style={{ fontSize: '13px', color: 'var(--color-violet-light)', fontWeight: 600 }}>
              Full Log →
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No activity recorded yet for your account.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(11, 16, 32, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <code style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-violet-light)' }}>
                        {log.action}
                      </code>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {log.target}
                    </div>
                  </div>
                  <StatusBadge status={log.result} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
