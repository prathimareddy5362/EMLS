const db = require("../config/db");

const findEmployeeByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM employees
    WHERE LOWER(email) = LOWER(?)
    LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
};

const findEmployeeById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM employees
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};

const createEmployee = async (
  full_name,
  employee_id,
  department,
  email,
  password
) => {
  const [result] = await db.query(
    `
    INSERT INTO employees
    (
      full_name,
      employee_id,
      department,
      email,
      password
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      full_name,
      employee_id,
      department,
      email.toLowerCase(),
      password
    ]
  );

  // Insert ayina employee ni database nundi malli fetch chestham
  const employee = await findEmployeeById(result.insertId);

  return employee;
};

module.exports = {
  findEmployeeByEmail,
  findEmployeeById,
  createEmployee,
};