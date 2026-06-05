const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/suppliers.controller");

router.use(authMiddleware);

router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;