import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  KeyRound,
  ShieldCheck,
  Info,
  Server,
  Terminal,
  Activity
} from 'lucide-react';
import { mockAuditService } from '../../services/mockAuditService';
import { StatCard } from '../../components/StatCard';
import { formatDate } from '../../utils/formatters';

export function AdminSecurity() {
  const stats = mockAuditService.getSecurityStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="pulse-indicator pulse-amber" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-amber)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Simulated Telemetry Environment
          </span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Security & Threat Posture Overview
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Simulated security boundary indicators, authorization alerts, and zero-trust policy health checks.
        </p>
      </div>

      {/* Critical Explicit Disclaimer Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          background: 'rgba(23, 29, 53, 0.85)',
          borderLeft: '4px solid var(--color-amber)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}
      >
        <Info size={20} color="var(--color-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-main)' }}>Prototype Notice:</strong> Live real-time anomaly detection and background intrusion monitoring are strictly simulated in this frontend demonstration phase. Cryptographic key custody, hardware security module attestation, and rate-limiting enforcement will be implemented in the future Node.js + Express backend.
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="Simulated Failed Attempts"
          value={stats.failedAccessAttempts}
          icon={AlertTriangle}
          delta="Rate-limited demo"
          deltaType="warning"
          glowColor="amber"
        />
        <StatCard
          title="ACL Grants & Revocations (24h)"
          value={stats.permissionChanges24h}
          icon={KeyRound}
          delta="Audited actions"
          deltaType="positive"
          glowColor="violet"
        />
        <StatCard
          title="Active Authenticated Sessions"
          value={stats.activeSessions}
          icon={Activity}
          delta="Browser storage simulation"
          deltaType="positive"
          glowColor="emerald"
        />
        <StatCard
          title="Compliance Score"
          value={stats.complianceScore}
          icon={ShieldCheck}
          delta="Zero-trust baseline"
          deltaType="positive"
          glowColor="emerald"
        />
      </div>

      {/* Two Column Grid: Recent Threat Events & Security Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Threat Events */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Security & Access Events
            </h3>
            <span className="badge badge-muted">Simulated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.recentThreatEvents.map((evt) => (
              <div
                key={evt.id}
                className="card-elevated"
                style={{
                  padding: '16px',
                  background: 'rgba(11, 16, 32, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    {evt.title}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: evt.level === 'medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(120, 87, 255, 0.15)',
                      color: evt.level === 'medium' ? 'var(--color-amber)' : 'var(--color-violet-light)'
                    }}
                  >
                    {evt.level.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Source: <code style={{ fontFamily: 'var(--font-mono)' }}>{evt.source}</code> • Target: {evt.target}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span style={{ color: 'var(--color-emerald)' }}>{evt.status}</span>
                  <span>{formatDate(evt.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Platform Security Recommendations
            </h3>
            <span className="badge badge-primary">Roadmap</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.securityRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="card-elevated"
                style={{
                  padding: '16px',
                  background: 'rgba(11, 16, 32, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    {rec.title}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: rec.priority === 'High' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: rec.priority === 'High' ? 'var(--color-rose)' : 'var(--color-amber)'
                    }}
                  >
                    {rec.priority} Priority
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
