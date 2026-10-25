import React, { useState, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Terminal
} from 'lucide-react';
import { mockAuditService } from '../../services/mockAuditService';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function AdminActivity() {
  const [logs, setLogs] = useState(() => mockAuditService.getAllLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const actions = useMemo(() => {
    return Array.from(new Set(logs.map(l => l.action)));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSev = severityFilter === 'all' || log.severity === severityFilter;
      const matchesAct = actionFilter === 'all' || log.action === actionFilter;

      return matchesSearch && matchesSev && matchesAct;
    });
  }, [logs, searchQuery, severityFilter, actionFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with clear Demo Data Label */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Verifiable Audit Event Trail
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Comprehensive, non-leaking record of authentication, sharing lifecycle, and document operations.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(120, 87, 255, 0.12)',
            border: '1px solid rgba(120, 87, 255, 0.3)',
            color: 'var(--color-violet-light)',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <Terminal size={14} />
          <span>Demo Audit Trail (Zero Secret Leakage)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search audit events by actor, action, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Severities</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ALERT">ALERT</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Actions</option>
              {actions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No audit entries found"
          description="Try clearing your search query or reset filter options to view telemetry records."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Actor & IP</th>
                <th>Event Action</th>
                <th>Target Resource</th>
                <th>Event Timestamp</th>
                <th>Outcome</th>
                <th>Severity</th>
                <th>Context Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isAlert = log.severity === 'ALERT';
                const isWarning = log.severity === 'WARNING';

                return (
                  <tr key={log.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13px' }}>
                          {log.actor}
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {log.ipAddress || '192.0.2.1'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: isAlert ? 'var(--color-rose)' : isWarning ? 'var(--color-amber)' : 'var(--color-violet-light)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          padding: '3px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {log.action}
                      </code>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {log.target}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatDate(log.timestamp)}
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
                          background: isAlert ? 'rgba(244, 63, 94, 0.15)' : isWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(120, 87, 255, 0.12)',
                          color: isAlert ? 'var(--color-rose)' : isWarning ? 'var(--color-amber)' : 'var(--color-violet-light)'
                        }}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.4 }}>
                      {log.details || '—'}
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
