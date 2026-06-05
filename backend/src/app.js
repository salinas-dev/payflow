const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "PayFlow SaaS API funcionando",
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const suppliersRoutes = require("./routes/suppliers.routes");

app.use("/api/suppliers", suppliersRoutes);

const invoiceStatusRoutes = require("./routes/invoice-status.routes");

app.use("/api/invoices", invoiceStatusRoutes);