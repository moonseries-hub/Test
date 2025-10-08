// src/pages/Store.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function Store() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      const data = res.data;

      // Group by product (category + make + model)
      const grouped = {};

      data.forEach((p) => {
        const key = `${p.category._id}-${p.make}-${p.model}`;
        if (!grouped[key]) {
          grouped[key] = {
            _id: p._id,
            productName: "", // blank initially
            category: p.category.name,
            vendor: p.make,
            stock: p.quantity,
            sold: 0,
            price: p.cost / p.quantity,
            status: "In stock",
          };
        } else {
          // increase stock if same product added again
          grouped[key].stock += p.quantity;
          grouped[key].price = (grouped[key].price * (grouped[key].stock - p.quantity) + p.cost) / grouped[key].stock;
        }
      });

      setProducts(Object.values(grouped));
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">NRSC/ISRO Inventory Dashboard</h2>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto max-h-[80vh]">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-2 py-1">Product ID</th>
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Vendor</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Sold</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="border px-2 py-1">{p._id}</td>
                <td className="border px-2 py-1">{p.productName}</td>
                <td className="border px-2 py-1">{p.category}</td>
                <td className="border px-2 py-1">{p.vendor}</td>
                <td className={`border px-2 py-1 font-bold ${p.stock === 0 ? "bg-red-200" : "bg-green-200"}`}>
                  {p.stock}
                </td>
                <td className="border px-2 py-1">{p.sold}</td>
                <td className="border px-2 py-1">{Number(p.price).toLocaleString()}</td>
                <td className="border px-2 py-1">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
