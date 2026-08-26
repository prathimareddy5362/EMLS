import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) => {
  const hoverClass = hoverable ? 'glass-card-hover' : '';
  const clickableStyle = onClick ? { cursor: 'pointer' } : {};

  return (
    <div
      className={`glass-card ${hoverClass} ${className}`}
      onClick={onClick}
      style={{ padding: '1.5rem', ...clickableStyle }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
