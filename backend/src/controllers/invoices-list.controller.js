const pool = require("../config/db");

const getInvoicesList = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    const { status, supplier_id, folio, date_from, date_to } = req.query;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const offset = (page - 1) * limit;

    const filters = ["i.company_id = $1"];
    const values = [companyId];

    if (status) {
      values.push(status);
      filters.push(`i.status = $${values.length}`);
    }

    if (supplier_id) {
      values.push(supplier_id);
      filters.push(`i.supplier_id = $${values.length}`);
    }

    if (folio) {
      values.push(`%${folio}%`);
      filters.push(`i.folio ILIKE $${values.length}`);
    }

    if (date_from) {
      values.push(date_from);
      filters.push(`i.issue_date >= $${values.length}`);
    }

    if (date_to) {
      values.push(date_to);
      filters.push(`i.issue_date <= $${values.length}`);
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
      filters: {
        status: status || null,
        supplier_id: supplier_id || null,
        folio: folio || null,
        date_from: date_from || null,
        date_to: date_to || null,
      },
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