const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working successfully!",
  });
});

// Database test route
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

const PORT = process.env.PORT || 5000;

// Important: 0.0.0.0 means backend can accept
// requests from other devices on the same network
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