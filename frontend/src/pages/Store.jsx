// src/pages/Store.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_CATEGORIES = "http://localhost:5000/api/categories";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    make: "",
    model: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(API_PRODUCTS),
        axios.get(API_CATEGORIES),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_PRODUCTS}/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
      alert("❌ Failed to delete product.");
    }
  };

  // Filtering logic with min stock
  const filteredProducts = products.filter((p) => {
    if (filters.status) {
      if (filters.status === "available" && p.instock <= (p.minstock || 0))
        return false;
      if (filters.status === "low" && (p.instock <= 0 || p.instock > (p.minstock || 0)))
        return false;
      if (filters.status === "out" && p.instock > 0) return false;
    }
    if (filters.category && p.category?._id !== filters.category) return false;
    if (filters.make && p.make !== filters.make) return false;
    if (filters.model && p.model !== filters.model) return false;
    return true;
  });

  const selectedCategory = categories.find((c) => c._id === filters.category);
  const makeOptions = selectedCategory?.makes || [];
  const modelOptions = selectedCategory?.models || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      let newFilters = { ...prev, [name]: value };
      if (name === "category") {
        newFilters.make = "";
        newFilters.model = "";
      }
      return newFilters;
    });
  };

  // Status color logic
  const getStatus = (p) => {
    if (p.instock <= 0) return { label: "Out of Stock", color: "bg-red-200 text-red-800" };
    if (p.instock <= (p.minstock || 0))
      return { label: "Low Stock", color: "bg-yellow-200 text-yellow-800" };
    return { label: "Available", color: "bg-green-200 text-green-800" };
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">NRSC/ISRO Inventory Dashboard</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label>Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Make</label>
          <select
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
            disabled={!filters.category}
          >
            <option value="">All</option>
            {makeOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Model</label>
          <select
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
            disabled={!filters.category}
          >
            <option value="">All</option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto max-h-[80vh]">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Make</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">In-Stock</th>
              <th className="border px-2 py-1">Min Stock</th>
              <th className="border px-2 py-1">Consumed</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const status = getStatus(p);
              return (
                <tr key={p._id} className="text-center">
                  <td className="border px-2 py-1">{p.productName}</td>
                  <td className="border px-2 py-1">{p.category?.name || "-"}</td>
                  <td className="border px-2 py-1">{p.make}</td>
                  <td className="border px-2 py-1">{p.model || "-"}</td>
                  <td
                    className={`border px-2 py-1 font-bold ${
                      p.instock <= 0
                        ? "bg-red-200"
                        : p.instock <= (p.minstock || 0)
                        ? "bg-yellow-200"
                        : "bg-green-200"
                    }`}
                  >
                    {p.instock}
                  </td>
                  <td className="border px-2 py-1">{p.minstock || 0}</td>
                  <td className="border px-2 py-1">{p.sold || 0}</td>
                  <td className={`border px-2 py-1 font-bold ${status.color}`}>
                    {status.label}
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleDelete(p._id, p.productName)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 mx-auto"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
