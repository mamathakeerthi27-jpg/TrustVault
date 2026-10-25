import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••••••',
  label,
  error,
  hint,
  required = false,
  autoComplete = 'current-password',
  disabled = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          <span>{label} {required && <span style={{ color: 'var(--color-rose)' }}>*</span>}</span>
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="form-control"
          style={{
            paddingRight: '42px',
            borderColor: error ? 'var(--color-rose)' : undefined
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
}
