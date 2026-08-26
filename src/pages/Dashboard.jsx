import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { leaveAPI } from '../services/api';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { Link } from 'react-router-dom';
import { IoCalendarOutline, IoCheckmarkCircleOutline, IoHourglassOutline, IoCloseCircleOutline, IoAdd } from 'react-icons/io5';

const Dashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      if (user) {
        try {
          const userLeaves = await leaveAPI.getLeaves(user.id);
          setLeaves(userLeaves);
        } catch (error) {
          console.error('Failed to load leaves', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchLeaves();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  // Calculate statistics
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;
  const totalApplied = leaves.length;

  const balance = user?.leaveBalance || { sick: 0, casual: 0, annual: 0, other: 0 };
  const totalBalance = Object.values(balance).reduce((a, b) => a + b, 0);

  const recentLeaves = leaves.slice(-3).reverse();

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name}!</h1>
          <p className="page-subtitle">Here is a summary of your leave requests and balances.</p>
        </div>
        <Link
          to="/apply-leave"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-gradient)',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <IoAdd size={20} />
          <span>Apply for Leave</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-grid">
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--info-glow)', color: 'var(--info-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoCalendarOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalBalance}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Leave Balance (Days)</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--success-glow)', color: 'var(--success-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoCheckmarkCircleOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{approvedCount}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Approved Leaves</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--warning-glow)', color: 'var(--warning-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoHourglassOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{pendingCount}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Requests</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--danger-glow)', color: 'var(--danger-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoCloseCircleOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{rejectedCount}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rejected Requests</span>
          </div>
        </Card>
      </div>

      <div className="layout-grid">
        {/* Left Side: Leave Balance Breakdown */}
        <div className="grid-col-4">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Leave Balances</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Breakdown by classification</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Sick Leave</span>
                  <span style={{ fontWeight: 600 }}>{balance.sick} / 10 days</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(balance.sick / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Casual Leave</span>
                  <span style={{ fontWeight: 600 }}>{balance.casual} / 12 days</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(balance.casual / 12) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Annual Leave</span>
                  <span style={{ fontWeight: 600 }}>{balance.annual} / 20 days</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(balance.annual / 20) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #c084fc)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Other Leaves</span>
                  <span style={{ fontWeight: 600 }}>{balance.other} / 10 days</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(balance.other / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Recent Activity */}
        <div className="grid-col-8">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Recent Requests</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest leave submissions</p>
              </div>
              <Link to="/my-leaves" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                View All
              </Link>
            </div>

            {recentLeaves.length === 0 ? (
              <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '150px' }}>
                You haven't submitted any leave requests yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                {recentLeaves.map((leave, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{leave.leaveType}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`glass-badge glass-badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
