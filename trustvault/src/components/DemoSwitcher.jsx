import React, { useState } from 'react';
import { UserCheck, Shield, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const DEMO_PROFILES = [
  {
    role: 'admin',
    name: 'Sarah Connor',
    email: 'admin@trustvault.internal',
    status: 'active',
    desc: 'Platform Administrator',
    badge: 'Admin'
  },
  {
    role: 'owner',
    name: 'Elena Rostova',
    email: 'elena.rostova@acmecorp.com',
    status: 'active',
    desc: 'Approved Enterprise Owner',
    badge: 'Owner (Active)'
  },
  {
    role: 'owner',
    name: 'Marcus Vance',
    email: 'marcus.vance@apexfinancial.io',
    status: 'active',
    desc: 'Approved Financial Owner',
    badge: 'Owner (Active)'
  },
  {
    role: 'owner',
    name: 'David Kim',
    email: 'david.kim@synthetix.tech',
    status: 'pending',
    desc: 'Newly Registered (Requires Admin)',
    badge: 'Owner (Pending)'
  },
  {
    role: 'viewer',
    name: 'Charlotte Lin',
    email: 'charlotte.lin@partnerfirm.com',
    status: 'active',
    desc: 'Restricted Partner Viewer',
    badge: 'Viewer'
  }
];

export function DemoSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, quickSwitchUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSelect = (profile) => {
    quickSwitchUser(profile.email);
    setIsOpen(false);
    
    // Check actual current status from users storage in case user was approved/rejected
    const users = mockAuthService.getUsers();
    const targetUser = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());
    const actualStatus = targetUser ? targetUser.status : profile.status;

    toast.info('Role Switched', `Switched active demo session to ${profile.name} (${profile.badge}).`);

    // Redirect to appropriate landing depending on role & actual status
    if (profile.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (profile.role === 'owner') {
      if (actualStatus === 'pending' || actualStatus === 'rejected') {
        navigate('/auth/pending-approval');
      } else {
        navigate('/owner/dashboard');
      }
    } else if (profile.role === 'viewer') {
      navigate('/viewer/dashboard');
    }
  };


  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-sm"
        style={{
          background: 'rgba(120, 87, 255, 0.12)',
          borderColor: 'rgba(120, 87, 255, 0.35)',
          color: 'var(--color-violet-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          padding: '5px 10px'
        }}
        title="Switch demo persona"
      >
        <UserCheck size={14} />
        <span style={{ fontWeight: 600 }}>Demo Persona</span>
        <ChevronDown size={13} />
      </button>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 998 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="card-elevated"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '280px',
              zIndex: 999,
              padding: '10px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'scaleIn 150ms ease-out'
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                padding: '4px 8px 8px',
                letterSpacing: '0.6px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              Select Demo Persona
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {DEMO_PROFILES.map((p) => {
                const isCurrent = currentUser?.email.toLowerCase() === p.email.toLowerCase();
                const users = mockAuthService.getUsers();
                const userInDb = users.find(u => u.email.toLowerCase() === p.email.toLowerCase());
                const actualStatus = userInDb ? userInDb.status : p.status;
                const badgeText = p.role === 'admin' 
                  ? 'Admin' 
                  : p.role === 'viewer' 
                    ? 'Viewer' 
                    : actualStatus === 'active' 
                      ? 'Owner (Active)' 
                      : actualStatus === 'pending' 
                        ? 'Owner (Pending)' 
                        : 'Owner (Rejected)';

                return (
                  <button
                    key={p.email}
                    onClick={() => handleSelect(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      background: isCurrent ? 'rgba(120, 87, 255, 0.15)' : 'transparent',
                      border: isCurrent ? '1px solid rgba(120, 87, 255, 0.3)' : '1px solid transparent',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'rgba(167, 174, 220, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {p.name}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            background: p.role === 'admin' 
                              ? 'rgba(120, 87, 255, 0.2)' 
                              : actualStatus === 'pending' 
                                ? 'rgba(245, 158, 11, 0.2)' 
                                : actualStatus === 'rejected'
                                  ? 'rgba(244, 63, 94, 0.2)'
                                  : 'rgba(32, 201, 151, 0.2)',
                            color: p.role === 'admin' 
                              ? 'var(--color-violet-light)' 
                              : actualStatus === 'pending' 
                                ? 'var(--color-amber)' 
                                : actualStatus === 'rejected'
                                  ? 'var(--color-rose)'
                                  : 'var(--color-emerald)'
                          }}
                        >
                          {badgeText}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {actualStatus === 'active' && p.role === 'owner' ? 'Approved Enterprise Owner' : p.desc}
                      </div>
                    </div>
                    {isCurrent && <Check size={14} color="var(--color-emerald)" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
