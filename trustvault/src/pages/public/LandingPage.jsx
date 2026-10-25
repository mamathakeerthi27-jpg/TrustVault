import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  FileCheck,
  Activity,
  ArrowRight,
  KeyRound,
  Users,
  Eye,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LandingPage() {
  const { isAuthenticated, role, status } = useAuth();

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'owner') return status === 'active' ? '/owner/dashboard' : '/auth/pending-approval';
    return '/viewer/dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Navigation */}
      <header
        style={{
          height: '76px',
          padding: '0 8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(9, 11, 22, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-indigo) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-glow-violet)'
            }}
          >
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', color: 'var(--text-main)' }}>
            Trust<span style={{ color: 'var(--color-emerald)' }}>Vault</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <Link to={getDashboardLink()} className="btn btn-primary btn-sm">
              Enter Workspace
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/auth/login" className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
                Sign In
              </Link>
              <Link to="/auth/signup" className="btn btn-primary btn-sm">
                Get Started
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '90px 8% 60px',
          maxWidth: '1300px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}
      >
        <div>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(120, 87, 255, 0.12)',
              border: '1px solid rgba(120, 87, 255, 0.28)',
              color: 'var(--color-violet-light)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '24px'
            }}
          >
            <ShieldCheck size={16} color="var(--color-emerald)" />
            <span>Multi-Tenant Enterprise Document Security</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#FFFFFF',
              marginBottom: '22px'
            }}
          >
            Secure sharing. <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-violet-light) 0%, var(--color-emerald) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Smarter access.
            </span> <br />
            Verifiable accountability.
          </h1>

          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '540px'
            }}
          >
            TrustVault gives enterprises granular control over confidential document sharing.
            Protect assets with time-bounded temporary downloads, role-isolated workspaces,
            and cryptographic audit logging.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
            <Link to="/auth/signup" className="btn btn-emerald btn-lg">
              Start Free Demo
              <ArrowRight size={18} />
            </Link>
            <Link to="/auth/login" className="btn btn-secondary btn-lg">
              Explore Demo Accounts
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--color-emerald)" /> 3 Segregated Roles
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--color-emerald)" /> Time-Bounded Passcodes
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--color-emerald)" /> Tamper-Evident Audit
            </span>
          </div>
        </div>

        {/* Abstract Security Graphic Visual in pure CSS & SVG */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow-violet)'
            }}
          >
            {/* Visual Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-rose)' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-amber)' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-emerald)' }} />
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                TRUSTVAULT-ZERO-TRUST-CORE
              </span>
            </div>

            {/* Glowing Encryption Nodes Visual */}
            <div
              style={{
                background: 'rgba(9, 11, 22, 0.9)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} color="var(--color-violet-light)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                      Q3_Strategic_Acquisition_Audit.pdf
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Classification: Highly Confidential
                    </div>
                  </div>
                </div>
                <span className="badge badge-success">Encrypted</span>
              </div>

              {/* Passcode verification animation box */}
              <div
                style={{
                  background: 'rgba(23, 29, 53, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  border: '1px solid var(--border-medium)',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Simulated Decryption Passcode</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-emerald)', fontWeight: 600 }}>
                    TV-ACQ-9281
                  </span>
                </div>
                <div style={{ height: '4px', background: 'rgba(167, 174, 220, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: 'var(--color-emerald)' }} />
                </div>
              </div>

              {/* 5-minute timer indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-amber)' }}>
                  <span className="pulse-indicator pulse-amber" />
                  <span>5-Minute Session Token Active</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontWeight: 600 }}>
                  04:58
                </span>
              </div>
            </div>

            {/* Micro audit feed */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(167, 174, 220, 0.04)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>Owner Elena Rostova granted access</span>
                <span style={{ color: 'var(--color-emerald)' }}>SUCCESS</span>
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(167, 174, 220, 0.04)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>Direct unauthenticated access blocked</span>
                <span style={{ color: 'var(--color-rose)' }}>BLOCKED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Segregation Architecture Section */}
      <section style={{ padding: '80px 8%', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-violet-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Role-Based Governance
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px', letterSpacing: '-0.5px' }}>
              Three Strictly Isolated Personas
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '12px auto 0', fontSize: '15px' }}>
              TrustVault guarantees tenant boundary isolation. Each role operates within an explicitly scoped workspace.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Admin Card */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(120, 87, 255, 0.15)',
                  color: 'var(--color-violet-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                1. System Administrator
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                Oversees platform governance, reviews pending owner applications, enforces security posture, and inspects global audit logs.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--color-violet-light)" /> Approve or reject owner requests
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--color-violet-light)" /> Global compliance and activity audit
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--color-violet-light)" /> Excluded from public signup
                </li>
              </ul>
            </div>

            {/* Owner Card */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(32, 201, 151, 0.3)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(32, 201, 151, 0.15)',
                  color: 'var(--color-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                2. Document Owner
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                Uploads confidential enterprise files, manages access control lists, grants time-bounded permissions, and revokes access instantly.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--color-emerald)" /> Upload documents with encryption metadata
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--color-emerald)" /> Grant & revoke access to registered viewers
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--color-emerald)" /> Registration quarantined until Admin approval
                </li>
              </ul>
            </div>

            {/* Viewer Card */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(79, 70, 229, 0.15)',
                  color: '#818CF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Eye size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                3. Authorized Viewer
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                Restricted document consumer. Sees strictly documents shared with them. Downloads require passcode authentication and enter a 5-minute countdown.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#818CF8" /> Passcode-protected download modal
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#818CF8" /> 5-minute expiring download token
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#818CF8" /> Cannot upload, edit, delete, or re-share
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '36px 8%',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--color-violet-light)" />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>TrustVault</span>
          <span>— Secure sharing. Smarter access. Verifiable accountability.</span>
        </div>
        <div>
          <span>Client-Side Frontend Prototype (Demo Mode) • Future backend in Node.js & Express</span>
        </div>
      </footer>
    </div>
  );
}
