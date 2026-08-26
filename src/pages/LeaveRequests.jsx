import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchLeaves = async () => {
    try {
      const data = await leaveAPI.getLeaves();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to load leave requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    let rejectionReason = '';
    if (status === 'rejected') {
      rejectionReason = window.prompt('Enter rejection reason (optional):') || 'Rejection reason unspecified';
    }

    try {
      setLoading(true);
      await leaveAPI.updateStatus(id, status, rejectionReason);
      await fetchLeaves();
    } catch (error) {
      alert(error.message || 'Failed to update request');
      setLoading(false);
    }
  };

  if (loading && leaves.length === 0) {
    return <Loader />;
  }

  // Filter based on selected status filter
  const filteredLeaves = statusFilter === 'All'
    ? leaves
    : leaves.filter(l => l.status === statusFilter);

  const headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Actions'];

  const renderRow = (leave, index) => (
    <tr key={leave.id || index}>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600 }}>{leave.employeeName}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {leave.employeeId} | {leave.department}</span>
        </div>
      </td>
      <td style={{ fontWeight: 500 }}>{leave.leaveType}</td>
      <td>{leave.startDate}</td>
      <td>{leave.endDate}</td>
      <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
        {leave.reason}
      </td>
      <td>
        <span className={`glass-badge glass-badge-${leave.status}`}>
          {leave.status}
        </span>
      </td>
      <td>
        {leave.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="success" onClick={() => handleAction(leave.id, 'approved')} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}>
              Approve
            </Button>
            <Button variant="danger" onClick={() => handleAction(leave.id, 'rejected')} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}>
              Reject
            </Button>
          </div>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {leave.status === 'approved' ? `Approved` : `Rejected`}
          </span>
        )}
      </td>
    </tr>
  );

  const filterSelector = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="glass-input"
        style={{
          padding: '0.4rem 1rem',
          fontSize: '0.85rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          border: '1px solid var(--glass-border)',
        }}
      >
        <option value="All" style={{ background: '#1e1b4b', color: '#fff' }}>All Requests</option>
        <option value="pending" style={{ background: '#1e1b4b', color: '#fff' }}>Pending</option>
        <option value="approved" style={{ background: '#1e1b4b', color: '#fff' }}>Approved</option>
        <option value="rejected" style={{ background: '#1e1b4b', color: '#fff' }}>Rejected</option>
      </select>
    </div>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Requests</h1>
          <p className="page-subtitle">Moderate and process employee leave submissions</p>
        </div>
      </div>

      <Card hoverable={false}>
        <Table
          headers={headers}
          data={filteredLeaves}
          renderRow={renderRow}
          searchPlaceholder="Search request queue..."
          searchField="employeeName"
          actions={filterSelector}
          noDataMessage={`No ${statusFilter !== 'All' ? statusFilter : ''} requests found.`}
        />
      </Card>
    </div>
  );
};

export default LeaveRequests;
