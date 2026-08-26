import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { leaveAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

import {
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoGridOutline,
} from 'react-icons/io5';

const ApplyLeave = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Casual Leave',
    'Maternity/Paternity Leave',
    'Other',
  ];

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==============================
  // HANDLE SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // --------------------------
    // Frontend validation
    // --------------------------

    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      setError('Please fill in all leave details.');

      return;
    }

    const startDate = new Date(
      `${formData.startDate}T00:00:00`
    );

    const endDate = new Date(
      `${formData.endDate}T00:00:00`
    );

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    // Start date cannot be in the past
    if (startDate < today) {
      setError(
        'Start date cannot be in the past.'
      );

      return;
    }

    // End date validation
    if (endDate < startDate) {
      setError(
        'End date must be on or after start date.'
      );

      return;
    }

    setLoading(true);

    try {
      // Backend JWT automatically provides user ID.
      // DO NOT send userId from frontend.
      const response =
        await leaveAPI.applyLeave({
          leaveType:
            formData.leaveType,

          startDate:
            formData.startDate,

          endDate:
            formData.endDate,

          reason:
            formData.reason.trim(),
        });

      if (!response.success) {
        throw new Error(
          response.message ||
            'Failed to submit leave request.'
        );
      }

      setSuccess(
        response.message ||
          'Leave request submitted successfully!'
      );

      // Clear form
      setFormData({
        leaveType:
          'Annual Leave',

        startDate: '',
        endDate: '',
        reason: '',
      });

      // Redirect after success
      setTimeout(() => {
        navigate('/my-leaves');
      }, 1500);

    } catch (err) {
      setError(
        err.message ||
          'Failed to submit leave request.'
      );

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LEAVE BALANCE
  // ==============================

  const balance =
    user?.leaveBalance || {
      sick: 0,
      casual: 0,
      annual: 0,
      other: 0,
    };

  return (
    <div style={{ flexGrow: 1 }}>

      {/* ==========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">
        <div>
          <h1 className="page-title">
            Request Leave
          </h1>

          <p className="page-subtitle">
            Submit a new request for leave approval
          </p>
        </div>
      </div>

      <div className="layout-grid">

        {/* ==========================
            LEFT SIDE - FORM
        ========================== */}

        <div className="grid-col-8">

          <Card hoverable={false}>

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
                    '1.5rem',
                }}
              >
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}

            {success && (
              <div
                style={{
                  background:
                    'rgba(16, 185, 129, 0.1)',

                  border:
                    '1px solid var(--success-glow)',

                  borderRadius: '8px',

                  padding:
                    '0.75rem 1rem',

                  color:
                    'var(--success-text)',

                  fontSize:
                    '0.85rem',

                  marginBottom:
                    '1.5rem',
                }}
              >
                {success}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >

              {/* LEAVE TYPE */}

              <div className="glass-input-group">

                <label
                  htmlFor="leaveType"
                  className="glass-input-label"
                >
                  Leave Type{' '}

                  <span
                    style={{
                      color:
                        'var(--danger-text)',
                    }}
                  >
                    *
                  </span>
                </label>

                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >

                  <div
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      color:
                        'var(--text-muted)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  >
                    <IoGridOutline
                      size={18}
                    />
                  </div>

                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="glass-input"
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      appearance: 'none',
                      background:
                        'rgba(255, 255, 255, 0.04)',
                      color:
                        'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    required
                  >
                    {leaveTypes.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                          style={{
                            background:
                              '#1e1b4b',
                            color: '#fff',
                          }}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>

                </div>
              </div>

              {/* DATES */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: '1rem',
                }}
              >

                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={
                    formData.startDate
                  }
                  onChange={
                    handleChange
                  }
                  required
                  icon={
                    IoCalendarOutline
                  }
                />

                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={
                    formData.endDate
                  }
                  onChange={
                    handleChange
                  }
                  required
                  icon={
                    IoCalendarOutline
                  }
                />

              </div>

              {/* REASON */}

              <div className="glass-input-group">

                <label
                  htmlFor="reason"
                  className="glass-input-label"
                >
                  Reason for Leave{' '}

                  <span
                    style={{
                      color:
                        'var(--danger-text)',
                    }}
                  >
                    *
                  </span>
                </label>

                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                  }}
                >

                  <div
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '0.85rem',
                      color:
                        'var(--text-muted)',
                    }}
                  >
                    <IoDocumentTextOutline
                      size={18}
                    />
                  </div>

                  <textarea
                    id="reason"
                    name="reason"
                    placeholder="Provide details about your leave request..."
                    value={
                      formData.reason
                    }
                    onChange={
                      handleChange
                    }
                    className="glass-input"
                    rows={4}
                    style={{
                      width: '100%',
                      paddingLeft:
                        '2.75rem',
                      resize: 'none',
                    }}
                    required
                  />

                </div>
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop:
                    '0.5rem',
                }}
              >

                <Button
                  type="submit"
                  loading={loading}
                >
                  Submit Request
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    navigate('/dashboard')
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>

              </div>

            </form>

          </Card>

        </div>

        {/* ==========================
            RIGHT SIDE - BALANCE
        ========================== */}

        <div className="grid-col-4">

          <Card
            hoverable={false}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >

            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Available Balances
            </h3>

            <p
              style={{
                fontSize: '0.8rem',
                color:
                  'var(--text-muted)',
                marginTop:
                  '-0.5rem',
              }}
            >
              Confirm your limits before submission.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop:
                  '0.5rem',
              }}
            >

              <BalanceRow
                label="Annual Leave Balance:"
                value={balance.annual}
              />

              <BalanceRow
                label="Sick Leave Balance:"
                value={balance.sick}
              />

              <BalanceRow
                label="Casual Leave Balance:"
                value={balance.casual}
              />

              <BalanceRow
                label="Other Leave Balance:"
                value={balance.other}
                last
              />

            </div>

          </Card>

        </div>

      </div>
    </div>
  );
};


// ==============================
// BALANCE ROW COMPONENT
// ==============================

const BalanceRow = ({
  label,
  value,
  last = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent:
          'space-between',

        fontSize:
          '0.9rem',

        borderBottom:
          last
            ? 'none'
            : '1px solid rgba(255, 255, 255, 0.04)',

        paddingBottom:
          '0.5rem',
      }}
    >
      <span>
        {label}
      </span>

      <span
        style={{
          fontWeight: 600,
        }}
      >
        {value ?? 0} days
      </span>
    </div>
  );
};


export default ApplyLeave;