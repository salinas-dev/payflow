const pool = require("../config/db");

const getSummary = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const result = await pool.query(
      `
      SELECT
        COUNT(*) AS total_invoices,

        COUNT(*) FILTER (
          WHERE status = 'PENDING'
        ) AS pending_invoices,

        COUNT(*) FILTER (
          WHERE status = 'PAID'
        ) AS paid_invoices,

        COUNT(*) FILTER (
          WHERE payment_date < CURRENT_DATE
          AND status <> 'PAID'
        ) AS overdue_invoices,

        COALESCE(SUM(total),0) AS total_amount,

        COALESCE(
          SUM(
            CASE
              WHEN status='PENDING'
              THEN total
              ELSE 0
            END
          ),0
        ) AS pending_amount

      FROM invoices
      WHERE company_id = $1
      `,
      [companyId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener dashboard",
      error: error.message,
    });
  }
};

const getMonthly = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const result = await pool.query(
      `
      SELECT
        TO_CHAR(issue_date,'YYYY-MM') AS month,
        SUM(total) AS amount
      FROM invoices
      WHERE company_id = $1
      GROUP BY month
      ORDER BY month
      `,
      [companyId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getMonthly,
};