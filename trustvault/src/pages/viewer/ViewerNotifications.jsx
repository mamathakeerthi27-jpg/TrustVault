import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Share2,
  Clock,
  Shield,
  FileText,
  KeyRound,
  Trash2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/EmptyState';
import { formatTimeAgo } from '../../utils/formatters';

export function ViewerNotifications() {
  const { currentUser } = useAuth();
  const { shares, documents } = useDocuments();
  const toast = useToast();

  // Find shares for this viewer to populate realistic notification feed
  const myShares = useMemo(() => {
    return shares.filter(s => s.recipientId === currentUser?.id);
  }, [shares, currentUser]);

  const initialNotifications = useMemo(() => {
    const list = [
      {
        id: 'notif_sys_1',
        title: 'Zero-Trust Protocol Active',
        message: 'Your viewer session is protected with simulated time-bounded tokens and least-privilege guardrails.',
        type: 'system',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        isRead: false
      }
    ];

    myShares.forEach((s, idx) => {
      list.push({
        id: `notif_share_${s.id}`,
        title: `New Document Access Granted`,
        message: `${s.grantorName} authorized access to "${s.documentTitle}" with permission "${s.permission}".`,
        type: 'grant',
        documentId: s.documentId,
        passcode: s.passcode,
        timestamp: s.createdAt,
        isRead: idx > 0
      });
    });

    return list;
  }, [myShares]);

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filterType, setFilterType] = useState('all');

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    if (filterType === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filterType);
  }, [notifications, filterType]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.info('Notifications Updated', 'All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.info('Cleared', 'Notification history cleared.');
  };

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Notifications & Access Alerts
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Alerts regarding document sharing grants, authorization passcodes, and token expiry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={14} />
              <span>Mark All Read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-rose)' }}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'grant', label: 'Access Grants' },
            { id: 'system', label: 'System Notices' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className="btn btn-sm"
              style={{
                background: filterType === tab.id ? 'rgba(120, 87, 255, 0.2)' : 'transparent',
                color: filterType === tab.id ? 'var(--color-violet-light)' : 'var(--text-secondary)',
                border: filterType === tab.id ? '1px solid rgba(120, 87, 255, 0.35)' : '1px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications to display"
          description="You are fully caught up. When owners share files with your verified identity, alerts will appear here."
          action={
            <Link to="/viewer/documents" className="btn btn-primary btn-sm">
              View Shared Documents
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifications.map(n => {
            const isGrant = n.type === 'grant';

            return (
              <div
                key={n.id}
                className="card-elevated"
                style={{
                  padding: '18px 20px',
                  background: n.isRead ? 'rgba(11, 16, 32, 0.6)' : 'rgba(23, 29, 53, 0.9)',
                  borderColor: n.isRead ? 'var(--border-subtle)' : 'rgba(120, 87, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      background: isGrant ? 'rgba(32, 201, 151, 0.15)' : 'rgba(120, 87, 255, 0.15)',
                      color: isGrant ? 'var(--color-emerald)' : 'var(--color-violet-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {isGrant ? <Share2 size={20} /> : <Shield size={20} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '10px' }}>
                          New
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 8px' }}>
                      {n.message}
                    </p>

                    {n.passcode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Demo Passcode:</span>
                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-emerald)', background: 'rgba(0, 0, 0, 0.4)', padding: '2px 6px', borderRadius: '4px' }}>
                          {n.passcode}
                        </code>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>{formatTimeAgo(n.timestamp)}</span>
                      {isGrant && (
                        <Link
                          to="/viewer/documents"
                          style={{ color: 'var(--color-violet-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>Open Document</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleRead(n.id)}
                  className="btn-ghost"
                  style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 8px' }}
                  title={n.isRead ? 'Mark unread' : 'Mark read'}
                >
                  {n.isRead ? 'Mark unread' : 'Dismiss'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
