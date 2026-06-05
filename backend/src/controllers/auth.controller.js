const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const registerCompany = async (req, res) => {
  const client = await pool.connect();

  try {
    const { company_name, rfc, name, email, password } = req.body;

    if (!company_name || !name || !email || !password) {
      return res.status(400).json({
        message: "Faltan datos obligatorios",
      });
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const companyResult = await client.query(
      `INSERT INTO companies (name, rfc)
       VALUES ($1, $2)
       RETURNING id, name, rfc, plan`,
      [company_name, rfc || null]
    );

    const company = companyResult.rows[0];

    const userResult = await client.query(
      `INSERT INTO users (company_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, company_id, name, email, role`,
      [company.id, name, email, hashedPassword, "ADMIN"]
    );

    const user = userResult.rows[0];

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Empresa registrada correctamente",
      company,
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    return res.status(500).json({
      message: "Error al registrar empresa",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT 
        u.id,
        u.company_id,
        u.name,
        u.email,
        u.password,
        u.role,
        c.name AS company_name,
        c.plan
       FROM users u
       INNER JOIN companies c ON c.id = u.company_id
       WHERE u.email = $1
       AND u.active = TRUE
       AND c.active = TRUE`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        company_id: user.company_id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    delete user.password;

    return res.json({
      message: "Login correcto",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

const profile = async (req, res) => {
  return res.json({
    user: req.user,
  });
};

module.exports = {
  registerCompany,
  login,
  profile,
};