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

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchLocations();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(API_CATEGORIES);
    setCategories(res.data);
  };
  const fetchProducts = async () => {
    const res = await axios.get(API_PRODUCTS);
    setProducts(res.data);
  };
  const fetchLocations = async () => {
    const res = await axios.get(API_LOCATIONS);
    setLocations(res.data);
  };

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return alert("Enter location name");
    await axios.post(API_LOCATIONS, { name: newLocationName });
    setNewLocationName("");
    fetchLocations();
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantity(val);
    if (Number(val) <= 0) setQuantityError("Quantity must be > 0");
    else setQuantityError("");
  };

  const handleConsume = async () => {
    if (!selectedCategory || !selectedProduct || !fromLocation || !toLocation || !quantity) {
      return alert("Fill all fields");
    }
    if (quantityError) return alert("Fix quantity error");

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return alert("Product not found");

    if (Number(quantity) > product.instock)
      return alert(`Quantity exceeds available stock (${product.instock})`);

    try {
      await axios.patch(`${API_PRODUCTS}/${selectedProduct}/consume`, {
        quantity: Number(quantity),
        fromLocationId: fromLocation,
        toLocationId: toLocation,
        remarks,
      });
      alert("Product consumed successfully!");
      setSelectedCategory("");
      setSelectedProduct("");
      setFromLocation("");
      setToLocation("");
      setQuantity("");
      setRemarks("");
      fetchProducts();
    } catch (err) {
      alert("Failed to consume product");
      console.error(err);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?._id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Consume Product</h2>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Add New Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter new location"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAddLocation}
              className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label>Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedProduct("");
              }}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Product</option>
              {filteredProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} (In Stock: {p.instock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>From Location</label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select From Location</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>To Location</label>
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select To Location</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
              className={`w-full p-3 border rounded-xl focus:ring-2 ${
                quantityError ? "border-red-500 focus:ring-red-400" : "focus:ring-green-400"
              }`}
            />
            {quantityError && <p className="text-red-500">{quantityError}</p>}
          </div>

          <div>
            <label>Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            onClick={handleConsume}
            className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 mt-4"
          >
            Consume Product
          </button>
        </div>
      </div>
    </div>
  );
}
