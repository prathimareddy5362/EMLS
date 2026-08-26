import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { leaveAPI } from '../services/api';
import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';

const LeaveHistory = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('All');

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

  // Years listing
  const years = ['All', ...new Set(leaves.map(l => new Date(l.startDate).getFullYear().toString()))].sort().reverse();

  // Filter based on Year Selection
  const filteredLeaves = selectedYear === 'All'
    ? leaves
    : leaves.filter(l => new Date(l.startDate).getFullYear().toString() === selectedYear);

  const headers = ['Leave Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Closed Date'];

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
        <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
          {leave.reason}
        </td>
        <td>
          <span className={`glass-badge glass-badge-${leave.status}`}>
            {leave.status}
          </span>
        </td>
        <td>{leave.status !== 'pending' ? leave.appliedDate : 'In Review'}</td>
      </tr>
    );
  };

  const yearSelector = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Year:</label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
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
        {years.map((year, idx) => (
          <option key={idx} value={year} style={{ background: '#1e1b4b', color: '#fff' }}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave History</h1>
          <p className="page-subtitle">Historical archive of your requests by year</p>
        </div>
      </div>

      <Card hoverable={false}>
        <Table
          headers={headers}
          data={filteredLeaves}
          renderRow={renderRow}
          searchPlaceholder="Search history logs..."
          actions={yearSelector}
          noDataMessage="No historical leave logs found."
        />
      </Card>
    </div>
  );
};

export default LeaveHistory;
