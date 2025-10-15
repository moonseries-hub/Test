// src/pages/Consume_product.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_LOCATIONS = "http://localhost:5000/api/locations";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, locRes] = await Promise.all([
          axios.get(API_PRODUCTS),
          axios.get(API_LOCATIONS),
        ]);
        setProducts(prodRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity) {
      return alert("Select a product and enter quantity");
    }

    try {
      const res = await axios.patch(`${API_PRODUCTS}/${form.productId}/consume`, {
        quantity: parseInt(form.quantity),
        usedAtLocationId: form.usedAtLocationId,
        date: form.date || new Date(),
        remarks: form.remarks,
      });

      alert(`✅ Consumed ${form.quantity} units of ${res.data.productName}`);
      setForm({ productId: "", quantity: "", usedAtLocationId: "", date: "", remarks: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to consume product");
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Consume Product</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow max-w-md">
        <div className="flex flex-col mb-3">
          <label>Product</label>
          <select name="productId" value={form.productId} onChange={handleChange} className="border px-3 py-2 rounded">
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.productName} (Available: {p.instock})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-3">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col mb-3">
          <label>Location</label>
          <select name="usedAtLocationId" value={form.usedAtLocationId} onChange={handleChange} className="border px-3 py-2 rounded">
            <option value="">Select location (optional)</option>
            {locations.map((l) => (
              <option key={l._id} value={l._id}>{l.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-3">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="border px-3 py-2 rounded" />
        </div>

        <div className="flex flex-col mb-3">
          <label>Remarks</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} className="border px-3 py-2 rounded" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Consume Product
        </button>
      </form>
    </div>
  );
}
