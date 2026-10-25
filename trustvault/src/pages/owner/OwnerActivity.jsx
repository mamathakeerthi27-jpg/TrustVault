import React, { useState, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  Calendar,
  Lock,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAuditService } from '../../services/mockAuditService';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function OwnerActivity() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  // STRICT RULE: Only owner's own events, NEVER global logs
  const myLogs = useMemo(() => {
    return mockAuditService.getLogsForOwner(currentUser?.id);
  }, [currentUser]);

  const actions = useMemo(() => {
    return Array.from(new Set(myLogs.map(l => l.action)));
  }, [myLogs]);

  const filteredLogs = useMemo(() => {
    return myLogs.filter(log => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [myLogs, searchQuery, actionFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          My Account Activity Log
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Scoped event audit trail of document ingestions, access grants, and permissions issued under your account.
        </p>
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
              placeholder="Search your event trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="all">All Actions ({myLogs.length})</option>
            {actions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity events found"
          description="Actions performed in your workspace will be cryptographically registered here."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Target Resource</th>
                <th>Timestamp</th>
                <th>Result</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-violet-light)' }}>
                      {log.action}
                    </code>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13px' }}>
                    {log.target}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td>
                    <StatusBadge status={log.result} />
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
