import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage1";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/Add_product";
import Store from "./pages/Store";
import ConsumeProduct from "./pages/Consume_product";
import ReportPage from "./pages/ReportsPage";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/Loginpage" element={<LoginPage />} />
        {token && role === "admin" && (
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/consume_product" element={<ConsumeProduct />}/>
            <Route path = "/reportpage" element = {<ReportPage/>}/>

            <Route path="/store" element={<Store />} />
            {/* Add other admin-only routes here */}
          </Route>
        )}

        {token && role === "staff" && (
          <Route element={<Layout />}>
            <Route path="/dashboard-staff" element={<h1>Staff Dashboard</h1>} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/LoginPage" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
