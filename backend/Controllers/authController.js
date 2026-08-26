const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeModel = require("../models/employeeModel");

// ==============================
// REGISTER
// ==============================

const register = async (req, res) => {
  try {
    const {
      name,
      employeeId,
      department,
      email,
      password,
    } = req.body;

    // Validation
    if (
      !name ||
      !employeeId ||
      !department ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingEmployee =
      await employeeModel.findEmployeeByEmail(
        normalizedEmail
      );

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result =
      await employeeModel.createEmployee(
        name.trim(),
        employeeId.trim(),
        department.trim(),
        normalizedEmail,
        hashedPassword
      );

    return res.status(201).json({
      success: true,
      message:
        "Employee registered successfully",
      user: {
        id: result.id,
        name: name.trim(),
        email: normalizedEmail,
        employeeId: employeeId.trim(),
        department: department.trim(),
        role: "employee",
      },
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


// ==============================
// LOGIN
// ==============================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const employee =
      await employeeModel.findEmployeeByEmail(
        normalizedEmail
      );

    if (!employee) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        employee.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        role:
          employee.role || "employee",
      },
      process.env.JWT_SECRET ||
        "elms_super_secret_key",
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: employee.id,
        name: employee.full_name,
        email: employee.email,
        employeeId:
          employee.employee_id,
        department:
          employee.department,
        role:
          employee.role || "employee",

        leaveBalance: {
          sick:
            employee.sick_leave ?? 10,
          casual:
            employee.casual_leave ?? 10,
          annual:
            employee.annual_leave ?? 15,
          other:
            employee.other_leave ?? 10,
        },
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};


// ==============================
// GET CURRENT USER
// ==============================

const getCurrentUser = async (
  req,
  res
) => {
  try {
    const employee =
      await employeeModel.findEmployeeById(
        req.user.id
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: employee.id,
        name: employee.full_name,
        email: employee.email,
        employeeId:
          employee.employee_id,
        department:
          employee.department,
        role:
          employee.role || "employee",

        leaveBalance: {
          sick:
            employee.sick_leave ?? 10,
          casual:
            employee.casual_leave ?? 10,
          annual:
            employee.annual_leave ?? 15,
          other:
            employee.other_leave ?? 10,
        },
      },
    });

  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get current user",
    });
  }
};


module.exports = {
  register,
  login,
  getCurrentUser,
};