import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/suppliers");
      setSuppliers(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando proveedores...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">RFC</th>
              <th className="p-4">Email</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-t border-slate-800">
                <td className="p-4">{supplier.name}</td>
                <td className="p-4">{supplier.rfc}</td>
                <td className="p-4">{supplier.email}</td>
                <td className="p-4">{supplier.phone || "-"}</td>
                <td className="p-4">
                  <span className="rounded-full bg-green-500/10 text-green-300 px-3 py-1 text-sm">
                    {supplier.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No hay proveedores registrados.
          </div>
        )}
      </div>
    </div>
  );
}

export default Suppliers;