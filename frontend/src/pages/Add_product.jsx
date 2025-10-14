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

  const handleAddSubCategory = async () => {
    if (!selectedCategory || !newSubCategoryName) {
      return alert("Select category and enter subcategory name");
    }
    try {
      await axios.post(`${API_URL}/categories/${selectedCategory}/subcategories`, {
        name: newSubCategoryName,
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
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleChange(e);
            }}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Subcategory Select */}
        <div className="flex flex-col">
          <label htmlFor="subCategory" className="mb-1 text-sm font-medium text-gray-700">
            Sub Category
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
            disabled={!selectedCategory}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <label htmlFor="newSubCategoryName" className="mb-1 text-sm font-medium text-gray-700">
            Add Subcategory
          </label>
          <div className="flex gap-2">
            <input
              id="newSubCategoryName"
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

        {/* Specifications */}
        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="specifications" className="mb-1 text-sm font-medium text-gray-700">
            Specifications
          </label>
          <textarea
            id="specifications"
            name="specifications"
            rows="3"
            value={formData.specifications}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Serial Number */}
        <div className="flex flex-col">
          <label htmlFor="serialNumber" className="mb-1 text-sm font-medium text-gray-700">
            Serial No
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

        {/* MIRV Date */}
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
