const express = require("express");

const router = express.Router();

const leaveController =
  require("../Controllers/leaveController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

// =====================================
// ALL LEAVE ROUTES REQUIRE LOGIN
// =====================================

router.use(authMiddleware);

// =====================================
// GET MY LEAVES
// GET /api/leaves
// =====================================

router.get(
  "/",
  leaveController.getLeaves
);

// =====================================
// GET ALL LEAVES
// GET /api/leaves/all
// ADMIN ONLY
// =====================================

router.get(
  "/all",
  adminMiddleware,
  leaveController.getAllLeaves
);

// =====================================
// APPLY LEAVE
// POST /api/leaves
// =====================================

router.post(
  "/",
  leaveController.applyLeave
);

// =====================================
// UPDATE LEAVE STATUS
// PATCH /api/leaves/:id
// ADMIN ONLY
// =====================================

router.patch(
  "/:id",
  adminMiddleware,
  leaveController.updateLeaveStatus
);

module.exports = router;