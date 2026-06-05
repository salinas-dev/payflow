const fs = require("fs");
const xml2js = require("xml2js");
const pool = require("../config/db");

const importInvoiceXmlController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo XML obligatorio" });
    }

    const xmlContent = fs.readFileSync(req.file.path, "utf8");
    const parsed = await xml2js.parseStringPromise(xmlContent);

    const comprobante = parsed["cfdi:Comprobante"];
    const data = comprobante.$;

    const emisor = comprobante["cfdi:Emisor"]?.[0]?.$;
    const complemento = comprobante["cfdi:Complemento"]?.[0];
    const timbre = complemento?.["tfd:TimbreFiscalDigital"]?.[0]?.$;

    if (!emisor) {
      return res.status(400).json({ message: "XML inválido: no contiene Emisor" });
    }

    const companyId = req.user.company_id;

    const supplierName = emisor.Nombre;
    const supplierRfc = emisor.Rfc;

    const serie = data.Serie || "";
    const folioXml = data.Folio || "";
    const folio = serie ? `${serie}-${folioXml}` : folioXml;

    const subtotal = Number(data.SubTotal || 0);
    const total = Number(data.Total || 0);
    const iva = Number(
      comprobante["cfdi:Impuestos"]?.[0]?.$?.TotalImpuestosTrasladados || 0
    );

    const issueDate = data.Fecha ? data.Fecha.substring(0, 10) : null;
    const uuid = timbre?.UUID || null;

    const xmlUrl = `/uploads/invoices/${req.file.filename}`;

    let supplierResult = await pool.query(
      `SELECT id
       FROM suppliers
       WHERE company_id = $1
       AND rfc = $2
       LIMIT 1`,
      [companyId, supplierRfc]
    );

    let supplierId;

    if (supplierResult.rows.length > 0) {
      supplierId = supplierResult.rows[0].id;
    } else {
      const newSupplier = await pool.query(
        `INSERT INTO suppliers (company_id, name, rfc, active)
         VALUES ($1, $2, $3, TRUE)
         RETURNING id`,
        [companyId, supplierName, supplierRfc]
      );

      supplierId = newSupplier.rows[0].id;
    }

    const invoiceResult = await pool.query(
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
        xml_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'PENDING',$10)
      RETURNING *`,
      [
        companyId,
        supplierId,
        uuid,
        folio,
        subtotal,
        iva,
        total,
        issueDate,
        issueDate,
        xmlUrl,
      ]
    );

    res.status(201).json({
      message: "Factura importada correctamente desde XML",
      invoice: invoiceResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al importar XML",
      error: error.message,
    });
  }
};

module.exports = {
  importInvoiceXmlController,
};