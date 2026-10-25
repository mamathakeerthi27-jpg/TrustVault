import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  UserCheck,
  Users,
  FolderLock,
  Activity,
  ShieldAlert,
  Settings,
  UploadCloud,
  Share2,
  DownloadCloud,
  User,
  Tag,
  Bell,
  X,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './StatusBadge';

export function Sidebar({ isOpen, onClose }) {
  const { currentUser, role, status } = useAuth();

  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Owner Approvals', path: '/admin/owners', icon: UserCheck },
        { label: 'User Directory', path: '/admin/users', icon: Users },
        { label: 'All Documents', path: '/admin/documents', icon: FolderLock },
        { label: 'Activity Logs', path: '/admin/activity', icon: Activity },
        { label: 'Security Overview', path: '/admin/security', icon: ShieldAlert },
        { label: 'Settings', path: '/admin/settings', icon: Settings }
      ];
    } else if (role === 'owner') {
      return [
        { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
        { label: 'My Documents', path: '/owner/documents', icon: FolderLock },
        { label: 'Upload Document', path: '/owner/upload', icon: UploadCloud },
        { label: 'Share & Permissions', path: '/owner/sharing', icon: Share2 },
        { label: 'Categories', path: '/owner/categories', icon: Tag },
        { label: 'Activity History', path: '/owner/activity', icon: Activity },
        { label: 'Profile & Settings', path: '/owner/profile', icon: User }
      ];
    } else {
      // Viewer
      return [
        { label: 'Dashboard', path: '/viewer/dashboard', icon: LayoutDashboard },
        { label: 'Shared With Me', path: '/viewer/documents', icon: FolderLock },
        { label: 'Download History', path: '/viewer/downloads', icon: DownloadCloud },
        { label: 'Notifications', path: '/viewer/notifications', icon: Bell },
        { label: 'Profile & Settings', path: '/viewer/profile', icon: User }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 15, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            display: 'block'
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform var(--transition-normal)'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '70px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-indigo) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-glow-violet)'
              }}
            >
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-main)' }}>
                Trust<span style={{ color: 'var(--color-emerald)' }}>Vault</span>
              </span>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Enterprise Access
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost mobile-close-btn"
            style={{ padding: '6px', borderRadius: '4px' }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Role Header */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}
          >
            <span>Workspace</span>
            <span
              style={{
                padding: '2px 6px',
                borderRadius: '4px',
                background: role === 'admin' ? 'rgba(120, 87, 255, 0.15)' : role === 'owner' ? 'rgba(32, 201, 151, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                color: role === 'admin' ? 'var(--color-violet-light)' : role === 'owner' ? 'var(--color-emerald)' : '#818CF8',
                fontWeight: 800,
                fontSize: '10px'
              }}
            >
              {role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(90deg, rgba(120, 87, 255, 0.22) 0%, rgba(79, 70, 229, 0.08) 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-violet)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Current User Card in Sidebar Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(9, 11, 22, 0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(167, 174, 220, 0.12)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'var(--text-main)',
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentUser?.name || 'Guest User'}
              </div>
              <div style={{ marginTop: '2px' }}>
                <StatusBadge status={status || 'active'} />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .mobile-close-btn {
            display: none;
          }
          @media (max-width: 1024px) {
            .app-sidebar {
              transform: translateX(-100%);
            }
            .app-sidebar.sidebar-open {
              transform: translateX(0);
            }
            .mobile-close-btn {
              display: flex;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
