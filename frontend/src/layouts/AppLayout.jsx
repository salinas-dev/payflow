import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Users, LogOut } from "lucide-react";

function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("payflow_user") || "{}");

  const logout = () => {
    localStorage.removeItem("payflow_token");
    localStorage.removeItem("payflow_user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-blue-400">PayFlow</h1>
          <p className="text-sm text-slate-400">{user.company_name}</p>
        </div>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/invoices" className={linkClass}>
            <FileText size={20} />
            Facturas
          </NavLink>

          <NavLink to="/suppliers" className={linkClass}>
            <Users size={20} />
            Proveedores
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          Salir
        </button>
      </aside>

      <section className="flex-1">
        <header className="h-20 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Usuario</p>
            <h2 className="font-semibold">{user.name} · {user.role}</h2>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default AppLayout;