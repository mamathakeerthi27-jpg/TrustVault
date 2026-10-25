import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message, duration: 6000 }),
    info: (title, message) => addToast({ type: 'info', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message, duration: 5000 })
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => {
          let Icon = Info;
          let borderColor = 'var(--border-medium)';
          let iconColor = 'var(--color-violet-light)';
          let bgGradient = 'rgba(17, 22, 42, 0.95)';

          if (t.type === 'success') {
            Icon = CheckCircle2;
            borderColor = 'rgba(32, 201, 151, 0.35)';
            iconColor = 'var(--color-emerald)';
          } else if (t.type === 'error') {
            Icon = AlertCircle;
            borderColor = 'rgba(244, 63, 94, 0.35)';
            iconColor = 'var(--color-rose)';
          } else if (t.type === 'warning') {
            Icon = AlertTriangle;
            borderColor = 'rgba(245, 158, 11, 0.35)';
            iconColor = 'var(--color-amber)';
          }

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: bgGradient,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'scaleIn 180ms ease-out',
                color: 'var(--text-main)'
              }}
            >
              <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title && (
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: t.message ? '2px' : '0' }}>
                    {t.title}
                  </div>
                )}
                {t.message && (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                    {t.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
