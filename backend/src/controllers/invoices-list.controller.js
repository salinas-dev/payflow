const pool = require("../config/db");

const getInvoicesList = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const status = req.query.status || null;
    const supplierId = req.query.supplier_id || null;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const offset = (page - 1) * limit;

    const filters = ["i.company_id = $1"];
    const values = [companyId];

    if (status) {
      values.push(status);
      filters.push(`i.status = $${values.length}`);
    }

    if (supplierId) {
      values.push(supplierId);
      filters.push(`i.supplier_id = $${values.length}`);
    }

    const whereClause = filters.join(" AND ");

    const countResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM invoices i
       WHERE ${whereClause}`,
      values
    );

    const total = Number(countResult.rows[0].total);
    const pages = Math.ceil(total / limit);

    values.push(limit);
    const limitIndex = values.length;

    values.push(offset);
    const offsetIndex = values.length;

    const result = await pool.query(
      `SELECT
          i.id,
          i.folio,
          i.uuid,
          i.status,
          i.subtotal,
          i.iva,
          i.total,
          i.issue_date,
          i.payment_date,
          i.pdf_url,
          i.xml_url,
          s.id AS supplier_id,
          s.name AS supplier_name
       FROM invoices i
       INNER JOIN suppliers s ON s.id = i.supplier_id
       WHERE ${whereClause}
       ORDER BY i.id DESC
       LIMIT $${limitIndex}
       OFFSET $${offsetIndex}`,
      values
    );

    res.json({
      page,
      limit,
      total,
      pages,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar facturas",
      error: error.message,
    });
  }
};

module.exports = {
  getInvoicesList,
};