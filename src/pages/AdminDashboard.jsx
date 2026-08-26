import React, {
  useState,
  useEffect,
} from 'react';

import {
  reportAPI,
  leaveAPI,
} from '../services/api';

import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

import {
  Link,
} from 'react-router-dom';

import {
  IoPeopleOutline,
  IoDocumentsOutline,
  IoHourglassOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';

const AdminDashboard = () => {

  // ==============================
  // STATE
  // ==============================

  const [reportData, setReportData] =
    useState(null);

  const [
    pendingRequests,
    setPendingRequests,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {

    if (!date) {
      return '-';
    }

    const normalizedDate =
      String(date).split('T')[0];

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
  // FETCH DASHBOARD DATA
  // ==============================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      setError('');

      // ==========================
      // GET REPORT DATA
      // ==========================

      const reportResponse =
        await reportAPI.getReportData();

      setReportData(
        reportResponse || null
      );

      // ==========================
      // GET ALL LEAVES
      // ADMIN ONLY
      // ==========================

      const leaveResponse =
        await leaveAPI.getAllLeaves();

      if (!leaveResponse?.success) {

        throw new Error(
          leaveResponse?.message ||
          'Failed to fetch leave requests'
        );

      }

      // ==========================
      // SAFE ARRAY
      // ==========================

      const allLeaves =
        Array.isArray(
          leaveResponse?.leaves
        )
          ? leaveResponse.leaves
          : [];

      // ==========================
      // FILTER PENDING
      // ==========================

      const pending =
        allLeaves.filter(
          (leave) =>
            leave?.status === 'pending'
        );

      // ==========================
      // SHOW FIRST 3
      // ==========================

      setPendingRequests(
        pending.slice(0, 3)
      );

    } catch (error) {

      console.error(
        'Failed to load admin dashboard:',
        error
      );

      setError(
        error?.message ||
        'Failed to load dashboard data'
      );

      setPendingRequests([]);

    } finally {

      setLoading(false);

    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {

    fetchDashboardData();

  }, []);

  // ==============================
  // APPROVE / REJECT LEAVE
  // ==============================

  const handleAction = async (
    id,
    status
  ) => {

    try {

      setActionLoading(true);

      setError('');

      let rejectionReason = '';

      // ==========================
      // REJECTION REASON
      // ==========================

      if (status === 'rejected') {

        rejectionReason =
          window.prompt(
            'Enter rejection reason:'
          );

        // User cancelled

        if (rejectionReason === null) {
          return;
        }

        // Empty reason

        if (
          !rejectionReason.trim()
        ) {

          alert(
            'Rejection reason is required'
          );

          return;
        }

      }

      // ==========================
      // API REQUEST
      // ==========================

      const response =
        await leaveAPI.updateStatus(
          id,
          status,
          rejectionReason
        );

      if (!response?.success) {

        throw new Error(
          response?.message ||
          'Failed to update leave request'
        );

      }

      // ==========================
      // REFRESH DATA
      // ==========================

      await fetchDashboardData();

    } catch (error) {

      console.error(
        'Failed to update leave request:',
        error
      );

      const message =
        error?.message ||
        'Failed to update leave request';

      alert(message);

      setError(message);

    } finally {

      setActionLoading(false);

    }
  };

  // ==============================
  // INITIAL LOADING
  // ==============================

  if (loading && !reportData) {

    return <Loader />;

  }

  // ==============================
  // DEFAULT REPORT DATA
  // ==============================

  const totals =
    reportData?.totals || {

      totalEmployees: 0,

      totalRequests: 0,

      pendingRequests: 0,

      approvedRequests: 0,

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

      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <div className="page-header">

        <div>

          <h1 className="page-title">
            Admin Dashboard
          </h1>

          <p className="page-subtitle">
            Overview of company leaves and employee records
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* ERROR MESSAGE */}
      {/* ========================= */}

      {error && (

        <div
          style={{
            background:
              'rgba(239, 68, 68, 0.1)',

            border:
              '1px solid var(--danger-glow)',

            borderRadius:
              '8px',

            padding:
              '0.75rem 1rem',

            color:
              'var(--danger-text)',

            fontSize:
              '0.85rem',

            marginBottom:
              '1.5rem',
          }}
        >

          {error}

        </div>

      )}

      {/* ========================= */}
      {/* DASHBOARD METRICS */}
      {/* ========================= */}

      <div className="dashboard-grid">

        {/* TOTAL EMPLOYEES */}

        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >

          <div
            style={{
              background:
                'var(--info-glow)',

              color:
                'var(--info-text)',

              padding:
                '0.85rem',

              borderRadius:
                '12px',

              display:
                'flex',
            }}
          >

            <IoPeopleOutline
              size={26}
            />

          </div>

          <div>

            <h3
              style={{
                fontSize:
                  '1.75rem',

                fontWeight:
                  700,
              }}
            >
              {totals.totalEmployees || 0}
            </h3>

            <span
              style={{
                fontSize:
                  '0.85rem',

                color:
                  'var(--text-secondary)',
              }}
            >
              Total Employees
            </span>

          </div>

        </Card>

        {/* TOTAL REQUESTS */}

        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >

          <div
            style={{
              background:
                'var(--primary-gradient)',

              color:
                '#fff',

              padding:
                '0.85rem',

              borderRadius:
                '12px',

              display:
                'flex',
            }}
          >

            <IoDocumentsOutline
              size={26}
            />

          </div>

          <div>

            <h3
              style={{
                fontSize:
                  '1.75rem',

                fontWeight:
                  700,
              }}
            >
              {totals.totalRequests || 0}
            </h3>

            <span
              style={{
                fontSize:
                  '0.85rem',

                color:
                  'var(--text-secondary)',
              }}
            >
              Total Requests
            </span>

          </div>

        </Card>

        {/* PENDING REQUESTS */}

        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >

          <div
            style={{
              background:
                'var(--warning-glow)',

              color:
                'var(--warning-text)',

              padding:
                '0.85rem',

              borderRadius:
                '12px',

              display:
                'flex',
            }}
          >

            <IoHourglassOutline
              size={26}
            />

          </div>

          <div>

            <h3
              style={{
                fontSize:
                  '1.75rem',

                fontWeight:
                  700,
              }}
            >
              {totals.pendingRequests || 0}
            </h3>

            <span
              style={{
                fontSize:
                  '0.85rem',

                color:
                  'var(--text-secondary)',
              }}
            >
              Pending Requests
            </span>

          </div>

        </Card>

        {/* APPROVED REQUESTS */}

        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >

          <div
            style={{
              background:
                'var(--success-glow)',

              color:
                'var(--success-text)',

              padding:
                '0.85rem',

              borderRadius:
                '12px',

              display:
                'flex',
            }}
          >

            <IoCheckmarkCircleOutline
              size={26}
            />

          </div>

          <div>

            <h3
              style={{
                fontSize:
                  '1.75rem',

                fontWeight:
                  700,
              }}
            >
              {totals.approvedRequests || 0}
            </h3>

            <span
              style={{
                fontSize:
                  '0.85rem',

                color:
                  'var(--text-secondary)',
              }}
            >
              Approved Requests
            </span>

          </div>

        </Card>

      </div>

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <div className="layout-grid">

        {/* ========================= */}
        {/* MODERATION QUEUE */}
        {/* ========================= */}

        <div className="grid-col-8">

          <Card
            hoverable={false}

            style={{
              display:
                'flex',

              flexDirection:
                'column',

              gap:
                '1.25rem',

              height:
                '100%',
            }}
          >

            {/* HEADER */}

            <div
              style={{
                display:
                  'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',
              }}
            >

              <div>

                <h3
                  style={{
                    fontSize:
                      '1.15rem',

                    fontWeight:
                      600,
                  }}
                >
                  Moderation Queue
                </h3>

                <p
                  style={{
                    fontSize:
                      '0.8rem',

                    color:
                      'var(--text-muted)',
                  }}
                >
                  Pending requests requiring review
                </p>

              </div>

              <Link
                to="/leave-requests"

                style={{
                  fontSize:
                    '0.85rem',

                  fontWeight:
                    600,

                  color:
                    'var(--primary)',
                }}
              >
                View All Queue
              </Link>

            </div>

            {/* LOADING */}

            {loading ? (

              <Loader />

            ) : pendingRequests.length === 0 ? (

              <div
                style={{
                  display:
                    'flex',

                  flexGrow:
                    1,

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  color:
                    'var(--text-muted)',

                  minHeight:
                    '180px',
                }}
              >

                All clear! No pending leave requests.

              </div>

            ) : (

              <div
                style={{
                  display:
                    'flex',

                  flexDirection:
                    'column',

                  gap:
                    '1rem',

                  flexGrow:
                    1,
                }}
              >

                {pendingRequests.map(
                  (req, index) => (

                    <div
                      key={
                        req?.id ||
                        index
                      }

                      style={{
                        background:
                          'rgba(255, 255, 255, 0.02)',

                        border:
                          '1px solid rgba(255, 255, 255, 0.04)',

                        borderRadius:
                          '12px',

                        padding:
                          '1.25rem',

                        display:
                          'flex',

                        justifyContent:
                          'space-between',

                        alignItems:
                          'center',

                        flexWrap:
                          'wrap',

                        gap:
                          '1rem',
                      }}
                    >

                      {/* EMPLOYEE DETAILS */}

                      <div>

                        <div
                          style={{
                            display:
                              'flex',

                            alignItems:
                              'center',

                            gap:
                              '0.5rem',

                            marginBottom:
                              '0.25rem',
                          }}
                        >

                          <span
                            style={{
                              fontWeight:
                                600,

                              fontSize:
                                '0.95rem',
                            }}
                          >
                            {req.employeeName ||
                              `User #${req.userId}`}
                          </span>

                          {req.department && (

                            <span
                              style={{
                                fontSize:
                                  '0.75rem',

                                color:
                                  'var(--text-muted)',
                              }}
                            >
                              ({req.department})
                            </span>

                          )}

                        </div>

                        {/* LEAVE TYPE */}

                        <p
                          style={{
                            fontSize:
                              '0.85rem',

                            color:
                              'var(--text-secondary)',
                          }}
                        >

                          Requesting{' '}

                          <strong
                            style={{
                              color:
                                'var(--primary)',
                            }}
                          >
                            {req.leaveType || '-'}
                          </strong>

                        </p>

                        {/* DATES */}

                        <p
                          style={{
                            fontSize:
                              '0.75rem',

                            color:
                              'var(--text-muted)',
                          }}
                        >

                          Dates:{' '}

                          {formatDate(
                            req.startDate
                          )}

                          {' '}to{' '}

                          {formatDate(
                            req.endDate
                          )}

                        </p>

                        {/* REASON */}

                        <p
                          style={{
                            fontSize:
                              '0.8rem',

                            fontStyle:
                              'italic',

                            marginTop:
                              '0.25rem',

                            color:
                              'var(--text-secondary)',
                          }}
                        >

                          "{req.reason || 'No reason provided'}"

                        </p>

                      </div>

                      {/* ACTION BUTTONS */}

                      <div
                        style={{
                          display:
                            'flex',

                          gap:
                            '0.5rem',
                        }}
                      >

                        {/* APPROVE */}

                        <Button
                          variant="success"

                          loading={actionLoading}

                          onClick={() =>
                            handleAction(
                              req.id,
                              'approved'
                            )
                          }

                          style={{
                            padding:
                              '0.5rem 0.75rem',

                            fontSize:
                              '0.8rem',
                          }}
                        >

                          Approve

                        </Button>

                        {/* REJECT */}

                        <Button
                          variant="danger"

                          loading={actionLoading}

                          onClick={() =>
                            handleAction(
                              req.id,
                              'rejected'
                            )
                          }

                          style={{
                            padding:
                              '0.5rem 0.75rem',

                            fontSize:
                              '0.8rem',
                          }}
                        >

                          Reject

                        </Button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </Card>

        </div>

        {/* ========================= */}
        {/* QUICK ACTIONS */}
        {/* ========================= */}

        <div className="grid-col-4">

          <Card
            hoverable={false}

            style={{
              display:
                'flex',

              flexDirection:
                'column',

              gap:
                '1.25rem',

              height:
                '100%',
            }}
          >

            <h3
              style={{
                fontSize:
                  '1.15rem',

                fontWeight:
                  600,
              }}
            >
              Quick Actions
            </h3>

            <p
              style={{
                fontSize:
                  '0.8rem',

                color:
                  'var(--text-muted)',

                marginTop:
                  '-0.5rem',
              }}
            >
              Common system administration functions
            </p>

            <div
              style={{
                display:
                  'flex',

                flexDirection:
                  'column',

                gap:
                  '0.85rem',

                marginTop:
                  '0.5rem',
              }}
            >

              {/* EMPLOYEES */}

              <Link
                to="/employees"

                style={{
                  padding:
                    '0.85rem 1rem',

                  background:
                    'rgba(255, 255, 255, 0.03)',

                  border:
                    '1px solid var(--glass-border)',

                  borderRadius:
                    '10px',

                  color:
                    'var(--text-primary)',

                  textDecoration:
                    'none',

                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',
                }}
              >

                <span>
                  Manage Employees
                </span>

                <span
                  style={{
                    fontSize:
                      '0.75rem',

                    color:
                      'var(--text-muted)',
                  }}
                >
                  Add/edit profiles
                </span>

              </Link>

              {/* LEAVE REQUESTS */}

              <Link
                to="/leave-requests"

                style={{
                  padding:
                    '0.85rem 1rem',

                  background:
                    'rgba(255, 255, 255, 0.03)',

                  border:
                    '1px solid var(--glass-border)',

                  borderRadius:
                    '10px',

                  color:
                    'var(--text-primary)',

                  textDecoration:
                    'none',

                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',
                }}
              >

                <span>
                  Moderation Queue
                </span>

                <span
                  style={{
                    fontSize:
                      '0.75rem',

                    color:
                      'var(--text-muted)',
                  }}
                >
                  {totals.pendingRequests || 0} reviews pending
                </span>

              </Link>

              {/* REPORTS */}

              <Link
                to="/reports"

                style={{
                  padding:
                    '0.85rem 1rem',

                  background:
                    'rgba(255, 255, 255, 0.03)',

                  border:
                    '1px solid var(--glass-border)',

                  borderRadius:
                    '10px',

                  color:
                    'var(--text-primary)',

                  textDecoration:
                    'none',

                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',
                }}
              >

                <span>
                  View Reports
                </span>

                <span
                  style={{
                    fontSize:
                      '0.75rem',

                    color:
                      'var(--text-muted)',
                  }}
                >
                  Monthly charts
                </span>

              </Link>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;