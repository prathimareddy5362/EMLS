const express = require("express");

const router = express.Router();

const authController = require("../Controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// ==============================
// PUBLIC ROUTES
// ==============================

// Register
router.post(
  "/register",
  authController.register
);

// Login
router.post(
  "/login",
  authController.login
);

// ==============================
// PROTECTED ROUTES
// ==============================

// Get current logged-in user
router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser
);

module.exports = router;