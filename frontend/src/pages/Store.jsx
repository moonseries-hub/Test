// src/pages/Store.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_CATEGORIES = "http://localhost:5000/api/categories";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    make: "",
    model: "",
    status: "",
  });

  // Fetch products & categories
  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(API_PRODUCTS),
        axios.get(API_CATEGORIES),
      ]);
      setProducts(prodRes.data);
      setFilteredProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = [...products];

    if (newFilters.category) {
      filtered = filtered.filter(p => p.category?._id === newFilters.category);
    }
    if (newFilters.make) {
      filtered = filtered.filter(p => p.make === newFilters.make);
    }
    if (newFilters.model) {
      filtered = filtered.filter(p => p.model === newFilters.model);
    }
    if (newFilters.status) {
      if (newFilters.status === "available") {
        filtered = filtered.filter(p => p.instock > 0);
      } else if (newFilters.status === "out") {
        filtered = filtered.filter(p => p.instock === 0);
      }
    }

    setFilteredProducts(filtered);
  };

  // Get unique makes and models for filters
  const makes = [...new Set(products.map(p => p.make).filter(Boolean))];
  const models = [...new Set(products.map(p => p.model).filter(Boolean))];

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">NRSC/ISRO Inventory Dashboard</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded px-3 py-2">
            <option value="">All</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Make</label>
          <select name="make" value={filters.make} onChange={handleFilterChange} className="border rounded px-3 py-2">
            <option value="">All</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Model</label>
          <select name="model" value={filters.model} onChange={handleFilterChange} className="border rounded px-3 py-2">
            <option value="">All</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded px-3 py-2">
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto max-h-[80vh]">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Make</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Sold</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p._id} className="text-center">
                <td className="border px-2 py-1">{p.productName}</td>
                <td className="border px-2 py-1">{p.category?.name || "-"}</td>
                <td className="border px-2 py-1">{p.make}</td>
                <td className="border px-2 py-1">{p.model}</td>
                <td className={`border px-2 py-1 font-bold ${p.instock === 0 ? "bg-red-200" : "bg-green-200"}`}>{p.instock}</td>
                <td className="border px-2 py-1">{p.sold}</td>
                <td className={`border px-2 py-1 font-bold ${p.instock > 0 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                  {p.instock > 0 ? "available" : "out of stock"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
