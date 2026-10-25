import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Building,
  Mail,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { mockAuthService } from '../../services/mockAuthService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

export function AdminOwners() {
  const [users, setUsers] = useState(() => mockAuthService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [dialogAction, setDialogAction] = useState(null); // 'approve' or 'reject'
  const [isProcessing, setIsProcessing] = useState(false);

  const { updateUserStatus } = useAuth();
  const toast = useToast();

  const reloadOwners = () => {
    setUsers(mockAuthService.getUsers());
  };

  const owners = useMemo(() => {
    return users.filter(u => u.role === 'owner');
  }, [users]);

  const pendingCount = useMemo(() => {
    return owners.filter(o => o.status === 'pending').length;
  }, [owners]);

  const filteredOwners = useMemo(() => {
    return owners.filter(owner => {
      const matchesSearch =
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.company && owner.company.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || owner.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [owners, searchQuery, statusFilter]);

  const handleOpenConfirm = (owner, action) => {
    setSelectedOwner(owner);
    setDialogAction(action);
  };

  const handleExecuteAction = () => {
    if (!selectedOwner || !dialogAction) return;
    setIsProcessing(true);

    const newStatus = dialogAction === 'approve' ? 'active' : 'rejected';
    const res = updateUserStatus(selectedOwner.id, newStatus);

    setTimeout(() => {
      if (res.success) {
        toast.success(
          dialogAction === 'approve' ? 'Owner Approved' : 'Owner Rejected',
          `${selectedOwner.name}'s account has been marked as '${newStatus}'.`
        );
        reloadOwners();
      } else {
        toast.error('Action Failed', res.error || 'Could not update owner status.');
      }
      setIsProcessing(false);
      setSelectedOwner(null);
      setDialogAction(null);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Document Owner Registrations
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Review, verify, and approve corporate tenant owner applications.
          </p>
        </div>

        {pendingCount > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--color-amber)',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            <Clock size={16} />
            <span>{pendingCount} Pending Approval Queue</span>
          </div>
        )}
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
              placeholder="Search owners by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="all">All Statuses ({owners.length})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="active">Active ({owners.filter(o => o.status === 'active').length})</option>
            <option value="rejected">Rejected ({owners.filter(o => o.status === 'rejected').length})</option>
          </select>
        </div>
      </div>

      {/* Owners Table or Responsive Card List */}
      {filteredOwners.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No owners matching filter"
          description="Try adjusting your search criteria or status filter to see registered owner accounts."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant / Owner</th>
                <th>Company / Tenant</th>
                <th>Registration Date</th>
                <th>Account Status</th>
                <th style={{ textAlign: 'right' }}>Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.map((owner) => {
                const isPending = owner.status === 'pending';
                const isActive = owner.status === 'active';
                const isRejected = owner.status === 'rejected';

                return (
                  <tr key={owner.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(32, 201, 151, 0.15)',
                            color: isPending ? 'var(--color-amber)' : 'var(--color-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px',
                            flexShrink: 0
                          }}
                        >
                          {owner.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                            {owner.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {owner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Building size={15} color="var(--text-dim)" />
                        <span>{owner.company || 'Corporate Tenant'}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {formatDate(owner.createdAt)}
                    </td>
                    <td>
                      <StatusBadge status={owner.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenConfirm(owner, 'approve')}
                              className="btn btn-emerald btn-sm"
                            >
                              <CheckCircle2 size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenConfirm(owner, 'reject')}
                              className="btn btn-outline-danger btn-sm"
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {isActive && (
                          <button
                            type="button"
                            onClick={() => handleOpenConfirm(owner, 'reject')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--color-rose)' }}
                          >
                            Revoke / Reject
                          </button>
                        )}

                        {isRejected && (
                          <button
                            type="button"
                            onClick={() => handleOpenConfirm(owner, 'approve')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--color-emerald)' }}
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
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
        isOpen={!!selectedOwner && !!dialogAction}
        onClose={() => {
          setSelectedOwner(null);
          setDialogAction(null);
        }}
        onConfirm={handleExecuteAction}
        title={dialogAction === 'approve' ? 'Approve Document Owner?' : 'Reject Owner Application?'}
        message={
          dialogAction === 'approve'
            ? `Are you sure you want to approve ${selectedOwner?.name} (${selectedOwner?.company || selectedOwner?.email})? Once approved, this owner will have full access to upload documents and grant sharing permissions.`
            : `Are you sure you want to reject ${selectedOwner?.name}? The owner workspace will be inaccessible to this user.`
        }
        confirmLabel={dialogAction === 'approve' ? 'Approve Account' : 'Reject Account'}
        confirmVariant={dialogAction === 'approve' ? 'emerald' : 'danger'}
        loading={isProcessing}
      />
    </div>
  );
}
