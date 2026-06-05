
-- =========================
-- EMPRESAS
-- =========================

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    rfc VARCHAR(20),
    plan VARCHAR(50) DEFAULT 'BASIC',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USUARIOS
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),

    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password TEXT NOT NULL,

    role VARCHAR(50) DEFAULT 'ADMIN',

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PROVEEDORES
-- =========================

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),

    name VARCHAR(150) NOT NULL,
    rfc VARCHAR(20),

    email VARCHAR(150),
    phone VARCHAR(30),

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- FACTURAS
-- =========================

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL REFERENCES companies(id),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),

    uuid VARCHAR(100),
    folio VARCHAR(100),

    subtotal NUMERIC(12,2) DEFAULT 0,
    iva NUMERIC(12,2) DEFAULT 0,
    total NUMERIC(12,2) DEFAULT 0,

    issue_date DATE,
    payment_date DATE,

    status VARCHAR(50) DEFAULT 'PENDING',

    pdf_url TEXT,
    xml_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- FLUJO DE APROBACIÓN
-- =========================

CREATE TABLE approval_flow (
    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL REFERENCES companies(id),
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),

    status VARCHAR(50) DEFAULT 'PENDING',

    comments TEXT,

    approved_by INTEGER REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PAGOS
-- =========================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL REFERENCES companies(id),
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),

    amount NUMERIC(12,2) NOT NULL,

    payment_date DATE,

    payment_method VARCHAR(50),

    reference VARCHAR(150),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ÍNDICES
-- =========================

CREATE INDEX idx_users_company
ON users(company_id);

CREATE INDEX idx_suppliers_company
ON suppliers(company_id);

CREATE INDEX idx_invoices_company
ON invoices(company_id);

CREATE INDEX idx_invoices_supplier
ON invoices(supplier_id);

CREATE INDEX idx_approval_invoice
ON approval_flow(invoice_id);
