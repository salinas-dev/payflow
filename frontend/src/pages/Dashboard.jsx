function Dashboard() {
  const user = JSON.parse(localStorage.getItem("payflow_user") || "{}");

  const logout = () => {
    localStorage.removeItem("payflow_token");
    localStorage.removeItem("payflow_user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">PayFlow</h1>
          <p className="text-slate-400 text-sm">
            {user.company_name} · {user.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Salir
        </button>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-slate-400 mt-2">
          Bienvenido, {user.name}
        </p>
      </main>
    </div>
  );
}

export default Dashboard;