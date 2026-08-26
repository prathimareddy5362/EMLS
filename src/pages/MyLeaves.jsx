import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { leaveAPI } from '../services/api';
import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import { Link } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';

const MyLeaves = () => {
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
          console.error('Failed to fetch user leaves', error);
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

  const headers = ['Leave Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Details'];

  const renderRow = (leave, index) => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return (
      <tr key={leave.id || index}>
        <td style={{ fontWeight: 600 }}>{leave.leaveType}</td>
        <td>{leave.startDate}</td>
        <td>{leave.endDate}</td>
        <td>{diffDays} {diffDays === 1 ? 'day' : 'days'}</td>
        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
          {leave.reason}
        </td>
        <td>
          <span className={`glass-badge glass-badge-${leave.status}`}>
            {leave.status}
          </span>
        </td>
        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {leave.status === 'approved' && `Approved by ${leave.approvedBy || 'Admin'}`}
          {leave.status === 'rejected' && `Rejected: ${leave.rejectionReason || 'No reason provided'}`}
          {leave.status === 'pending' && 'Awaiting review'}
        </td>
      </tr>
    );
  };

  const tableActions = (
    <Link
      to="/apply-leave"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--primary-gradient)',
        color: '#fff',
        padding: '0.6rem 1.1rem',
        borderRadius: '10px',
        fontWeight: 600,
        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
        fontSize: '0.85rem',
      }}
    >
      <IoAdd size={16} />
      <span>New Request</span>
    </Link>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leaves</h1>
          <p className="page-subtitle">Track and audit your current leave requests</p>
        </div>
      </div>

      <Card hoverable={false}>
        <Table
          headers={headers}
          data={leaves}
          renderRow={renderRow}
          searchPlaceholder="Search my leaves..."
          searchField="leaveType"
          actions={tableActions}
          noDataMessage="No leave requests found. Click 'New Request' to apply!"
        />
      </Card>
    </div>
  );
};

export default MyLeaves;
