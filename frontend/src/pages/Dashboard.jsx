function Dashboard() {
  const user = JSON.parse(localStorage.getItem("payflow_user") || "{}");

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-slate-400 mt-2">
        Bienvenido, {user.name}
      </p>
    </div>
  );
}

export default Dashboard;