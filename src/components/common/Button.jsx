import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  icon: Icon = null,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'glass-btn-primary';
      case 'secondary': return 'glass-btn-secondary';
      case 'danger': return 'glass-btn-danger';
      case 'success': return 'glass-btn-success';
      default: return 'glass-btn-primary';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`glass-btn ${getVariantClass()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="animate-spin" style={{ display: 'inline-block', width: '1rem', height: '1rem', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
      ) : (
        Icon && <Icon size={18} />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
