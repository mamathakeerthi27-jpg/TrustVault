/**
 * Data formatting utilities for TrustVault
 */

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  } catch {
    return dateString;
  }
}

export function formatCountdown(remainingSeconds) {
  if (remainingSeconds <= 0) return '00:00';
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'approved':
    case 'success':
      return 'badge-active';
    case 'pending':
    case 'pending approval':
    case 'warning':
      return 'badge-pending';
    case 'rejected':
    case 'suspended':
    case 'blocked':
    case 'expired':
    case 'revoked':
    case 'alert':
      return 'badge-rejected';
    default:
      return 'badge-muted';
  }
}

export function generateSimulatedPasscode(prefix = 'TV') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${rand}-${digits}`;
}
