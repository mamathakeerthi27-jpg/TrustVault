import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  Download,
  Clock,
  ArrowRight,
  Shield,
  FileText,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { PasscodeModal } from '../../components/PasscodeModal';
import { formatCountdown, formatDate } from '../../utils/formatters';

export function ViewerDashboard() {
  const { currentUser } = useAuth();
  const { shares, documents, temporaryDownloads } = useDocuments();
  const [selectedDocForDownload, setSelectedDocForDownload] = useState(null);

  // STRICT RULE: Only documents explicitly shared with current viewer
  const myShares = useMemo(() => {
    return shares
      .filter(s => s.recipientId === currentUser?.id && s.status === 'active')
      .map(share => {
        const doc = documents.find(d => d.id === share.documentId);
        return {
          ...share,
          doc: doc || { title: share.documentTitle, status: 'unavailable', category: 'General' }
        };
      })
      .filter(s => s.doc.status !== 'unavailable');
  }, [shares, documents, currentUser]);

  const activeDownloads = useMemo(() => {
    return temporaryDownloads.filter(t => !t.isExpired);
  }, [temporaryDownloads]);

  const expiredDownloads = useMemo(() => {
    return temporaryDownloads.filter(t => t.isExpired);
  }, [temporaryDownloads]);

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
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(17, 22, 42, 0.9) 100%)',
          borderColor: 'rgba(79, 70, 229, 0.28)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="pulse-indicator pulse-emerald" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Restricted External Consumer • Verified Viewer
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Welcome, {currentUser?.name}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {currentUser?.company || 'Partner Organization'} • Access confidential files securely shared with you.
          </p>
        </div>

        <Link to="/viewer/documents" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderLock size={16} />
          <span>Browse Shared Documents</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="Shared With Me"
          value={myShares.length}
          icon={FolderLock}
          delta="Explicitly authorized"
          deltaType="positive"
          glowColor="indigo"
        />
        <StatCard
          title="Active Temporary Downloads"
          value={activeDownloads.length}
          icon={Download}
          delta="5-minute countdowns"
          deltaType="positive"
          glowColor="emerald"
        />
        <StatCard
          title="Expired Tokens"
          value={expiredDownloads.length}
          icon={Clock}
          delta="Access re-check needed"
          deltaType="warning"
          glowColor="amber"
        />
        <StatCard
          title="Permission Model"
          value="Least Privilege"
          icon={Shield}
          delta="Download-only consumer"
          deltaType="positive"
          glowColor="violet"
        />
      </div>

      {/* Two Column Layout: Recent Shared Docs & Active Downloads Timers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Shared Documents */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Shared Documents
            </h3>
            <Link to="/viewer/documents" style={{ fontSize: '13px', color: '#818CF8', fontWeight: 600 }}>
              View All ({myShares.length}) →
            </Link>
          </div>

          {myShares.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              No documents have been explicitly shared with your account yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myShares.slice(0, 3).map((share) => (
                <div
                  key={share.id}
                  className="card-elevated"
                  style={{
                    padding: '16px',
                    background: 'rgba(11, 16, 32, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(79, 70, 229, 0.15)',
                        color: '#818CF8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                        {share.doc.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Shared by {share.grantorName} • {share.doc.size}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDocForDownload(share.doc)}
                    className="btn btn-emerald btn-sm"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Temporary Downloads & Countdown Timers */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--color-amber)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Temporary Download Sessions
              </h3>
            </div>
            <Link to="/viewer/downloads" style={{ fontSize: '13px', color: 'var(--color-violet-light)', fontWeight: 600 }}>
              Full List →
            </Link>
          </div>

          {temporaryDownloads.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No temporary download tokens generated yet. Enter a document passcode to begin an authorized download session.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {temporaryDownloads.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: item.isExpired ? 'rgba(244, 63, 94, 0.08)' : 'rgba(11, 16, 32, 0.8)',
                    border: `1px solid ${item.isExpired ? 'rgba(244, 63, 94, 0.25)' : 'rgba(120, 87, 255, 0.25)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)', marginBottom: '2px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.filename} • {item.size}
                    </div>
                  </div>

                  {item.isExpired ? (
                    <span className="badge badge-danger">
                      Expired — request access again
                    </span>
                  ) : (
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '15px',
                          fontWeight: 700,
                          color: item.remainingSeconds < 60 ? 'var(--color-rose)' : 'var(--color-emerald)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span className="pulse-indicator pulse-emerald" />
                        <span>{formatCountdown(item.remainingSeconds)}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>portal token active</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Passcode Modal */}
      <PasscodeModal
        isOpen={!!selectedDocForDownload}
        onClose={() => setSelectedDocForDownload(null)}
        document={selectedDocForDownload}
      />
    </div>
  );
}
