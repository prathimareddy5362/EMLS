const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employeeModel");

// Register Employee
const register = async (req, res) => {
  try {
    const { full_name, employee_id, department, email, password } = req.body;

    const existingEmployee =
      await employeeModel.findEmployeeByEmail(email);

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await employeeModel.createEmployee(
      full_name,
      employee_id,
      department,
      email,
      hashedPassword
    );

    res.status(201).json({
      message: "Employee registered successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};
// Login Employee
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await employeeModel.findByEmail(email);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};