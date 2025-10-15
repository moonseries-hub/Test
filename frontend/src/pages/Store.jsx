// src/pages/Store.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      const data = res.data;

      const grouped = {};
      data.forEach((p) => {
        const key = `${p.category._id}-${p.make}-${p.model}`;
        if (!grouped[key]) {
          grouped[key] = {
            _id: p._id,
            productName: `${p.make} ${p.model}`,
            category: p.category?.name || "—",
            vendor: p.make,
            stock: p.quantity,
            sold: 0,
            price: (p.cost / p.quantity).toFixed(2),
            status: p.quantity > 0 ? "In Stock" : "Out of Stock",
          };
        } else {
          grouped[key].stock += p.quantity;
        }
      });

      setProducts(Object.values(grouped));
    } catch (err) {
      console.error("❌ Error fetching products:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">
        ⏳ Loading Inventory...
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-4 text-gray-800">📦 NRSC/ISRO Inventory Dashboard</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-sm sticky top-0">
            <tr>
              <th className="border px-3 py-2">Product ID</th>
              <th className="border px-3 py-2">Product Name</th>
              <th className="border px-3 py-2">Category</th>
              <th className="border px-3 py-2">Vendor</th>
              <th className="border px-3 py-2">Stock</th>
              <th className="border px-3 py-2">Sold</th>
              <th className="border px-3 py-2">Price (₹)</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p._id}
                className={`text-center text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="border px-2 py-2 text-gray-600">{p._id}</td>
                <td className="border px-2 py-2 font-semibold">{p.productName}</td>
                <td className="border px-2 py-2">{p.category}</td>
                <td className="border px-2 py-2">{p.vendor}</td>
                <td
                  className={`border px-2 py-2 font-bold ${
                    p.stock === 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="border px-2 py-2">{p.sold}</td>
                <td className="border px-2 py-2">₹{p.price}</td>
                <td
                  className={`border px-2 py-2 ${
                    p.status === "In Stock"
                      ? "text-green-700"
                      : "text-red-600 font-medium"
                  }`}
                >
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
