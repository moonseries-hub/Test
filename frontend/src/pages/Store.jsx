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

  const filteredProducts = products.filter(p => {
    if (filters.status) {
      if (filters.status === "available" && p.currentStock <= (p.minstock || 0)) return false;
      if (filters.status === "low" && (p.currentStock <= 0 || p.currentStock > (p.minstock || 0))) return false;
      if (filters.status === "out" && p.currentStock > 0) return false;
    }
    if (filters.category && p.category?._id !== filters.category) return false;
    if (filters.make && p.make !== filters.make) return false;
    if (filters.model && p.model !== filters.model) return false;
    return true;
  });

  const selectedCategory = categories.find(c => c._id === filters.category);
  const makeOptions = selectedCategory?.makes || [];
  const modelOptions = selectedCategory?.models || [];

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, ...(name === "category" ? { make: "", model: "" } : {}) }));
  };

  const getStatus = p => {
    if (p.currentStock <= 0) return { label: "Out of Stock", color: "bg-red-200 text-red-800" };
    if (p.currentStock <= (p.minstock || 0)) return { label: "Low Stock", color: "bg-yellow-200 text-yellow-800" };
    return { label: "Available", color: "bg-green-200 text-green-800" };
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Inventory Dashboard</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4">
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select name="make" value={filters.make} onChange={handleFilterChange} disabled={!filters.category}>
          <option value="">All Makes</option>
          {makeOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="model" value={filters.model} onChange={handleFilterChange} disabled={!filters.category}>
          <option value="">All Models</option>
          {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto max-h-[80vh]">
        <table className="w-full table-auto border-collapse border border-gray-200">
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
                  <td className={`border px-2 py-1 font-bold ${status.color}`}>{p.currentStock}</td>
                  <td className="border px-2 py-1">{p.minstock || 0}</td>
                  <td className="border px-2 py-1">{p.sold || 0}</td>
                  <td className={`border px-2 py-1 font-bold ${status.color}`}>{status.label}</td>
                  <td className="border px-2 py-1">
                    <button onClick={() => handleDelete(p._id, p.productName)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 mx-auto">
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
