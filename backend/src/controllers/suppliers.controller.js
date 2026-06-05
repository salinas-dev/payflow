const pool = require("../config/db");

const getSuppliers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, rfc, email, phone, active, created_at
       FROM suppliers
       WHERE company_id = $1
       ORDER BY id DESC`,
      [req.user.company_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, rfc, email, phone, active, created_at
       FROM suppliers
       WHERE id = $1 AND company_id = $2`,
      [req.params.id, req.user.company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedor", error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, rfc, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre del proveedor es obligatorio" });
    }

    const result = await pool.query(
      `INSERT INTO suppliers (company_id, name, rfc, email, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, company_id, name, rfc, email, phone, active, created_at`,
      [req.user.company_id, name, rfc || null, email || null, phone || null]
    );

    res.status(201).json({
      message: "Proveedor creado correctamente",
      supplier: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear proveedor", error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { name, rfc, email, phone, active } = req.body;

    const result = await pool.query(
      `UPDATE suppliers
       SET name = COALESCE($1, name),
           rfc = COALESCE($2, rfc),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           active = COALESCE($5, active)
       WHERE id = $6 AND company_id = $7
       RETURNING id, company_id, name, rfc, email, phone, active, created_at`,
      [name, rfc, email, phone, active, req.params.id, req.user.company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json({
      message: "Proveedor actualizado correctamente",
      supplier: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proveedor", error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE suppliers
       SET active = FALSE
       WHERE id = $1 AND company_id = $2
       RETURNING id, name, active`,
      [req.params.id, req.user.company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json({
      message: "Proveedor desactivado correctamente",
      supplier: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar proveedor", error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};