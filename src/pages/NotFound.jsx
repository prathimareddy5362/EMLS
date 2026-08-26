import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import { IoWarningOutline } from 'react-icons/io5';

const NotFound = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '1.5rem',
      }}
    >
      <Card
        hoverable={false}
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: 'var(--glass-shadow), 0 20px 25px -5px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            background: 'var(--warning-glow)',
            color: 'var(--warning-text)',
            padding: '1rem',
            borderRadius: '50%',
            display: 'inline-flex',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
          }}
        >
          <IoWarningOutline size={48} />
        </div>

        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            404
          </h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            Page Not Found
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            The page you are looking for does not exist or has been relocated.
          </p>
        </div>

        <Link
          to={getDashboardLink()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--primary-gradient)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            textDecoration: 'none',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          Return to Dashboard
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
