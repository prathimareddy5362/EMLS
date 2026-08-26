import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { leaveAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoCalendarOutline, IoDocumentTextOutline, IoGridOutline } from 'react-icons/io5';

const ApplyLeave = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity/Paternity Leave', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Date validations
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start < new Date(new Date().toDateString())) {
      setError('Start date cannot be in the past.');
      return;
    }

    if (end < start) {
      setError('End date must be on or after start date.');
      return;
    }

    setLoading(true);

    try {
      await leaveAPI.applyLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      setSuccess('Leave request submitted successfully!');
      
      // Update local profile balance if mock is running locally
      // In a real API, the backend handles this, but since it is a prototype, let's keep the mock state synced
      const users = JSON.parse(localStorage.getItem('elms_users')) || [];
      const updatedUserObj = users.find(u => u.id === user.id);
      if (updatedUserObj) {
        updateProfile(updatedUserObj);
      }

      setTimeout(() => {
        navigate('/my-leaves');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit leave request.');
    } finally {
      setLoading(false);
    }
  };

  // Balance lookup helpers
  const balance = user?.leaveBalance || { sick: 0, casual: 0, annual: 0, other: 0 };
  
  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Request Leave</h1>
          <p className="page-subtitle">Submit a new request for leave approval</p>
        </div>
      </div>

      <div className="layout-grid">
        {/* Left Side: Form */}
        <div className="grid-col-8">
          <Card hoverable={false}>
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-input-group">
                <label htmlFor="leaveType" className="glass-input-label">
                  Leave Type <span style={{ color: 'var(--danger-text)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>
                    <IoGridOutline size={18} />
                  </div>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="glass-input"
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      appearance: 'none',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    required
                  >
                    {leaveTypes.map((type, idx) => (
                      <option key={idx} value={type} style={{ background: '#1e1b4b', color: '#fff' }}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-col-12">
                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  icon={IoCalendarOutline}
                />
                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  icon={IoCalendarOutline}
                />
              </div>

              <div className="glass-input-group">
                <label htmlFor="reason" className="glass-input-label">
                  Reason for Leave <span style={{ color: 'var(--danger-text)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }}>
                    <IoDocumentTextOutline size={18} />
                  </div>
                  <textarea
                    id="reason"
                    name="reason"
                    placeholder="Provide details about your leave request..."
                    value={formData.reason}
                    onChange={handleChange}
                    className="glass-input"
                    rows={4}
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      resize: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Button type="submit" loading={loading}>
                  Submit Request
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Info Panel */}
        <div className="grid-col-4">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Available Balances</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
              Confirm your limits before submission.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.5rem' }}>
                <span>Annual Leave Balance:</span>
                <span style={{ fontWeight: 600 }}>{balance.annual} days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.5rem' }}>
                <span>Sick Leave Balance:</span>
                <span style={{ fontWeight: 600 }}>{balance.sick} days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.5rem' }}>
                <span>Casual Leave Balance:</span>
                <span style={{ fontWeight: 600 }}>{balance.casual} days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '0.5rem' }}>
                <span>Other Leave Balance:</span>
                <span style={{ fontWeight: 600 }}>{balance.other} days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
