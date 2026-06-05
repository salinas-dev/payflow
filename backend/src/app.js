const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const suppliersRoutes = require("./routes/suppliers.routes");
const invoicesRoutes = require("./routes/invoices.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const invoiceStatusRoutes = require("./routes/invoice-status.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "PayFlow SaaS API funcionando",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/invoices", invoiceStatusRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});