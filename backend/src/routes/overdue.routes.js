const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  refreshOverdueInvoices,
} = require("../controllers/overdue.controller");

router.patch("/refresh-overdue", authMiddleware, refreshOverdueInvoices);

module.exports = router;