import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage1";
import Dashboard from "./pages/Dashboard";
import DashboardStaff from "./pages/DashboardStaff";
import AddProduct from "./pages/Add_product";
import Store from "./pages/Store";
import ConsumeProduct from "./pages/ConsumeProduct";
import ReportPage from "./pages/ReportsPage";
import CategoryPage from "./pages/CategoryPage";
import Orders from "./pages/Orders";
import LogoutPage from "./pages/LogoutPage";

export default function App() {
  const { user } = useUser();

  return (
    <Router>
      {!user?.token ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<Layout />}>
            {/* Default dashboard depending on role */}
            <Route
              index
              element={user.role === "admin" ? <Dashboard /> : <DashboardStaff />}
            />

            {/* Pages */}
            <Route path="add_product" element={<AddProduct />} />
            <Route path="store" element={<Store />} />
            <Route path="consume_product" element={<ConsumeProduct />} />
            <Route path="consume_product/:id" element={<ConsumeProduct />} />
            <Route path="reportpage" element={<ReportPage />} />
            <Route path="categorypage" element={<CategoryPage />} />
            <Route path="orders" element={<Orders />} />
            <Route path="logoutpage" element={<LogoutPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}
