import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage1";
import Dashboard from "./pages/Dashboard";
import DashboardStaff from "./pages/DashboardStaff";
import AddProduct from "./pages/Add_product";
import Store from "./pages/Store";
import ConsumeProduct from "./pages/Consume_product";
import ReportPage from "./pages/ReportsPage";
import CategoryPage from "./pages/CategoryPage";
import LogoutPage from "./pages/LogoutPage";

export default function App() {
  const { user } = useUser();

  if (!user?.token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  const role = user.role;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route
            index
            element={role === "admin" ? <Dashboard /> : <DashboardStaff />}
          />

          <Route path="add_product" element={<AddProduct />} />
          <Route path="consume_product" element={<ConsumeProduct />} />
          <Route path="reportpage" element={<ReportPage />} />
          <Route path="categorypage" element={<CategoryPage />} />
          <Route path="store" element={<Store />} />
          <Route path="LogoutPage" element={<LogoutPage />} />
          
          {/* Redirect unknown routes to home */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
