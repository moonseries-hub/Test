import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/Add_product";
import Store from "./pages/Store";
// ... import other pages

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/store" element={<Store />} />
          {/* add other pages here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
