// src/pages/ConsumeProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_LOCATIONS = "http://localhost:5000/api/locations";
const API_CATEGORIES = "http://localhost:5000/api/categories";

export default function ConsumeProduct() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [remarks, setRemarks] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [consumedByName, setConsumedByName] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchLocations();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_CATEGORIES);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(API_LOCATIONS);
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return alert("Enter location name");
    try {
      await axios.post(API_LOCATIONS, { name: newLocationName.trim() });
      setNewLocationName("");
      fetchLocations();
      alert("✅ Location added!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add location");
    }
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantity(val);
    setQuantityError(!val || Number(val) <= 0 ? "❌ Quantity must be > 0" : "");
  };

  const handleConsume = async () => {
    if (!selectedCategory || !selectedProduct || !fromLocation || !toLocation || !quantity || !consumedByName.trim()) {
      return alert("⚠️ Fill all required fields (including Consumed By)");
    }
    if (quantityError) return alert("⚠️ Fix quantity error before submitting");

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return alert("❌ Product not found");

    // compute available using backend virtuals if present else fallback
    const available = product.availableStock ?? ( (product.openingStock || 0) + (product.totalReceived || 0) - (product.totalConsumed || 0) );
    if (Number(quantity) > available) {
      return alert(`⚠️ Quantity exceeds available stock (${available})`);
    }

    const user = JSON.parse(localStorage.getItem("user")) || {};
    try {
      await axios.patch(`${API_PRODUCTS}/${selectedProduct}/consume`, {
        quantity: Number(quantity),
        fromLocationId: fromLocation,
        toLocationId: toLocation,
        consumedById: user.id || null,
        consumedByName,
        remarks,
      });

      alert("✅ Product consumed successfully!");
      setSelectedCategory("");
      setSelectedProduct("");
      setFromLocation("");
      setToLocation("");
      setQuantity("");
      setRemarks("");
      setConsumedByName("");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Failed to consume product");
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?._id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Consume Product</h2>

        {/* Add Location */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Add New Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter new location"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={handleAddLocation} className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition">
              Add
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Consumed By */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Consumed By (Name)</label>
            <input
              type="text"
              placeholder="Enter person name"
              value={consumedByName}
              onChange={(e) => setConsumedByName(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setSelectedProduct(""); }}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Select Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Product</option>
              {filteredProducts.map((p) => {
                const consumedQty = (p.consumptionRecords || []).reduce((s, r) => s + (r.quantity || 0), 0);
                const totalReceived = (p.receivedRecords || []).reduce((s, r) => s + (r.quantity || 0), 0);
                const availableStock = (p.openingStock || 0) + totalReceived - consumedQty;
                return (
                  <option key={p._id} value={p._id}>
                    {p.productName} (Available: {availableStock})
                  </option>
                );
              })}
            </select>
          </div>

          {/* From Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">From Location</label>
            <select value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Select From Location</option>
              {locations.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </div>

          {/* To Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">To Location</label>
            <select value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Select To Location</option>
              {locations.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
            <input type="number" min="1" value={quantity} onChange={handleQuantityChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${quantityError ? "border-red-500 focus:ring-red-400" : "focus:ring-green-400"}`} />
            {quantityError && <p className="text-red-500 text-sm mt-1">{quantityError}</p>}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Remarks</label>
            <input type="text" placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          <button onClick={handleConsume} className="mt-4 bg-green-500 text-white font-semibold p-3 rounded-xl hover:bg-green-600 transition">
            Consume Product
          </button>
        </div>
      </div>
    </div>
  );
}
