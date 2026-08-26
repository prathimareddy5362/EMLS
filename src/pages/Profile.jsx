import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { employeeAPI } from '../services/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoPersonOutline, IoCalendarOutline, IoCardOutline, IoBusinessOutline, IoMailOutline, IoBriefcaseOutline, IoImageOutline } from 'react-icons/io5';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    profilePhoto: user?.profilePhoto || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setLoading(true);

    try {
      // Update employee record
      const updatedUser = await employeeAPI.updateEmployee(user.id, formData);
      
      // Update AuthContext session state
      updateProfile(updatedUser);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      designation: user?.designation || '',
      profilePhoto: user?.profilePhoto || '',
    });
    setError('');
    setIsEditing(false);
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and update your personal credentials</p>
        </div>
      </div>

      <div className="layout-grid">
        {/* Left Side: Avatar and Quick Stats */}
        <div className="grid-col-4">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user?.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'var(--glass-shadow-glow)',
                }}
              />
            </div>
            
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.name}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
                {user?.designation}
              </span>
              <span className={`glass-badge glass-badge-info`} style={{ marginTop: '0.5rem' }}>
                {user?.department}
              </span>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <IoCardOutline size={16} />
                <span>ID: {user?.employeeId}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <IoMailOutline size={16} />
                <span>Email: {user?.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <IoCalendarOutline size={16} />
                <span>Joined: {user?.joinedDate}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Settings / Details Form */}
        <div className="grid-col-8">
          <Card hoverable={false} style={{ height: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Personal Profile Details</h2>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-glow)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--danger-text)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-glow)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--success-text)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="grid-col-12">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  icon={IoPersonOutline}
                />
                
                <Input
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  icon={IoBriefcaseOutline}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="grid-col-12">
                <Input
                  label="Department"
                  value={user?.department || ''}
                  disabled={true}
                  icon={IoBusinessOutline}
                />

                <Input
                  label="Employee ID"
                  value={user?.employeeId || ''}
                  disabled={true}
                  icon={IoCardOutline}
                />
              </div>

              <Input
                label="Profile Photo URL"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
                icon={IoImageOutline}
              />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {isEditing ? (
                  <>
                    <Button type="submit" loading={loading}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
