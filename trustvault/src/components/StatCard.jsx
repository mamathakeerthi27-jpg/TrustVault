import React from 'react';

export function StatCard({ title, value, icon: Icon, delta, deltaType = 'positive', badge, glowColor = 'violet' }) {
  let glowStyle = 'var(--shadow-glow-violet)';
  let iconBg = 'rgba(120, 87, 255, 0.12)';
  let iconColor = 'var(--color-violet-light)';

  if (glowColor === 'emerald') {
    glowStyle = 'var(--shadow-glow-emerald)';
    iconBg = 'rgba(32, 201, 151, 0.12)';
    iconColor = 'var(--color-emerald)';
  } else if (glowColor === 'amber') {
    glowStyle = '0 0 25px rgba(245, 158, 11, 0.15)';
    iconBg = 'rgba(245, 158, 11, 0.12)';
    iconColor = 'var(--color-amber)';
  } else if (glowColor === 'indigo') {
    glowStyle = '0 0 25px rgba(79, 70, 229, 0.18)';
    iconBg = 'rgba(79, 70, 229, 0.14)';
    iconColor = '#818CF8';
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '130px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(167, 174, 220, 0.28)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
            {title}
          </span>
          {badge && <div style={{ marginTop: '4px' }}>{badge}</div>}
        </div>
        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              flexShrink: 0
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          {value}
        </span>
        {delta && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: deltaType === 'warning' ? 'var(--color-amber)' : deltaType === 'negative' ? 'var(--color-rose)' : 'var(--color-emerald)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
