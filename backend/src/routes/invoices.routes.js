const express = require("express");
const router = express.Router();
const { uploadInvoiceFile: upload } = require("../middlewares/upload.middleware");

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  uploadInvoiceFile,
} = require("../controllers/invoices.controller");

router.use(authMiddleware);

router.get("/", getInvoices);
router.post("/:id/upload", upload.single("file"), uploadInvoiceFile);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

module.exports = router;