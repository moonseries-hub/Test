import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function Orders() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_PRODUCTS);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Consumed Products / Orders</h2>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto max-h-[80vh]">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Make</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">Consumed Quantity</th>
              <th className="border px-2 py-1">Used At</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) =>
              p.consumptionRecords.map((rec, idx) => (
                <tr key={`${p._id}-${idx}`} className="text-center">
                  <td className="border px-2 py-1">{p.productName}</td>
                  <td className="border px-2 py-1">{p.category?.name || "-"}</td>
                  <td className="border px-2 py-1">{p.make}</td>
                  <td className="border px-2 py-1">{p.model || "-"}</td>
                  <td className="border px-2 py-1">{rec.quantity}</td>
                  <td className="border px-2 py-1">{rec.usedAtLocation?.name || "-"}</td>
                  <td className="border px-2 py-1">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{rec.remarks || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
