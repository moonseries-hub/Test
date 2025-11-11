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
import AddStaff from "./pages/Add_Staff";
import Profile from "./pages/Profile";
export default function App() {
  const { user } = useUser();

  const isLoggedIn = !!user?.token;
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Routes>
          {/* Login should still be accessible for refresh safety */}
          <Route path="/login" element={<LoginPage />} />

          {/* Layout applied to all authenticated routes */}
          <Route element={<Layout />}>
            {/* Default home route based on role */}
            <Route
              index
              element={isAdmin ? <Dashboard /> : <DashboardStaff />}
            />

            {/* Routes for all users */}
            <Route path="store" element={<Store />} />
            <Route path="consume_product" element={<ConsumeProduct />} />
            <Route path="consume_product/:id" element={<ConsumeProduct />} />
            <Route path="reportpage" element={<ReportPage />} />
            <Route path="orders" element={<Orders />} />
            <Route path="logoutpage" element={<LogoutPage />} />
            <Route path="add_staff" element={<AddStaff />} />
            <Route path="/profile" element={<Profile />} />


            {/* Fallback to role-based dashboard */}
            <Route
              path="*"
              element={<Navigate to={isAdmin ? "/" : "/"} replace />}
            />
          </Route>
        </Routes>
      )}
    </Router>
  );
}
