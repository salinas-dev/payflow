const pool = require("../config/db");

const refreshOverdueInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE invoices
       SET status = 'OVERDUE'
       WHERE company_id = $1
       AND payment_date < CURRENT_DATE
       AND status IN ('PENDING', 'IN_REVIEW', 'APPROVED')
       RETURNING *`,
      [req.user.company_id]
    );

    res.json({
      message: "Facturas vencidas actualizadas correctamente",
      updated: result.rowCount,
      invoices: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar facturas vencidas",
      error: error.message,
    });
  }
};

module.exports = {
  refreshOverdueInvoices,
};