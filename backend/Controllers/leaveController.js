const leaveModel = require("../models/leaveModel");

// =====================================
// GET MY LEAVES
// GET /api/leaves
// =====================================

const getLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    const leaves =
      await leaveModel.getLeavesByUserId(
        userId
      );

    return res.status(200).json({
      success: true,
      leaves: Array.isArray(leaves)
        ? leaves
        : [],
    });

  } catch (error) {
    console.error(
      "Get leaves error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch leave requests",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL LEAVES
// GET /api/leaves/all
// ADMIN ONLY
// =====================================

const getAllLeaves = async (req, res) => {
  try {
    const leaves =
      await leaveModel.getAllLeaves();

    return res.status(200).json({
      success: true,
      leaves: Array.isArray(leaves)
        ? leaves
        : [],
    });

  } catch (error) {
    console.error(
      "Get all leaves error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch all leave requests",
      error: error.message,
    });
  }
};

// =====================================
// APPLY LEAVE
// POST /api/leaves
// =====================================

const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All leave details are required",
      });
    }

    const start =
      new Date(
        `${startDate}T00:00:00`
      );

    const end =
      new Date(
        `${endDate}T00:00:00`
      );

    if (
      Number.isNaN(start.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    if (
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message:
          "End date cannot be before start date",
      });
    }

    const newLeave =
      await leaveModel.createLeave({
        userId,
        leaveType,
        startDate,
        endDate,
        reason,
      });

    return res.status(201).json({
      success: true,
      message:
        "Leave request submitted successfully",
      leave: newLeave,
    });

  } catch (error) {
    console.error(
      "Apply leave error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to apply leave",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE LEAVE STATUS
// PATCH /api/leaves/:id
// ADMIN ONLY
// =====================================

const updateLeaveStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      status,
      rejectionReason = "",
    } = req.body;

    const validStatuses = [
      "pending",
      "approved",
      "rejected",
    ];

    if (
      !status ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid leave status",
      });
    }

    if (
      status === "rejected" &&
      !rejectionReason.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rejection reason is required",
      });
    }

    const updatedLeave =
      await leaveModel.updateLeaveStatus(
        id,
        status,
        rejectionReason
      );

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message:
          "Leave request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Leave status updated successfully",
      leave: updatedLeave,
    });

  } catch (error) {
    console.error(
      "Update leave status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update leave status",
      error: error.message,
    });
  }
};

module.exports = {
  getLeaves,
  getAllLeaves,
  applyLeave,
  updateLeaveStatus,
};