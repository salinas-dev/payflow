const express = require("express");
const router = express.Router();

const {
  registerCompany,
  login,
  profile,
} = require("../controllers/auth.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", registerCompany);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

module.exports = router;