import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await api.get("/invoices-list");
      setInvoices(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando facturas...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Facturas</h1>

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
                  {new Date(invoice.payment_date).toLocaleDateString()}
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
    </div>
  );
}

export default Invoices;