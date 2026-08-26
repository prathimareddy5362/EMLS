const bcrypt = require("bcryptjs");
const employeeModel = require("../models/employeeModel");

const register = async (req, res) => {
  try {
    const {
      name,
      employeeId,
      department,
      email,
      password,
    } = req.body;

    // Basic validation
    if (!name || !employeeId || !department || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmployee =
      await employeeModel.findEmployeeByEmail(normalizedEmail);

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await employeeModel.createEmployee(
      name.trim(),
      employeeId.trim(),
      department.trim(),
      normalizedEmail,
      hashedPassword
    );

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      user: {
        id: newEmployee?.id,
        name: name.trim(),
        email: normalizedEmail,
        employeeId: employeeId.trim(),
        department: department.trim(),
        role: "employee",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const employee =
      await employeeModel.findEmployeeByEmail(normalizedEmail);

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",

      // Frontend expects data.user
      user: {
        id: employee.id,
        name: employee.full_name,
        email: employee.email,
        employeeId: employee.employee_id,
        department: employee.department,
        role: employee.role || "employee",

        // Default leave balance
        leaveBalance: {
          sick: employee.sick_leave ?? 10,
          casual: employee.casual_leave ?? 10,
          annual: employee.annual_leave ?? 15,
          other: employee.other_leave ?? 10,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};


module.exports = {
  register,
  login,
};