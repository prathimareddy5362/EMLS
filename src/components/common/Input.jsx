import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  return (
    <div className={`glass-input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="glass-input-label">
          {label} {required && <span style={{ color: 'var(--danger-text)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="glass-input"
          style={{
            width: '100%',
            paddingLeft: Icon ? '2.75rem' : '1rem',
            border: error ? '1px solid var(--danger-text)' : '1px solid var(--glass-border)'
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--danger-text)', marginTop: '0.25rem' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
