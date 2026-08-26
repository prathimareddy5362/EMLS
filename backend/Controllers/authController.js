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

    const existingEmployee =
      await employeeModel.findEmployeeByEmail(email);

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await employeeModel.createEmployee(
      name,
      employeeId,
      department,
      email,
      hashedPassword
    );

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
};