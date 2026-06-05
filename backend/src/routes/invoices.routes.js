const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const { uploadInvoiceFileController,} = require("../controllers/invoice-upload.controller");
const { uploadInvoiceFile } = require("../middlewares/upload.middleware");
const { importInvoiceXmlController,} = require("../controllers/invoice-import-xml.controller");

const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoices.controller");

router.use(authMiddleware);

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);
router.post("/:id/upload", uploadInvoiceFile.single("file"), uploadInvoiceFileController);
router.post("/import-xml",  uploadInvoiceFile.single("file"), importInvoiceXmlController);

module.exports = router;