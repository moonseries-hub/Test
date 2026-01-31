
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
import PurchaseOrder from "./pages/PurchaseOrders";

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
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated layout */}
          <Route element={<Layout />}>
            {/* Default home */}
            <Route index element={isAdmin ? <Dashboard /> : <DashboardStaff />} />

            {/* Common routes */}
            <Route path="store" element={<Store />} />
            <Route path="consume-product" element={<ConsumeProduct />} />
            <Route path="consume-product/:id" element={<ConsumeProduct />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="purchase-order" element={<PurchaseOrder />} />
            <Route path="add-product" element={<AddProduct />} />

            {/* Admin-only routes */}
           
            {isAdmin && <Route path="category" element={<CategoryPage />} />}
            {isAdmin && <Route path="add-staff" element={<AddStaff />} />}

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to={isAdmin ? "/" : "/"} replace />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}