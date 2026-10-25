import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Briefcase,
  Eye,
  UserX,
  UserCheck,
  Building,
  Mail
} from 'lucide-react';
import { mockAuthService } from '../../services/mockAuthService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function AdminUsers() {
  const [users, setUsers] = useState(() => mockAuthService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [targetStatus, setTargetStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { updateUserStatus } = useAuth();
  const toast = useToast();

  const reloadUsers = () => {
    setUsers(mockAuthService.getUsers());
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenDialog = (user, status) => {
    setSelectedUser(user);
    setTargetStatus(status);
  };

  const handleExecuteStatusChange = () => {
    if (!selectedUser || !targetStatus) return;
    setIsProcessing(true);

    const res = updateUserStatus(selectedUser.id, targetStatus);
    setTimeout(() => {
      if (res.success) {
        toast.success(
          'User Status Updated',
          `${selectedUser.name}'s account status has been changed to '${targetStatus}'.`
        );
        reloadUsers();
      } else {
        toast.error('Operation Failed', res.error || 'Failed to update user status.');
      }
      setIsProcessing(false);
      setSelectedUser(null);
      setTargetStatus(null);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Global User & Identity Directory
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Monitor identity lifecycle, corporate tenant affiliations, and enforce access suspension.
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
              placeholder="Search by user name, email, or tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="admin">Admin ({users.filter(u => u.role === 'admin').length})</option>
              <option value="owner">Owner ({users.filter(u => u.role === 'owner').length})</option>
              <option value="viewer">Viewer ({users.filter(u => u.role === 'viewer').length})</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users match criteria"
          description="Try broadening your search term or adjusting role/status filters."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Role</th>
                <th>Tenant / Organization</th>
                <th>Account Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isAdmin = user.role === 'admin';
                const isSuspended = user.status === 'suspended';
                const isActive = user.status === 'active';

                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: isAdmin ? 'rgba(120, 87, 255, 0.2)' : user.role === 'owner' ? 'rgba(32, 201, 151, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                            color: isAdmin ? 'var(--color-violet-light)' : user.role === 'owner' ? 'var(--color-emerald)' : '#818CF8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px',
                            flexShrink: 0
                          }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-xs)',
                          textTransform: 'uppercase',
                          background: isAdmin ? 'rgba(120, 87, 255, 0.15)' : user.role === 'owner' ? 'rgba(32, 201, 151, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                          color: isAdmin ? 'var(--color-violet-light)' : user.role === 'owner' ? 'var(--color-emerald)' : '#818CF8'
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {user.company || 'External'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={user.status} />
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isAdmin ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          Primary Admin
                        </span>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {isActive && (
                            <button
                              type="button"
                              onClick={() => handleOpenDialog(user, 'suspended')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--color-rose)' }}
                            >
                              <UserX size={14} />
                              <span>Suspend</span>
                            </button>
                          )}
                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() => handleOpenDialog(user, 'active')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--color-emerald)' }}
                            >
                              <UserCheck size={14} />
                              <span>Reactivate</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedUser && !!targetStatus}
        onClose={() => {
          setSelectedUser(null);
          setTargetStatus(null);
        }}
        onConfirm={handleExecuteStatusChange}
        title={targetStatus === 'suspended' ? 'Suspend User Access?' : 'Reactivate User Account?'}
        message={
          targetStatus === 'suspended'
            ? `Are you sure you want to suspend ${selectedUser?.name}? The user will immediately be blocked from logging into the platform until reactivated.`
            : `Are you sure you want to restore active status for ${selectedUser?.name}?`
        }
        confirmLabel={targetStatus === 'suspended' ? 'Suspend Account' : 'Reactivate Account'}
        confirmVariant={targetStatus === 'suspended' ? 'danger' : 'emerald'}
        loading={isProcessing}
      />
    </div>
  );
}
