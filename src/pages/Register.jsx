import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoPersonOutline, IoCardOutline, IoMailOutline, IoBusinessOutline, IoLockClosedOutline } from 'react-icons/io5';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    department: 'Engineering',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        employeeId: formData.employeeId,
        email: formData.email,
        department: formData.department,
        password: formData.password
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
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
        padding: '2.5rem 1.5rem',
        background: 'var(--background-gradient)',
      }}
    >
      <Card
        hoverable={false}
        style={{
          width: '100%',
          maxWidth: '480px',
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register as an employee in the system
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

        {success && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success-glow)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: 'var(--success-text)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <Input
            label="Full Name"
            name="name"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            required
            icon={IoPersonOutline}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-col-12">
            <Input
              label="Employee ID"
              name="employeeId"
              placeholder="EMP101"
              value={formData.employeeId}
              onChange={handleChange}
              required
              icon={IoCardOutline}
            />

            <div className="glass-input-group">
              <label htmlFor="department" className="glass-input-label">
                Department <span style={{ color: 'var(--danger-text)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', zIndex: 10 }}>
                  <IoBusinessOutline size={18} />
                </div>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="glass-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    appearance: 'none',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                  required
                >
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept} style={{ background: '#1e1b4b', color: '#fff' }}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="jane@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={IoMailOutline}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={IoLockClosedOutline}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={IoLockClosedOutline}
          />

          <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Register
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
