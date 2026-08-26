import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '1.5rem 0 0 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} ELMS. All rights reserved.
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="#" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</a>
        <a href="#" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
