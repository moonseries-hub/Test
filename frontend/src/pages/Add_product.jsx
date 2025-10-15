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

  const [products, setProducts] = useState([]);

  // Fetch categories
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

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
      }
    };

    fetchCategories();
    fetchProducts();
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

      const res = await axios.post(`${API_URL}/products`, formData);
      alert("✅ Product added successfully!");

      // Update local products list
      setProducts(prev => [...prev, res.data]);

      // Reset form
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
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
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

        {/* Add Subcategory */}
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

        {/* Other Fields */}
        {["make","model","serialNumber","quantity","dateOfReceipt","cost","po","mirvDate"].map(field => (
          <div className="flex flex-col" key={field}>
            <label className="mb-1 text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field==="quantity" || field==="cost" ? "number" : field.includes("Date") ? "date" : "text"}
              name={field}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData[field]}
              onChange={handleChange}
              required={field==="quantity" || field==="dateOfReceipt" || field==="cost"}
            />
          </div>
        ))}

        {/* Specifications */}
        <div className="md:col-span-2 flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Specifications</label>
          <textarea
            name="specifications"
            rows="3"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.specifications}
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
