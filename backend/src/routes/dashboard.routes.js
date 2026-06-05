const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getSummary,
  getMonthly,
} = require("../controllers/dashboard.controller");

router.get("/summary", authMiddleware, getSummary);
router.get("/monthly", authMiddleware, getMonthly);

module.exports = router;