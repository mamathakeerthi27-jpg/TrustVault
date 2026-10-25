import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  Users,
  UserCheck,
  Share2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { mockAuthService } from '../../services/mockAuthService';
import { useDocuments } from '../../context/DocumentContext';
import { mockAuditService } from '../../services/mockAuditService';
import { formatDate, formatTimeAgo } from '../../utils/formatters';

export function AdminDashboard() {
  const { documents, shares } = useDocuments();
  const users = mockAuthService.getUsers();
  const auditLogs = mockAuditService.getAllLogs();
  const securityStats = mockAuditService.getSecurityStats();

  const owners = useMemo(() => users.filter(u => u.role === 'owner'), [users]);
  const pendingOwners = useMemo(() => owners.filter(o => o.status === 'pending'), [owners]);
  const viewers = useMemo(() => users.filter(u => u.role === 'viewer'), [users]);
  const activeShares = useMemo(() => shares.filter(s => s.status === 'active'), [shares]);
  const recentLogs = useMemo(() => auditLogs.slice(0, 5), [auditLogs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(120, 87, 255, 0.12) 0%, rgba(17, 22, 42, 0.9) 100%)',
          borderColor: 'rgba(120, 87, 255, 0.28)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="pulse-indicator pulse-emerald" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Security Status: Demo Mode Active
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Security Administration Console
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time multi-tenant document isolation, owner approval queues, and immutable audit telemetry.
          </p>
        </div>

        {pendingOwners.length > 0 && (
          <Link
            to="/admin/owners"
            className="btn btn-emerald"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <UserCheck size={16} />
            <span>Review {pendingOwners.length} Pending Owner{pendingOwners.length > 1 ? 's' : ''}</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {/* Primary Stat Metrics Grid */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="Total Documents"
          value={documents.length}
          icon={FolderLock}
          delta="+2 this week"
          deltaType="positive"
          glowColor="violet"
        />
        <StatCard
          title="Registered Owners"
          value={owners.length}
          icon={Users}
          delta={`${owners.filter(o => o.status === 'active').length} active`}
          deltaType="positive"
          glowColor="indigo"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingOwners.length}
          icon={UserCheck}
          delta={pendingOwners.length > 0 ? "Requires review" : "All clear"}
          deltaType={pendingOwners.length > 0 ? "warning" : "positive"}
          glowColor={pendingOwners.length > 0 ? "amber" : "emerald"}
        />
        <StatCard
          title="Active Shares"
          value={activeShares.length}
          icon={Share2}
          delta="Enforced ACLs"
          deltaType="positive"
          glowColor="emerald"
        />
        <StatCard
          title="Total Viewers"
          value={viewers.length}
          icon={Activity}
          delta="Time-bounded access"
          deltaType="positive"
          glowColor="violet"
        />
      </div>

      {/* Two Column Layout: Compliance Chart & Security Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Visual Chart / Platform Telemetry in CSS */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Access & Sharing Volume (Last 7 Days)
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Simulated daily authorized decryptions vs. denials
              </span>
            </div>
            <span className="badge badge-primary">Synthetic Data</span>
          </div>

          {/* Bar Chart Representation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '10px 0 0', borderBottom: '1px solid var(--border-subtle)', gap: '12px' }}>
            {[
              { day: 'Mon', authorized: 14, blocked: 2 },
              { day: 'Tue', authorized: 22, blocked: 1 },
              { day: 'Wed', authorized: 35, blocked: 4 },
              { day: 'Thu', authorized: 28, blocked: 3 },
              { day: 'Fri', authorized: 42, blocked: 5 },
              { day: 'Sat', authorized: 18, blocked: 0 },
              { day: 'Sun', authorized: 29, blocked: 2 }
            ].map((d) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '120px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: `${(d.authorized / 45) * 110}px`,
                      background: 'linear-gradient(180deg, var(--color-violet-light) 0%, var(--color-indigo) 100%)',
                      borderRadius: '3px 3px 0 0'
                    }}
                    title={`Authorized downloads: ${d.authorized}`}
                  />
                  <div
                    style={{
                      width: '6px',
                      height: `${Math.max(4, (d.blocked / 45) * 110)}px`,
                      background: 'var(--color-rose)',
                      borderRadius: '2px 2px 0 0'
                    }}
                    title={`Blocked attempts: ${d.blocked}`}
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-violet-light)' }} />
              Authorized Access
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-rose)' }} />
              Blocked Attempts
            </span>
          </div>
        </div>

        {/* Security Health & Threat Radar */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Security Posture Overview
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Evaluated against zero-trust policy guidelines
              </span>
            </div>
            <Link to="/admin/security" style={{ fontSize: '12px', color: 'var(--color-violet-light)', fontWeight: 600 }}>
              Full Audit →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(11, 16, 32, 0.6)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Compliance Score</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-emerald)' }}>
                {securityStats.complianceScore}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(11, 16, 32, 0.6)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Failed Passcode Attempts (24h)</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-rose)' }}>
                {securityStats.failedAccessAttempts}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(11, 16, 32, 0.6)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Authenticated Sessions</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-violet-light)' }}>
                {securityStats.activeSessions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Audit Events
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Demonstrating non-leaking enterprise event trails
            </span>
          </div>
          <Link to="/admin/activity" className="btn btn-secondary btn-sm">
            View All Logs
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Timestamp</th>
                <th>Result</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {log.actor}
                  </td>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-violet-light)' }}>
                      {log.action}
                    </code>
                  </td>
                  <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.target}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {formatTimeAgo(log.timestamp)}
                  </td>
                  <td>
                    <StatusBadge status={log.result} />
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 7px',
                        borderRadius: '4px',
                        background: log.severity === 'ALERT' ? 'rgba(244, 63, 94, 0.15)' : log.severity === 'WARNING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(120, 87, 255, 0.12)',
                        color: log.severity === 'ALERT' ? 'var(--color-rose)' : log.severity === 'WARNING' ? 'var(--color-amber)' : 'var(--color-violet-light)'
                      }}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
