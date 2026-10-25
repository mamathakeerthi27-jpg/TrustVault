import React from 'react';
import {
  DownloadCloud,
  Clock,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { EmptyState } from '../../components/EmptyState';
import { formatCountdown, formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export function ViewerDownloads() {
  const { temporaryDownloads } = useDocuments();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Temporary Download Tokens
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Time-bounded 5-minute authorized portal sessions generated upon passcode verification.
        </p>
      </div>

      {/* Mandatory Regulatory / Architecture Disclaimer */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 22px',
          background: 'rgba(23, 29, 53, 0.9)',
          borderLeft: '4px solid var(--color-amber)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}
      >
        <Info size={22} color="var(--color-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-main)' }}>Browser Security & Expiry Disclaimer:</strong> The five-minute countdown governs the validity of the application's temporary-download entry and authorization session token. Once a file is downloaded to a user's local laptop, desktop, or mobile device storage, a web browser cannot remotely delete or erase local device files. After 5 minutes, this session token expires, requiring fresh passcode authorization for subsequent portal access.
        </div>
      </div>

      {/* Temporary Downloads Table / Cards */}
      {temporaryDownloads.length === 0 ? (
        <EmptyState
          icon={DownloadCloud}
          title="No active temporary download sessions"
          description="When you verify a passcode and download a shared document, a 5-minute active session token will appear here."
          action={
            <Link to="/viewer/documents" className="btn btn-primary">
              View Shared Documents
            </Link>
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name & File</th>
                <th>Category</th>
                <th>Session Initialized</th>
                <th>Remaining Validity</th>
                <th>Download Token Status</th>
                <th style={{ textAlign: 'right' }}>Portal Action</th>
              </tr>
            </thead>
            <tbody>
              {temporaryDownloads.map((item) => {
                const isExpired = item.isExpired || item.remainingSeconds <= 0;

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            background: isExpired ? 'rgba(244, 63, 94, 0.12)' : 'rgba(32, 201, 151, 0.12)',
                            color: isExpired ? 'var(--color-rose)' : 'var(--color-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {item.filename} • {item.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-muted">{item.category}</span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {formatDate(item.downloadedAt)}
                    </td>
                    <td>
                      {isExpired ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-rose)', fontSize: '13px', fontWeight: 600 }}>
                          <XCircle size={15} />
                          <span>00:00 (Expired)</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: item.remainingSeconds < 60 ? 'var(--color-rose)' : 'var(--color-emerald)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-xs)'
                          }}
                        >
                          <span className="pulse-indicator pulse-emerald" />
                          <span>{formatCountdown(item.remainingSeconds)}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {isExpired ? (
                        <span className="badge badge-danger">
                          Expired — request access again
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          Active Token (Valid)
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isExpired ? (
                        <Link
                          to="/viewer/documents"
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-amber)' }}
                        >
                          <RefreshCw size={13} />
                          <span>Re-Authenticate</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            // Demo simulation of file save
                            const blob = new Blob([`[TrustVault Confidential Mock Payload]\nTitle: ${item.title}\nID: ${item.documentId}\nStatus: Verified\nDisclaimer: Educational Prototype`], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = item.filename;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="btn btn-emerald btn-sm"
                        >
                          <DownloadCloud size={14} />
                          <span>Download File</span>
                        </button>
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
  );
}
