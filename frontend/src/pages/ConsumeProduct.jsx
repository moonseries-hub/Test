import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_LOCATIONS = "http://localhost:5000/api/locations";

export default function ConsumeProduct() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [newLocationName, setNewLocationName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
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

  // Add New Location
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return;
    try {
      const res = await axios.post(API_LOCATIONS, { name: newLocationName });
      alert("Location added successfully!");
      setSelectedLocation(res.data._id);
      setNewLocationName("");
      fetchLocations();
    } catch (err) {
      console.error(err);
      alert("Failed to add location");
    }
  };

  // Consume Product
  const handleConsume = async () => {
    if (!selectedProduct || !selectedLocation || !quantity) {
      alert("Please fill all required fields.");
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) {
      alert("Selected product not found.");
      return;
    }

    // Quantity validation
    if (Number(quantity) > product.instock) {
      alert(
        `Entered quantity (${quantity}) exceeds available stock (${product.instock}).`
      );
      return;
    }

    try {
      await axios.patch(`${API_PRODUCTS}/${selectedProduct}/consume`, {
        quantity: Number(quantity),
        usedAtLocationId: selectedLocation,
        remarks,
      });

      alert("Consumed successfully!");
      setQuantity("");
      setSelectedProduct("");
      setSelectedLocation("");
      setRemarks("");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to consume product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Consume Product
        </h2>

        {/* Add New Location */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
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
              className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Consume Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName} (In Stock: {p.instock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
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

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Remarks
            </label>
            <input
              type="text"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            onClick={handleConsume}
            className="mt-4 bg-green-500 text-white font-semibold p-3 rounded-xl hover:bg-green-600 transition"
          >
            Consume Product
          </button>
        </div>
      </div>
    </div>
  );
}
