const db = require("../config/db");

// Find employee by email
const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM employees WHERE email = ?",
    [email]
  );
  return rows;
};

// Create new employee
const createEmployee = async (name, email, password) => {
  const [result] = await db.query(
    "INSERT INTO employees (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result;
};

module.exports = {
  findByEmail,
  createEmployee,
};