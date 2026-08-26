const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

dotenv.config();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);

app.use("/api/leaves", leaveRoutes);

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working successfully!",
  });
});

// ==============================
// DATABASE TEST ROUTE
// ==============================

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT 1 + 1 AS result"
    );

    res.json({
      success: true,
      result: rows[0].result,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database test error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==============================
// SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const connection = await db.getConnection();

    console.log("MySQL Connected Successfully");

    connection.release();
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err.message);
  }
});