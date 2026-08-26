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

          console.log(
            'Leave History Response:',
            response
          );

          if (!response?.success) {
            throw new Error(
              response?.message ||
              'Failed to fetch leave history'
            );
          }

          const leaveData =
            Array.isArray(response?.leaves)
              ? response.leaves
              : [];

          setLeaves(leaveData);

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
      return '';
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
  // CALCULATE DAYS
  // ==============================

  const calculateDays = (
    startDate,
    endDate
  ) => {
    const startDateValue =
      normalizeDate(startDate);

    const endDateValue =
      normalizeDate(endDate);

    if (
      !startDateValue ||
      !endDateValue
    ) {
      return 0;
    }

    const start =
      new Date(
        `${startDateValue}T00:00:00`
      );

    const end =
      new Date(
        `${endDateValue}T00:00:00`
      );

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return 0;
    }

    const difference =
      end.getTime() -
      start.getTime();

    return (
      Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
      ) + 1
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
    'Days',
    'Reason',
    'Status',
    'Applied Date',
  ];

  // ==============================
  // RENDER ROW
  // ==============================

  const renderRow = (
    leave,
    index
  ) => {
    const days =
      calculateDays(
        leave.startDate,
        leave.endDate
      );

    return (
      <tr
        key={
          leave.id || index
        }
      >
        <td
          style={{
            fontWeight: 600,
          }}
        >
          {leave.leaveType || '-'}
        </td>

        <td>
          {formatDate(
            leave.startDate
          )}
        </td>

        <td>
          {formatDate(
            leave.endDate
          )}
        </td>

        <td>
          {days} {days === 1
            ? 'day'
            : 'days'}
        </td>

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

        <td>
          <span
            className={
              `glass-badge glass-badge-${leave.status}`
            }
          >
            {leave.status || 'pending'}
          </span>
        </td>

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
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Leave History
          </h1>

          <p className="page-subtitle">
            View your complete leave request history
          </p>
        </div>
      </div>

      {/* ERROR */}

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
          data={
            Array.isArray(leaves)
              ? leaves
              : []
          }
          renderRow={renderRow}
          searchPlaceholder="Search leave history..."
          searchField="leaveType"
          noDataMessage={
            error
              ? 'Unable to load leave history.'
              : 'No leave history found.'
          }
        />
      </Card>
    </div>
  );
};

export default LeaveHistory;