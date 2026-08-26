import React, { useState, useEffect } from 'react';
import { reportAPI, leaveAPI } from '../services/api';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { IoPeopleOutline, IoDocumentsOutline, IoHourglassOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const AdminDashboard = () => {
  const [reportData, setReportData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const rep = await reportAPI.getReportData();
      setReportData(rep);
      
      const allLeaves = await leaveAPI.getLeaves();
      const pending = allLeaves.filter(l => l.status === 'pending');
      setPendingRequests(pending.slice(0, 3)); // show top 3 pending
    } catch (error) {
      console.error('Failed to load admin stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (id, status) => {
    try {
      setLoading(true);
      await leaveAPI.updateStatus(id, status);
      await fetchDashboardData();
    } catch (error) {
      alert(error.message || 'Failed to update leave request');
      setLoading(false);
    }
  };

  if (loading && !reportData) {
    return <Loader />;
  }

  const { totals } = reportData || {
    totals: { totalEmployees: 0, totalRequests: 0, pendingRequests: 0, approvedRequests: 0 }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of company leaves and employee records</p>
        </div>
      </div>

      {/* Admin metrics card grid */}
      <div className="dashboard-grid">
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--info-glow)', color: 'var(--info-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoPeopleOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totals.totalEmployees}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Employees</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--primary-gradient)', opacity: 0.85, color: '#fff', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoDocumentsOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totals.totalRequests}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Requests</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--warning-glow)', color: 'var(--warning-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoHourglassOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totals.pendingRequests}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Requests</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--success-glow)', color: 'var(--success-text)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
            <IoCheckmarkCircleOutline size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totals.approvedRequests}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Approved Requests</span>
          </div>
        </Card>
      </div>

      <div className="layout-grid">
        {/* Moderation Queue */}
        <div className="grid-col-8">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Moderation Queue</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending requests requiring review</p>
              </div>
              <Link to="/leave-requests" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                View All Queue
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '180px' }}>
                All clear! No pending leave requests.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                {pendingRequests.map((req, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{req.employeeName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({req.department})</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Requesting <strong style={{ color: 'var(--primary)' }}>{req.leaveType}</strong>
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Dates: {req.startDate} to {req.endDate}
                      </p>
                      <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                        "{req.reason}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="success" onClick={() => handleAction(req.id, 'approved')} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                        Approve
                      </Button>
                      <Button variant="danger" onClick={() => handleAction(req.id, 'rejected')} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right side widgets: Quick Admin Links */}
        <div className="grid-col-4">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Quick Actions</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Common system administration functions</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
              <Link to="/employees" style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Manage Employees</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add/edit profiles</span>
              </Link>

              <Link to="/leave-requests" style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Moderation Queue</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{totals.pendingRequests} reviews pending</span>
              </Link>

              <Link to="/reports" style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>View Reports</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly charts</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
