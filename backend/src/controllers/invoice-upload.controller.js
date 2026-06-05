const pool = require("../config/db");

const uploadInvoiceFileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Archivo obligatorio",
      });
    }

    if (!["PDF", "XML"].includes(type)) {
      return res.status(400).json({
        message: "Tipo inválido. Usa PDF o XML",
      });
    }

    const fileUrl = `/uploads/invoices/${req.file.filename}`;

    const column = type === "PDF" ? "pdf_url" : "xml_url";

    const result = await pool.query(
      `UPDATE invoices
       SET ${column} = $1
       WHERE id = $2
       AND company_id = $3
       RETURNING *`,
      [fileUrl, id, req.user.company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Factura no encontrada",
      });
    }

    res.json({
      message: `Archivo ${type} subido correctamente`,
      invoice: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al subir archivo",
      error: error.message,
    });
  }
};

module.exports = {
  uploadInvoiceFileController,
};