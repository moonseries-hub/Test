// src/pages/ConsumeProduct.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_LOCATIONS = "http://localhost:5000/api/locations";
const API_CATEGORIES = "http://localhost:5000/api/categories";

export default function ConsumeProduct() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch all data
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
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(API_LOCATIONS);
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products by category + search term
  useEffect(() => {
    let filtered = products;
    if (selectedCategory)
      filtered = filtered.filter(
        (p) => p.category && p.category._id === selectedCategory
      );
    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return;
    try {
      const res = await axios.post(API_LOCATIONS, { name: newLocationName });
      alert("✅ Location added successfully!");
      setSelectedLocation(res.data._id);
      setNewLocationName("");
      fetchLocations();
    } catch (err) {
      alert("❌ Failed to add location");
      console.error(err);
    }
  };

  // Consume product
  const handleConsume = async () => {
    if (!selectedProduct || !selectedLocation || !quantity) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return alert("Product not found.");

    if (Number(quantity) > product.instock) {
      alert(
        `❌ Quantity entered (${quantity}) exceeds available stock (${product.instock})`
      );
      return;
    }

    try {
      await axios.patch(`${API_PRODUCTS}/${selectedProduct}/consume`, {
        quantity: Number(quantity),
        usedAtLocationId: selectedLocation,
        remarks,
      });
      alert("✅ Product consumed successfully!");
      setSelectedProduct("");
      setSelectedLocation("");
      setQuantity("");
      setRemarks("");
      setSearchTerm("");
      fetchProducts();
    } catch (err) {
      alert("❌ Failed to consume product");
      console.error(err);
    }
  };

  // Validate quantity live
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    const product = products.find((p) => p._id === selectedProduct);
    if (product && Number(value) > product.instock) {
      alert(
        `⚠️ Entered quantity (${value}) exceeds available stock (${product.instock})`
      );
      setQuantity("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📦 Consume Product
        </h2>

        {/* CATEGORY SELECTION */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mb-2 block">
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEARCHABLE PRODUCT DROPDOWN */}
        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="font-semibold text-gray-700 mb-2 block">
            Select Product
          </label>
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowProductDropdown(true);
            }}
            onFocus={() => setShowProductDropdown(true)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 mb-1"
          />
          {showProductDropdown && (
            <div className="absolute z-10 w-full max-h-40 overflow-y-auto border rounded-xl shadow-lg bg-white">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className={`p-2 cursor-pointer hover:bg-green-100 ${
                    selectedProduct === p._id ? "bg-green-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedProduct(p._id);
                    setSearchTerm(p.productName);
                    setShowProductDropdown(false);
                  }}
                >
                  {p.productName} — In Stock: {p.instock}
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="p-2 text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* LOCATION SELECTION */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mb-2 block">
            Select Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Location</option>
            {locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* ADD NEW LOCATION */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 block">
            Add New Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter new location"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAddLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* QUANTITY */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mb-2 block">
            Quantity
          </label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* REMARKS */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 block">
            Remarks
          </label>
          <input
            type="text"
            placeholder="Enter remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* CONSUME BUTTON */}
        <button
          onClick={handleConsume}
          className="w-full bg-green-500 text-white font-semibold text-lg py-3 rounded-xl hover:bg-green-600 transition"
        >
          ✅ Consume Product
        </button>
      </div>
    </div>
  );
}
