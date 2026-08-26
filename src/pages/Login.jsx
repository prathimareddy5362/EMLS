import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Quick Login helper
  const handleQuickLogin = async (role) => {
    const testEmail = role === 'admin' ? 'admin@elms.com' : 'employee@elms.com';
    const testPass = 'password';
    
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(testEmail, testPass);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1.5rem',
        background: 'var(--background-gradient)',
      }}
    >
      <Card
        hoverable={false}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--glass-shadow), 0 20px 25px -5px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
              fontSize: '1.5rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              marginBottom: '0.75rem',
            }}
          >
            E
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to manage your leaves
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger-glow)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: 'var(--danger-text)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={IoMailOutline}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={IoLockClosedOutline}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  width: '15px',
                  height: '15px',
                }}
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Reset password instructions sent if backend is configured.');
              }}
              style={{ color: 'var(--primary)', fontWeight: 500 }}
            >
              Forgot Password?
            </a>
          </div>

          <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register here
          </Link>
        </div>

        {/* Quick Demo Acccess Area */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
            Quick Demo Login
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => handleQuickLogin('employee')} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
              Employee Role
            </Button>
            <Button variant="secondary" onClick={() => handleQuickLogin('admin')} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
              Admin Role
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
