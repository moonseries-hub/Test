import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage1";
import Dashboard from "./pages/Dashboard";
import DashboardStaff from "./pages/DashboardStaff";
import AddProduct from "./pages/Add_product";
import Store from "./pages/Store";
import ConsumeProduct from "./pages/Consume_product";
import ReportPage from "./pages/ReportsPage";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />

        {/* Layout wraps all pages */}
        <Route element={<Layout />}>
          {/* Dashboard: role-specific */}
          <Route
            index
            element={role === "admin" ? <Dashboard /> : <DashboardStaff />}
          />

          {/* Common pages for both roles */}
          <Route path="add_product" element={<AddProduct />} />
          <Route path="consume_product" element={<ConsumeProduct />} />
          <Route path="reportpage" element={<ReportPage />} />
          <Route path="categorypage" element={<CategoryPage />} />
          <Route path="store" element={<Store />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
