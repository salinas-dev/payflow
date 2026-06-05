import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    rfc: "",
    email: "",
    phone: "",
  });

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createSupplier = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.post("/suppliers", form);

      setForm({
        name: "",
        rfc: "",
        email: "",
        phone: "",
      });

      await loadSuppliers();
    } catch (error) {
      setError(error.response?.data?.message || "Error al crear proveedor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando proveedores...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

      <form
        onSubmit={createSupplier}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          name="rfc"
          value={form.rfc}
          onChange={handleChange}
          placeholder="RFC"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg px-4 py-3 font-semibold"
        >
          {saving ? "Guardando..." : "Crear"}
        </button>

        {error && (
          <div className="md:col-span-5 text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}
      </form>

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