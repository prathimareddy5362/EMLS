import React, {
  useState,
  useEffect,
} from 'react';

import { leaveAPI } from '../services/api';

import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';

const LeaveHistory = () => {
  const [leaves, setLeaves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // ==============================
  // FETCH LEAVE HISTORY
  // ==============================

  useEffect(() => {
    const fetchLeaveHistory =
      async () => {
        try {
          setLoading(true);

          setError('');

          const response =
            await leaveAPI.getLeaves();

          if (!response.success) {
            throw new Error(
              response.message ||
              'Failed to fetch leave history'
            );
          }

          const allLeaves =
            Array.isArray(response.leaves)
              ? response.leaves
              : [];

          // Show only completed requests
          // Approved or Rejected
          const historyLeaves =
            allLeaves.filter(
              (leave) =>
                leave.status === 'approved' ||
                leave.status === 'rejected'
            );

          setLeaves(historyLeaves);

        } catch (error) {
          console.error(
            'Failed to fetch leave history:',
            error
          );

          setError(
            error.message ||
            'Failed to fetch leave history'
          );

          setLeaves([]);

        } finally {
          setLoading(false);
        }
      };

    fetchLeaveHistory();

  }, []);

  // ==============================
  // NORMALIZE DATE
  // ==============================

  const normalizeDate = (date) => {
    if (!date) {
      return null;
    }

    return String(date)
      .split('T')[0];
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    const normalizedDate =
      normalizeDate(date);

    if (!normalizedDate) {
      return '-';
    }

    const parsedDate =
      new Date(
        `${normalizedDate}T00:00:00`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return normalizedDate;
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return <Loader />;
  }

  // ==============================
  // TABLE HEADERS
  // ==============================

  const headers = [
    'Leave Type',
    'Start Date',
    'End Date',
    'Reason',
    'Status',
    'Applied Date',
  ];

  // ==============================
  // RENDER TABLE ROW
  // ==============================

  const renderRow = (
    leave,
    index
  ) => {
    return (
      <tr
        key={
          leave.id || index
        }
      >

        {/* LEAVE TYPE */}

        <td
          style={{
            fontWeight: 600,
          }}
        >
          {leave.leaveType}
        </td>

        {/* START DATE */}

        <td>
          {formatDate(
            leave.startDate
          )}
        </td>

        {/* END DATE */}

        <td>
          {formatDate(
            leave.endDate
          )}
        </td>

        {/* REASON */}

        <td
          title={leave.reason}
          style={{
            maxWidth: '250px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {leave.reason || '-'}
        </td>

        {/* STATUS */}

        <td>
          <span
            className={
              `glass-badge glass-badge-${leave.status}`
            }
          >
            {leave.status}
          </span>
        </td>

        {/* APPLIED DATE */}

        <td>
          {formatDate(
            leave.appliedDate
          )}
        </td>

      </tr>
    );
  };

  // ==============================
  // PAGE
  // ==============================

  return (
    <div
      style={{
        flexGrow: 1,
      }}
    >

      {/* PAGE HEADER */}

      <div className="page-header">
        <div>

          <h1 className="page-title">
            Leave History
          </h1>

          <p className="page-subtitle">
            View your approved and rejected leave requests
          </p>

        </div>
      </div>

      {/* ERROR MESSAGE */}

      {error && (
        <div
          style={{
            background:
              'rgba(239, 68, 68, 0.1)',

            border:
              '1px solid var(--danger-glow)',

            borderRadius: '8px',

            padding:
              '0.75rem 1rem',

            color:
              'var(--danger-text)',

            fontSize:
              '0.85rem',

            marginBottom:
              '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* HISTORY TABLE */}

      <Card hoverable={false}>

        <Table
          headers={headers}
          data={leaves}
          renderRow={renderRow}
          searchPlaceholder="Search leave history..."
          searchField="leaveType"
          noDataMessage={
            error
              ? 'Unable to load leave history.'
              : 'No approved or rejected leave history found.'
          }
        />

      </Card>

    </div>
  );
};

export default LeaveHistory;