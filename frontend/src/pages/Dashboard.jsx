import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!summary) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Facturas Totales</p>
          <h2 className="text-4xl font-bold mt-2">
            {summary.total_invoices}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Pendientes</p>
          <h2 className="text-4xl font-bold mt-2 text-yellow-400">
            {summary.pending_invoices}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Pagadas</p>
          <h2 className="text-4xl font-bold mt-2 text-green-400">
            {summary.paid_invoices}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Vencidas</p>
          <h2 className="text-4xl font-bold mt-2 text-red-400">
            {summary.overdue_invoices}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Monto Total</p>
          <h2 className="text-4xl font-bold mt-2">
            ${summary.total_amount}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Monto Pendiente</p>
          <h2 className="text-4xl font-bold mt-2 text-yellow-400">
            ${summary.pending_amount}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;