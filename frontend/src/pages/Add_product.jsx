// src/pages/AddProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Backend base URL

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subCategory: "",
    make: "",
    model: "",
    specifications: "",
    serialNumber: "",
    quantity: "",
    dateOfReceipt: "",
    cost: "",
    po: "",
    mirvDate: "",
  });

  // Fetch categories and map subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res.data);

        const map = {};
        res.data.forEach((cat) => {
          map[cat._id] = cat.subCategories.map((sub) => ({
            _id: sub._id,
            name: sub.name,
          }));
        });
        setSubCategoriesMap(map);
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data || err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new subcategory
  const handleAddSubCategory = async () => {
    if (!selectedCategory || !newSubCategoryName) {
      return alert("Select category and enter subcategory name");
    }
    try {
      await axios.post(`${API_URL}/categories/${selectedCategory}/sub`, {
        subName: newSubCategoryName,
      });
      alert("✅ Subcategory added!");
      setNewSubCategoryName("");

      // Refresh categories
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);

      const map = {};
      res.data.forEach((cat) => {
        map[cat._id] = cat.subCategories.map((sub) => ({
          _id: sub._id,
          name: sub.name,
        }));
      });
      setSubCategoriesMap(map);
    } catch (err) {
      console.error("Error adding subcategory:", err.response?.data || err.message);
      alert("❌ Failed to add subcategory");
    }
  };

  // Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!subCategoriesMap[selectedCategory]?.some(sub => sub._id === formData.subCategory)) {
        alert("⚠ Subcategory does not belong to selected category.");
        return;
      }

      await axios.post(`${API_URL}/products`, formData);
      alert("✅ Product added successfully!");

      setFormData({
        productName: "",
        category: "",
        subCategory: "",
        make: "",
        model: "",
        specifications: "",
        serialNumber: "",
        quantity: "",
        dateOfReceipt: "",
        cost: "",
        po: "",
        mirvDate: "",
      });
      setSelectedCategory("");
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      alert("❌ Failed to add product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">
        Add New Product
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="productName"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.category}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleChange(e);
            }}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Subcategory Select */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Sub Category</label>
          <select
            name="subCategory"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.subCategory}
            onChange={handleChange}
            required
            disabled={!selectedCategory}
          >
            <option value="">Select sub category</option>
            {selectedCategory &&
              subCategoriesMap[selectedCategory]?.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
          </select>
        </div>

        {/* Add Subcategory Input */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Add Subcategory</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New Subcategory Name"
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newSubCategoryName}
              onChange={(e) => setNewSubCategoryName(e.target.value)}
              disabled={!selectedCategory}
            />
            <button
              type="button"
              onClick={handleAddSubCategory}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={!selectedCategory}
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Make */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Make</label>
          <input
            type="text"
            name="make"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.make}
            onChange={handleChange}
            required
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            name="model"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>

        {/* Specifications */}
        <div className="md:col-span-2 flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Specifications</label>
          <textarea
            name="specifications"
            rows="3"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.specifications}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Serial Number */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Serial No</label>
          <input
            type="text"
            name="serialNumber"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.serialNumber}
            onChange={handleChange}
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Quantity Received</label>
          <input
            type="number"
            name="quantity"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Receipt */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Date of Receipt</label>
          <input
            type="date"
            name="dateOfReceipt"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.dateOfReceipt}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cost */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Cost (with Tax)</label>
          <input
            type="number"
            name="cost"
            step="0.01"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>

        {/* Indent / PO */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Indent / PO</label>
          <input
            type="text"
            name="po"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.po}
            onChange={handleChange}
          />
        </div>

        {/* MIRV Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">MIRV Cleared Date</label>
          <input
            type="date"
            name="mirvDate"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.mirvDate}
            onChange={handleChange}
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
    </div>
  );
}
