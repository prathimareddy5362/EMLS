const db = require("../config/db");

const findEmployeeByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM employees WHERE email = ?",
    [email]
  );

  return rows[0];
};

const createEmployee = async (
  full_name,
  employee_id,
  department,
  email,
  password
) => {
  const [result] = await db.query(
    `INSERT INTO employees
    (full_name, employee_id, department, email, password)
    VALUES (?, ?, ?, ?, ?)`,
    [full_name, employee_id, department, email, password]
  );

  return result;
};

module.exports = {
  findEmployeeByEmail,
  createEmployee,
};