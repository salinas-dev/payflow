const pool = require("../config/db");

const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "PAID", "CANCELLED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Estado inválido",
      });
    }

    const result = await pool.query(
      `UPDATE invoices
       SET status = $1
       WHERE id = $2
       AND company_id = $3
       RETURNING *`,
      [status, id, req.user.company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Factura no encontrada",
      });
    }

    return res.json({
      message: "Estado actualizado correctamente",
      invoice: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar estado",
      error: error.message,
    });
  }
};

module.exports = {
  updateInvoiceStatus,
};