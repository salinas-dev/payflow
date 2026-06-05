import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [folio, setFolio] = useState("");
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    supplier_id: "",
    folio: "",
    subtotal: "",
    iva: 0,
    total: 0,
    issue_date: "",
    payment_date: "",
  });

  useEffect(() => {
    loadInvoices();
    loadSuppliers();
  }, []);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  };

  const getStatusClass = (invoiceStatus) => {
    const classes = {
      PENDING: "bg-yellow-500/10 text-yellow-300",
      PAID: "bg-green-500/10 text-green-300",
      OVERDUE: "bg-red-500/10 text-red-300",
      CANCELLED: "bg-slate-500/10 text-slate-300",
    };

    return classes[invoiceStatus] || "bg-slate-500/10 text-slate-300";
  };

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const params = {};

      if (folio) params.folio = folio;
      if (status) params.status = status;

      const response = await api.get("/invoices-list", { params });
      setInvoices(response.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data || []);
    } catch (error) {
      console.error(error);
      alert("Error al cargar proveedores");
    }
  };

  const clearFilters = () => {
    setFolio("");
    setStatus("");

    setTimeout(() => {
      loadInvoices();
    }, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newForm = {
      ...form,
      [name]: value,
    };

    if (name === "subtotal") {
      const subtotal = Number(value || 0);
      const iva = subtotal * 0.16;
      const total = subtotal + iva;

      newForm.iva = iva.toFixed(2);
      newForm.total = total.toFixed(2);
    }

    setForm(newForm);
  };

  const createInvoice = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.post("/invoices", {
        supplier_id: Number(form.supplier_id),
        folio: form.folio,
        subtotal: Number(form.subtotal),
        iva: Number(form.iva),
        total: Number(form.total),
        issue_date: form.issue_date,
        payment_date: form.payment_date,
      });

      setForm({
        supplier_id: "",
        folio: "",
        subtotal: "",
        iva: 0,
        total: 0,
        issue_date: "",
        payment_date: "",
      });

      await loadInvoices();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al crear factura");
    } finally {
      setSaving(false);
    }
  };

  const payInvoice = async (id) => {
    try {
      await api.patch(`/invoices/${id}/status`, {
        status: "PAID",
      });

      await loadInvoices();
    } catch (error) {
      console.error(error);
      alert("Error al marcar factura como pagada");
    }
  };

  const deleteInvoice = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta factura?");

    if (!confirmed) return;

    try {
      await api.delete(`/invoices/${id}`);
      await loadInvoices();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar factura");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Facturas</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          value={folio}
          onChange={(e) => setFolio(e.target.value)}
          placeholder="Buscar folio"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagada</option>
          <option value="OVERDUE">Vencida</option>
          <option value="CANCELLED">Cancelada</option>
        </select>

        <button
          onClick={loadInvoices}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 font-semibold"
        >
          Buscar
        </button>

        <button
          onClick={clearFilters}
          className="bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-3 font-semibold"
        >
          Limpiar
        </button>
      </div>

      <form
        onSubmit={createInvoice}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="supplier_id"
            value={form.supplier_id}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            required
          >
            <option value="">Proveedor</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="folio"
            value={form.folio}
            onChange={handleChange}
            placeholder="FAC-2026-004"
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            required
          />

          <input
            type="number"
            name="subtotal"
            value={form.subtotal}
            onChange={handleChange}
            placeholder="Subtotal"
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            required
          />

          <input
            type="date"
            name="issue_date"
            value={form.issue_date}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            required
          />

          <input
            type="date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3"
            required
          />

          <button
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 rounded-lg px-4 py-3 font-semibold"
          >
            {saving ? "Guardando..." : "Crear Factura"}
          </button>
        </div>

        <div className="flex gap-8 mt-4 text-lg">
          <span>IVA: {formatMoney(form.iva)}</span>
          <span>Total: {formatMoney(form.total)}</span>
        </div>
      </form>

      {loading ? (
        <p>Cargando facturas...</p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-4">Folio</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Total</th>
                <th className="p-4">Pago</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-800">
                  <td className="p-4">{invoice.folio}</td>
                  <td className="p-4">{invoice.supplier_name}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${getStatusClass(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">{formatMoney(invoice.total)}</td>
                  <td className="p-4">
                    {invoice.payment_date
                      ? new Date(invoice.payment_date).toLocaleDateString("es-MX")
                      : "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {invoice.status !== "PAID" && (
                        <button
                          onClick={() => payInvoice(invoice.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                        >
                          Pagar
                        </button>
                      )}

                      <button
                        onClick={() => deleteInvoice(invoice.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {invoices.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No hay facturas registradas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Invoices;