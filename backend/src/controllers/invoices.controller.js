const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const getInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        i.id,
        i.supplier_id,
        s.name AS supplier_name,
        i.uuid,
        i.folio,
        i.subtotal,
        i.iva,
        i.total,
        i.issue_date,
        i.payment_date,
        i.status,
        i.pdf_url,
        i.xml_url,
        i.created_at
       FROM invoices i
       INNER JOIN suppliers s ON s.id = i.supplier_id
       WHERE i.company_id = $1
       ORDER BY i.id DESC`,
      [req.user.company_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener facturas",
      error: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        i.id,
        i.supplier_id,
        s.name AS supplier_name,
        i.uuid,
        i.folio,
        i.subtotal,
        i.iva,
        i.total,
        i.issue_date,
        i.payment_date,
        i.status,
        i.pdf_url,
        i.xml_url,
        i.created_at
       FROM invoices i
       INNER JOIN suppliers s ON s.id = i.supplier_id
       WHERE i.id = $1
       AND i.company_id = $2`,
      [req.params.id, req.user.company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener factura",
      error: error.message,
    });
  }
};

const createInvoice = async (req, res) => {
  try {
    const {
      supplier_id,
      uuid,
      folio,
      subtotal,
      iva,
      total,
      issue_date,
      payment_date,
      status,
      pdf_url,
      xml_url,
    } = req.body;

    if (!supplier_id) {
      return res.status(400).json({ message: "El proveedor es obligatorio" });
    }

    const supplierExists = await pool.query(
      `SELECT id 
       FROM suppliers 
       WHERE id = $1 
       AND company_id = $2 
       AND active = TRUE`,
      [supplier_id, req.user.company_id]
    );

    if (supplierExists.rows.length === 0) {
      return res.status(404).json({
        message: "El proveedor no existe o no pertenece a esta empresa",
      });
    }

    const result = await pool.query(
      `INSERT INTO invoices (
        company_id,
        supplier_id,
        uuid,
        folio,
        subtotal,
        iva,
        total,
        issue_date,
        payment_date,
        status,
        pdf_url,
        xml_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        req.user.company_id,
        supplier_id,
        uuid || null,
        folio || null,
        subtotal || 0,
        iva || 0,
        total || 0,
        issue_date || null,
        payment_date || null,
        status || "PENDING",
        pdf_url || null,
        xml_url || null,
      ]
    );

    res.status(201).json({
      message: "Factura creada correctamente",
      invoice: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear factura",
      error: error.message,
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const {
      supplier_id,
      uuid,
      folio,
      subtotal,
      iva,
      total,
      issue_date,
      payment_date,
      status,
      pdf_url,
      xml_url,
    } = req.body;

    const result = await pool.query(
      `UPDATE invoices
       SET supplier_id = COALESCE($1, supplier_id),
           uuid = COALESCE($2, uuid),
           folio = COALESCE($3, folio),
           subtotal = COALESCE($4, subtotal),
           iva = COALESCE($5, iva),
           total = COALESCE($6, total),
           issue_date = COALESCE($7, issue_date),
           payment_date = COALESCE($8, payment_date),
           status = COALESCE($9, status),
           pdf_url = COALESCE($10, pdf_url),
           xml_url = COALESCE($11, xml_url)
       WHERE id = $12
       AND company_id = $13
       RETURNING *`,
      [
        supplier_id,
        uuid,
        folio,
        subtotal,
        iva,
        total,
        issue_date,
        payment_date,
        status,
        pdf_url,
        xml_url,
        req.params.id,
        req.user.company_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.json({
      message: "Factura actualizada correctamente",
      invoice: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar factura",
      error: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceResult = await pool.query(
      `SELECT *
       FROM invoices
       WHERE id = $1
       AND company_id = $2`,
      [id, req.user.company_id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({
        message: "Factura no encontrada",
      });
    }

    const invoice = invoiceResult.rows[0];

    if (invoice.pdf_url) {
      const pdfPath = path.join(
        __dirname,
        "../../",
        invoice.pdf_url.replace(/^\//, "")
      );

      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    if (invoice.xml_url) {
      const xmlPath = path.join(
        __dirname,
        "../../",
        invoice.xml_url.replace(/^\//, "")
      );

      if (fs.existsSync(xmlPath)) {
        fs.unlinkSync(xmlPath);
      }
    }

    await pool.query(
      `DELETE FROM invoices
       WHERE id = $1
       AND company_id = $2`,
      [id, req.user.company_id]
    );

    res.json({
      message: "Factura eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar factura",
      error: error.message,
    });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};