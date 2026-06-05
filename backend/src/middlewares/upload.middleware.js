const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads/invoices");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "text/xml",
    "application/xml",
    "application/octet-stream",
  ];

  const allowedExtensions = [".pdf", ".xml"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    !allowedMimeTypes.includes(file.mimetype) &&
    !allowedExtensions.includes(ext)
  ) {
    return cb(new Error("Solo se permiten archivos PDF o XML"), false);
  }

  cb(null, true);
};

const uploadInvoiceFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadInvoiceFile,
};