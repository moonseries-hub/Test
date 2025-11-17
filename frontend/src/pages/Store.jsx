import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_CATEGORIES = "http://localhost:5000/api/categories";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: "", make: "", model: "", status: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([axios.get(API_PRODUCTS), axios.get(API_CATEGORIES)]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await axios.delete(`${API_PRODUCTS}/${id}`);
    fetchData();
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters({ category: "", make: "", model: "", status: "" });

  const getStatus = p => {
    const stock = p.availableStock || 0;
    if (stock <= 0) return { label: "Out of Stock", color: "bg-red-200 text-red-800" };
    if (stock <= (p.minstock || 0)) return { label: "Low Stock", color: "bg-yellow-200 text-yellow-800" };
    return { label: "Available", color: "bg-green-200 text-green-800" };
  };

  const filteredProducts = products.filter(p => {
    if (filters.status) {
      const stock = p.availableStock || 0;
      if (filters.status === "available" && stock <= (p.minstock || 0)) return false;
      if (filters.status === "low" && (stock <= 0 || stock > (p.minstock || 0))) return false;
      if (filters.status === "out" && stock > 0) return false;
    }
    if (filters.category && p.category?._id !== filters.category) return false;
    if (filters.make && p.make !== filters.make) return false;
    if (filters.model && p.model !== filters.model) return false;
    return true;
  });

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Inventory Dashboard</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-center">
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select name="make" value={filters.make} onChange={handleFilterChange}>
          <option value="">All Makes</option>
          {Array.from(new Set(categories.flatMap(c => c.makes || []))).map(m => <option key={m}>{m}</option>)}
        </select>
        <select name="model" value={filters.model} onChange={handleFilterChange}>
          <option value="">All Models</option>
          {Array.from(new Set(categories.flatMap(c => c.models || []))).map(m => <option key={m}>{m}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button onClick={resetFilters} className="bg-gray-300 px-3 py-1 rounded">Reset</button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto max-h-[80vh]">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-2 py-1">Product</th>
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
            {filteredProducts.map(p => {
              const status = getStatus(p);
              return (
                <tr key={p._id} className="text-center">
                  <td className="border px-2 py-1">{p.productName}</td>
                  <td className="border px-2 py-1">{p.category?.name || "-"}</td>
                  <td className="border px-2 py-1">{p.make}</td>
                  <td className="border px-2 py-1">{p.model || "-"}</td>
                  <td className={`border px-2 py-1 font-bold ${status.color}`}>{p.availableStock}</td>
                  <td className="border px-2 py-1">{p.minstock || 0}</td>
                  <td className="border px-2 py-1">{p.consumed || 0}</td>
                  <td className={`border px-2 py-1 font-bold ${status.color}`}>{status.label}</td>
                  <td className="border px-2 py-1">
                    <button onClick={() => handleDelete(p._id, p.productName)} className="bg-red-500 px-2 py-1 text-white rounded flex items-center gap-1 mx-auto">
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
