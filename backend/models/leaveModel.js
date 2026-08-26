const db = require("../config/db");

// =====================================
// GET ALL LEAVES
// Admin functionality
// =====================================

const getAllLeaves = async () => {
  const [rows] = await db.query(`
    SELECT
      l.id,

      l.user_id AS userId,

      u.name AS employeeName,

      u.employee_id AS employeeId,

      u.department AS department,

      l.leave_type AS leaveType,

      l.start_date AS startDate,

      l.end_date AS endDate,

      l.reason,

      l.status,

      l.applied_date AS appliedDate,

      l.rejection_reason AS rejectionReason

    FROM leaves l

    INNER JOIN users u
      ON l.user_id = u.id

    ORDER BY
      l.applied_date DESC,
      l.id DESC
  `);

  return rows;
};

// =====================================
// GET LOGGED-IN USER LEAVES
// =====================================

const getLeavesByUserId = async (
  userId
) => {
  const [rows] = await db.query(
    `
      SELECT
        id,

        user_id AS userId,

        leave_type AS leaveType,

        start_date AS startDate,

        end_date AS endDate,

        reason,

        status,

        applied_date AS appliedDate,

        rejection_reason AS rejectionReason

      FROM leaves

      WHERE user_id = ?

      ORDER BY
        applied_date DESC,
        id DESC
    `,
    [userId]
  );

  return rows;
};

// =====================================
// CREATE LEAVE REQUEST
// =====================================

const createLeave = async ({
  userId,
  leaveType,
  startDate,
  endDate,
  reason,
}) => {
  const [result] = await db.query(
    `
      INSERT INTO leaves (
        user_id,
        leave_type,
        start_date,
        end_date,
        reason,
        status,
        applied_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    `,
    [
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      "pending",
    ]
  );

  const [rows] = await db.query(
    `
      SELECT
        id,

        user_id AS userId,

        leave_type AS leaveType,

        start_date AS startDate,

        end_date AS endDate,

        reason,

        status,

        applied_date AS appliedDate,

        rejection_reason AS rejectionReason

      FROM leaves

      WHERE id = ?

      LIMIT 1
    `,
    [result.insertId]
  );

  return rows[0] || null;
};

// =====================================
// UPDATE LEAVE STATUS
// =====================================

const updateLeaveStatus = async (
  leaveId,
  status,
  rejectionReason = ""
) => {
  const [result] = await db.query(
    `
      UPDATE leaves

      SET
        status = ?,

        rejection_reason = ?

      WHERE id = ?
    `,
    [
      status,

      status === "rejected"
        ? rejectionReason
        : null,

      leaveId,
    ]
  );

  if (
    result.affectedRows === 0
  ) {
    return null;
  }

  const [rows] = await db.query(
    `
      SELECT
        l.id,

        l.user_id AS userId,

        u.name AS employeeName,

        u.employee_id AS employeeId,

        u.department AS department,

        l.leave_type AS leaveType,

        l.start_date AS startDate,

        l.end_date AS endDate,

        l.reason,

        l.status,

        l.applied_date AS appliedDate,

        l.rejection_reason AS rejectionReason

      FROM leaves l

      INNER JOIN users u
        ON l.user_id = u.id

      WHERE l.id = ?

      LIMIT 1
    `,
    [leaveId]
  );

  return rows[0] || null;
};

module.exports = {
  getAllLeaves,
  getLeavesByUserId,
  createLeave,
  updateLeaveStatus,
};