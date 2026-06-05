const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

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
router.delete("/:id", deleteInvoice);

module.exports = router;