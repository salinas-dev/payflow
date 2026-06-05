import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Invoices from "../pages/Invoices";
import Suppliers from "../pages/Suppliers";
import AppLayout from "../layouts/AppLayout";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("payflow_token");
  return token ? children : <Navigate to="/login" replace />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/suppliers" element={<Suppliers />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;