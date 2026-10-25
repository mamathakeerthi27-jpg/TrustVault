import React, { useState } from 'react';
import { Menu, Search, Bell, LogOut, ShieldCheck, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DemoSwitcher } from './DemoSwitcher';

export function Topbar({ onToggleSidebar, title, breadcrumbs = [] }) {
  const { currentUser, logout, role } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header
      style={{
        height: '70px',
        padding: '0 24px',
        background: 'rgba(9, 11, 22, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left: Mobile Menu toggle + Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="btn-ghost topbar-menu-btn"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
              <span>TrustVault</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span>/</span>
                  <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Demo mode badge, Switcher, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Demo Mode Indicator */}
        <div
          className="demo-mode-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            background: 'rgba(120, 87, 255, 0.1)',
            border: '1px solid rgba(120, 87, 255, 0.25)',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-violet-light)'
          }}
        >
          <span className="pulse-indicator pulse-emerald" />
          <span>Demo mode</span>
        </div>

        {/* Demo Persona Switcher */}
        <DemoSwitcher />

        {/* User Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(17, 22, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
            aria-label="User account menu"
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-indigo) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600 }} className="topbar-username">
              {currentUser?.name || 'User'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {profileDropdown && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                onClick={() => setProfileDropdown(false)}
              />
              <div
                className="card-elevated"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  zIndex: 999,
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser?.email}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-emerald)', marginTop: '4px', textTransform: 'capitalize' }}>
                    Role: {currentUser?.role} • Status: {currentUser?.status}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--color-rose)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .topbar-menu-btn {
          display: none;
        }
        @media (max-width: 1024px) {
          .topbar-menu-btn {
            display: flex;
          }
        }
        @media (max-width: 640px) {
          .demo-mode-pill {
            display: none !important;
          }
          .topbar-username {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
