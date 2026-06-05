import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

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

      const activeSuppliers = (response.data || []).filter(
        (supplier) => supplier.active,
      );

      setSuppliers(activeSuppliers);
    } catch (error) {
      console.error(error);
      alert("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      rfc: "",
      email: "",
      phone: "",
    });
    setEditingId(null);
    setError("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveSupplier = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, form);
      } else {
        await api.post("/suppliers", form);
      }

      resetForm();
      await loadSuppliers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          (editingId
            ? "Error al actualizar proveedor"
            : "Error al crear proveedor"),
      );
    } finally {
      setSaving(false);
    }
  };

  const editSupplier = (supplier) => {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name || "",
      rfc: supplier.rfc || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
    });
    setError("");
  };

  const deleteSupplier = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este proveedor?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/suppliers/${id}`);
      await loadSuppliers();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al eliminar proveedor");
    }
  };

  if (loading) return <p>Cargando proveedores...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

      <form
        onSubmit={saveSupplier}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-6 gap-4"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          required
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
          className={`rounded-lg px-4 py-3 font-semibold disabled:opacity-60 ${
            editingId
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-3 font-semibold"
          >
            Cancelar
          </button>
        )}

        {error && (
          <div className="md:col-span-6 text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
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
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-t border-slate-800">
                <td className="p-4">{supplier.name}</td>
                <td className="p-4">{supplier.rfc || "-"}</td>
                <td className="p-4">{supplier.email || "-"}</td>
                <td className="p-4">{supplier.phone || "-"}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      supplier.active
                        ? "bg-green-500/10 text-green-300"
                        : "bg-slate-500/10 text-slate-300"
                    }`}
                  >
                    {supplier.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editSupplier(supplier)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => deleteSupplier(supplier.id)}
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
