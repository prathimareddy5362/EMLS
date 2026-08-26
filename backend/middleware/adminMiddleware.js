const adminMiddleware = (
  req,
  res,
  next
) => {
  try {
    // User data comes from JWT
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Only admin can continue
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Admin only.",
      });
    }

    next();

  } catch (error) {
    console.error(
      "Authorization error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Authorization failed",
    });
  }
};

module.exports = adminMiddleware;