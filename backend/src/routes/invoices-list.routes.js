const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getInvoicesList,
} = require("../controllers/invoices-list.controller");

router.get("/", authMiddleware, getInvoicesList);

module.exports = router;