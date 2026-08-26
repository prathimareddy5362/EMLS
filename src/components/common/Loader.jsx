import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }
    : {
        width: '100%',
        height: '200px',
      };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        ...containerStyle,
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.08)',
          borderTopColor: 'var(--primary)',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
        }}
        className="animate-spin"
      />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em' }}>
        LOADING...
      </span>
    </div>
  );
};

export default Loader;
