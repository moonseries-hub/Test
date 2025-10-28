// src/pages/AddProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Backend base URL

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");

  const [errors, setErrors] = useState({
    quantity: "",
    cost: "",
    mirvDate: "",
  });

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
    productUpdatingDate: new Date().toISOString().split("T")[0], // ✅ auto-fill
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

  // Handle input changes + validations
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "quantity") {
      if (value <= 0) {
        setErrors((prev) => ({
          ...prev,
          quantity: "❌ Quantity must be greater than 0",
        }));
      } else {
        setErrors((prev) => ({ ...prev, quantity: "" }));
      }
    }

    if (name === "cost") {
      if (value <= 0) {
        setErrors((prev) => ({
          ...prev,
          cost: "❌ Cost must be greater than 0",
        }));
      } else {
        setErrors((prev) => ({ ...prev, cost: "" }));
      }
    }

    if (name === "mirvDate" || name === "dateOfReceipt") {
      const receipt = name === "dateOfReceipt" ? value : formData.dateOfReceipt;
      const mirv = name === "mirvDate" ? value : formData.mirvDate;

      if (receipt && mirv && new Date(mirv) < new Date(receipt)) {
        setErrors((prev) => ({
          ...prev,
          mirvDate: "❌ MIRV Date must be after Date of Receipt",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mirvDate: "" }));
      }
    }

    // When category changes, reset dependent fields
    if (name === "category") {
      const selectedCat = categories.find((c) => c._id === value);
      if (selectedCat) {
        setMakes(selectedCat.makes || []);
        setModels(selectedCat.models || []);
        setFormData((prev) => ({ ...prev, make: "", model: "" }));
      } else {
        setMakes([]);
        setModels([]);
      }
    }
  };

  // ✅ Add New Location
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return alert("Enter location name");
    try {
      const res = await axios.post(`${API_URL}/locations`, {
        name: newLocationName.trim(),
      });
      setLocations([...locations, res.data]);
      setSelectedLocation(res.data._id);
      setFormData((prev) => ({ ...prev, location: res.data._id }));
      setNewLocationName("");
      alert("✅ Location added!");
    } catch (err) {
      console.error("Error adding location:", err);
      alert("❌ Failed to add location");
    }
  };

  // ✅ Add New Make or Model
  const handleAddMakeOrModel = async (type) => {
    if (!formData.category) return alert("Select a category first!");
    const value = type === "make" ? newMake.trim() : newModel.trim();
    if (!value) return alert(`Enter new ${type} name`);

    try {
      await axios.patch(`${API_URL}/categories/${formData.category}/add-${type}`, {
        [type]: value,
      });

      alert(`✅ ${type} added successfully!`);
      if (type === "make") {
        setMakes((prev) => [...prev, value]);
        setNewMake("");
      } else {
        setModels((prev) => [...prev, value]);
        setNewModel("");
      }
    } catch (err) {
      console.error(`Error adding ${type}:`, err);
      alert(`❌ Failed to add ${type}`);
    }
  };

  // ✅ Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block if errors exist
    if (errors.quantity || errors.cost || errors.mirvDate) {
      alert("⚠️ Fix all validation errors before submitting.");
      return;
    }

    if (
      !formData.productName.trim() ||
      !formData.category ||
      !formData.make ||
      !formData.location
    )
      return alert("Product Name, Category, Make, and Location are required.");

    try {
      await axios.post(`${API_URL}/products`, formData);
      alert("✅ Product added successfully!");
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
        productUpdatingDate: new Date().toISOString().split("T")[0],
      });
      setSelectedLocation("");
      setMakes([]);
      setModels([]);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b pb-3 text-center">
        Add New Product
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Make */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Make</label>
          <div className="flex gap-2">
            <select
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Make</option>
              {makes.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="New Make"
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              className="border rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => handleAddMakeOrModel("make")}
              className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Add New Model */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Model (Optional)</label>
          <div className="flex gap-2">
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Model</option>
              {models.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="New Model"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              className="border rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => handleAddMakeOrModel("model")}
              className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Quantity Received</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${
              errors.quantity ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        {/* Cost */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Cost (with Tax)</label>
          <input
            type="number"
            step="0.01"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${
              errors.cost ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
        </div>

        {/* Date of Receipt */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Date of Receipt</label>
          <input
            type="date"
            name="dateOfReceipt"
            value={formData.dateOfReceipt}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* MIRV Date */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">MIRV Cleared Date</label>
          <input
            type="date"
            name="mirvDate"
            value={formData.mirvDate}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${
              errors.mirvDate ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
          />
          {errors.mirvDate && <p className="text-red-500 text-sm">{errors.mirvDate}</p>}
        </div>

        {/* Auto Product Updating Date */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Product Updating Date</label>
          <input
            type="date"
            name="productUpdatingDate"
            value={formData.productUpdatingDate}
            readOnly
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Location</label>
          <select
            name="location"
            value={formData.location || selectedLocation}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Location */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Add New Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={handleAddLocation}
              className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Serial Number */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PO */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Indent / PO</label>
          <input
            type="text"
            name="po"
            value={formData.po}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
