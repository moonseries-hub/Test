import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function ConsumeProduct() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    usedAtLocationId: "",
    date: "",
    remarks: "",
  });

  // Fetch products & locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await axios.get(`${API_URL}/products`);
        const locs = await axios.get(`${API_URL}/locations`);
        setProducts(prods.data);
        setLocations(locs.data);
      } catch (err) {
        console.error("Error fetching products/locations:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if quantity exceeds available stock
    if (name === "quantity" && form.productId) {
      const selectedProduct = products.find(p => p._id === form.productId);
      if (value > selectedProduct.quantity) {
        alert(`⚠ Quantity exceeds available stock! Available: ${selectedProduct.quantity}`);
        return; // prevent updating form with invalid quantity
      }
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConsume = async () => {
    if (!form.productId || !form.quantity || !form.usedAtLocationId) {
      return alert("Select product, quantity and usage location");
    }

    const selectedProduct = products.find(p => p._id === form.productId);
    if (form.quantity > selectedProduct.quantity) {
      return alert(`⚠ Quantity exceeds available stock! Available: ${selectedProduct.quantity}`);
    }

    try {
      await axios.patch(`${API_URL}/products/${form.productId}/consume`, form);
      alert("✅ Product consumed successfully!");

      // Reset form
      setForm({ productId: "", quantity: "", usedAtLocationId: "", date: "", remarks: "" });

      // Refresh product list
      const prods = await axios.get(`${API_URL}/products`);
      setProducts(prods.data);
    } catch (err) {
      console.error("Error consuming product:", err.response?.data || err.message);
      alert("❌ Failed to consume product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Consume Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product */}
        <div className="flex flex-col">
          <label>Product</label>
          <select name="productId" value={form.productId} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>
                {p.productName} (Available: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label>Quantity</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>

        {/* Usage Location */}
        <div className="flex flex-col">
          <label>Usage Location</label>
          <select name="usedAtLocationId" value={form.usedAtLocationId} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="">Select location</option>
            {locations.map(loc => (
              <option key={loc._id} value={loc._id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label>Consumption Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>

        {/* Remarks */}
        <div className="md:col-span-2 flex flex-col">
          <label>Remarks</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} className="border rounded px-3 py-2" rows={2}></textarea>
        </div>
      </div>

      <button onClick={handleConsume} className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
        ➕ Consume Product
      </button>
    </div>
  );
}
