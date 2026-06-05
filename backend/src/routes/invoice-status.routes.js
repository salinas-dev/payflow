const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  updateInvoiceStatus,
} = require("../controllers/invoice-status.controller");

router.patch("/:id/status", authMiddleware, updateInvoiceStatus);

module.exports = router;