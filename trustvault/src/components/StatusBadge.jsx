import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getStatusBadgeClass } from '../utils/formatters';

export function StatusBadge({ status, label }) {
  const norm = status?.toLowerCase() || 'unknown';
  const displayLabel = label || status;
  const badgeClass = getStatusBadgeClass(norm);

  let Icon = null;
  if (norm === 'active' || norm === 'approved' || norm === 'success') {
    Icon = CheckCircle2;
  } else if (norm === 'pending' || norm === 'pending approval' || norm === 'warning') {
    Icon = Clock;
  } else if (norm === 'rejected' || norm === 'suspended' || norm === 'revoked' || norm === 'expired') {
    Icon = XCircle;
  } else if (norm === 'alert' || norm === 'blocked') {
    Icon = ShieldAlert;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      <span style={{ textTransform: 'capitalize' }}>{displayLabel}</span>
    </span>
  );
}
