// src/pages/AddProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Backend base URL

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    location: "",
    make: "",
    model: "",
    serialNumber: "",
    quantity: "",
    dateOfReceipt: "",
    cost: "",
    po: "",
    mirvDate: "",
    productUpdatingDate: "",
  });

  // Fetch categories and locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/locations`),
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new location
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return alert("Enter location name");
    try {
      const res = await axios.post(`${API_URL}/locations`, { name: newLocationName.trim() });
      setLocations([...locations, res.data]);
      setSelectedLocation(res.data._id);
      setNewLocationName("");
      alert("✅ Location added!");
    } catch (err) {
      console.error("Error adding location:", err.response?.data || err.message);
      alert(err.response?.data?.error || "❌ Failed to add location");
    }
  };

  // Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, formData);
      alert("✅ Product added successfully!");

      // Update local products list
      setProducts(prev => [...prev, res.data]);

      // Reset form
      setFormData({
        productName: "",
        category: "",
        location: "",
        make: "",
        model: "",
        serialNumber: "",
        quantity: "",
        dateOfReceipt: "",
        cost: "",
        po: "",
        mirvDate: "",
        productUpdatingDate: "",
      });
      setSelectedLocation("");
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      alert(err.response?.data?.error || "❌ Failed to add product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">
        Add New Product
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="flex flex-col">
          <label htmlFor="productName" className="mb-1 text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Select */}
        <div className="flex flex-col">
          <label htmlFor="location" className="mb-1 text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location || selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              handleChange(e);
            }}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Location */}
        <div className="flex flex-col">
          <label htmlFor="newLocationName" className="mb-1 text-sm font-medium text-gray-700">
            Add New Location
          </label>
          <div className="flex gap-2">
            <input
              id="newLocationName"
              type="text"
              placeholder="New Location Name"
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddLocation}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Make */}
        <div className="flex flex-col">
          <label htmlFor="make" className="mb-1 text-sm font-medium text-gray-700">
            Make
          </label>
          <input
            id="make"
            type="text"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label htmlFor="model" className="mb-1 text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            id="model"
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Serial Number */}
        <div className="flex flex-col">
          <label htmlFor="serialNumber" className="mb-1 text-sm font-medium text-gray-700">
            Serial Number
          </label>
          <input
            id="serialNumber"
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label htmlFor="quantity" className="mb-1 text-sm font-medium text-gray-700">
            Quantity Received
          </label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Date of Receipt */}
        <div className="flex flex-col">
          <label htmlFor="dateOfReceipt" className="mb-1 text-sm font-medium text-gray-700">
            Date of Receipt
          </label>
          <input
            id="dateOfReceipt"
            type="date"
            name="dateOfReceipt"
            value={formData.dateOfReceipt}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Cost */}
        <div className="flex flex-col">
          <label htmlFor="cost" className="mb-1 text-sm font-medium text-gray-700">
            Cost (with Tax)
          </label>
          <input
            id="cost"
            type="number"
            step="0.01"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* PO */}
        <div className="flex flex-col">
          <label htmlFor="po" className="mb-1 text-sm font-medium text-gray-700">
            Indent / PO
          </label>
          <input
            id="po"
            type="text"
            name="po"
            value={formData.po}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* MIRV Cleared Date */}
        <div className="flex flex-col">
          <label htmlFor="mirvDate" className="mb-1 text-sm font-medium text-gray-700">
            MIRV Cleared Date
          </label>
          <input
            id="mirvDate"
            type="date"
            name="mirvDate"
            value={formData.mirvDate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Product Updating Date */}
        <div className="flex flex-col">
          <label htmlFor="productUpdatingDate" className="mb-1 text-sm font-medium text-gray-700">
            Product Updating Date
          </label>
          <input
            id="productUpdatingDate"
            type="date"
            name="productUpdatingDate"
            value={formData.productUpdatingDate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            ➕ Add Product
          </button>
        </div>
      </form>

      {/* Products Table */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">All Products</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Subcategory</th>
              <th className="border px-2 py-1">Make</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Cost</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="border px-2 py-1">{p.productName}</td>
                <td className="border px-2 py-1">{p.category.name}</td>
                <td className="border px-2 py-1">{p.subCategory.name}</td>
                <td className="border px-2 py-1">{p.make}</td>
                <td className="border px-2 py-1">{p.model}</td>
                <td className="border px-2 py-1">{p.quantity}</td>
                <td className="border px-2 py-1">{p.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
