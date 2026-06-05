import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [folio, setFolio] = useState("");
  const [status, setStatus] = useState("");
  const [supplierId, setSupplierId] = useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const params = {};

      if (folio) params.folio = folio;
      if (status) params.status = status;
      if (supplierId) params.supplier_id = supplierId;

      const response = await api.get("/invoices-list", { params });
      setInvoices(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFolio("");
    setStatus("");
    setSupplierId("");
    setTimeout(loadInvoices, 0);
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

        <input
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          placeholder="ID proveedor"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <div className="flex gap-3">
          <button
            onClick={loadInvoices}
            className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 font-semibold"
          >
            Buscar
          </button>

          <button
            onClick={clearFilters}
            className="flex-1 bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-3 font-semibold"
          >
            Limpiar
          </button>
        </div>
      </div>

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
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-800">
                  <td className="p-4">{invoice.folio}</td>
                  <td className="p-4">{invoice.supplier_name}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-yellow-500/10 text-yellow-300 px-3 py-1 text-sm">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">${invoice.total}</td>
                  <td className="p-4">
                    {invoice.payment_date
                      ? new Date(invoice.payment_date).toLocaleDateString()
                      : "-"}
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