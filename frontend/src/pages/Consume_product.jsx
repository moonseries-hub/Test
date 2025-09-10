import React, { useState } from "react";

export default function ConsumeProduct({ products, onConsume }) {
  const [form, setForm] = useState({ productId: "", person: "", location: "", quantity: 0, date: "", reason: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const product = products.find(p => p.id === parseInt(form.productId));
    if (!product) return alert("Product ID not found");
    if (form.quantity > product.stock) return alert("Cannot consume more than available stock");
    onConsume(form);
    setForm({ productId: "", person: "", location: "", quantity: 0, date: "", reason: "" });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
      <h2 className="font-bold text-lg mb-4 text-center bg-red-500 text-white py-2 rounded">Consume Product</h2>
      <div className="flex flex-col gap-2">
        <input type="number" name="productId" value={form.productId} onChange={handleChange} placeholder="Product ID" className="border p-2 rounded" />
        <input type="text" name="person" value={form.person} onChange={handleChange} placeholder="Person Consumed" className="border p-2 rounded" />
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded" />
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="border p-2 rounded" />
        <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" className="border p-2 rounded" />
        <button onClick={handleSubmit} className="bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-2">Consume Stock</button>
      </div>
    </div>
  );
}
