import React, {
  useState,
  useEffect,
} from 'react';

import { leaveAPI } from '../services/api';

import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';

import { Link } from 'react-router-dom';

import {
  IoAdd,
} from 'react-icons/io5';

const MyLeaves = () => {
  const [leaves, setLeaves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // ==============================
  // FETCH MY LEAVES
  // ==============================

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);

        setError('');

        // JWT automatically identifies
        // the logged-in user
        const response =
          await leaveAPI.getLeaves();

        if (!response.success) {
          throw new Error(
            response.message ||
              'Failed to fetch leave requests'
          );
        }

        setLeaves(
          Array.isArray(response.leaves)
            ? response.leaves
            : []
        );

      } catch (error) {
        console.error(
          'Failed to fetch user leaves:',
          error
        );

        setError(
          error.message ||
            'Failed to fetch leave requests'
        );

        setLeaves([]);

      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();

  }, []);

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
    'Details',
  ];

  // ==============================
  // CALCULATE DAYS
  // ==============================

  const calculateDays = (
    startDate,
    endDate
  ) => {
    const start = new Date(
      `${startDate}T00:00:00`
    );

    const end = new Date(
      `${endDate}T00:00:00`
    );

    const difference =
      end.getTime() -
      start.getTime();

    const days =
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return days;
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
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
  // RENDER TABLE ROW
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

        {/* DAYS */}

        <td>
          {days}{' '}

          {days === 1
            ? 'day'
            : 'days'}
        </td>

        {/* REASON */}

        <td
          style={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow:
              'ellipsis',
            whiteSpace:
              'nowrap',
          }}
          title={leave.reason}
        >
          {leave.reason}
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

        {/* DETAILS */}

        <td
          style={{
            fontSize: '0.85rem',
            color:
              'var(--text-secondary)',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow:
              'ellipsis',
            whiteSpace:
              'nowrap',
          }}
        >
          {leave.status ===
            'approved' &&
            'Approved'}

          {leave.status ===
            'rejected' &&
            `Rejected: ${
              leave.rejectionReason ||
              'No reason provided'
            }`}

          {leave.status ===
            'pending' &&
            'Awaiting review'}
        </td>

      </tr>
    );
  };

  // ==============================
  // TABLE ACTION
  // ==============================

  const tableActions = (
    <Link
      to="/apply-leave"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',

        background:
          'var(--primary-gradient)',

        color: '#fff',

        padding:
          '0.6rem 1.1rem',

        borderRadius: '10px',

        fontWeight: 600,

        boxShadow:
          '0 4px 10px rgba(99, 102, 241, 0.2)',

        fontSize: '0.85rem',
      }}
    >
      <IoAdd size={16} />

      <span>
        New Request
      </span>
    </Link>
  );

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
            My Leaves
          </h1>

          <p className="page-subtitle">
            Track and audit your current leave requests
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

      {/* TABLE */}

      <Card hoverable={false}>

        <Table
          headers={headers}
          data={leaves}
          renderRow={renderRow}
          searchPlaceholder="Search my leaves..."
          searchField="leaveType"
          actions={tableActions}
          noDataMessage={
            error
              ? 'Unable to load leave requests.'
              : "No leave requests found. Click 'New Request' to apply!"
          }
        />

      </Card>

    </div>
  );
};

export default MyLeaves;