// src/pages/Store.jsx
import React, { useState } from "react";

const initialProducts = [
  { id: 101, name: "RISAT-2B Satellite", category: "Satellite", vendor: "ISRO", stock: 2, sold: 0, price: 5000000, status: "In stock" },
  { id: 102, name: "Cartosat-3 Satellite", category: "Satellite", vendor: "ISRO", stock: 1, sold: 0, price: 7000000, status: "In stock" },
  { id: 103, name: "Satellite Imaging Camera", category: "Sensor", vendor: "NRSC", stock: 0, sold: 2, price: 150000, status: "Out of stock" },
  { id: 104, name: "Launch Vehicle Components", category: "Launch", vendor: "ISRO", stock: 50, sold: 10, price: 200000, status: "In stock" },
  { id: 105, name: "Ground Station Antenna", category: "Ground Equipment", vendor: "NRSC", stock: 5, sold: 1, price: 50000, status: "In stock" },
  { id: 106, name: "Remote Sensing Data Package", category: "Data Service", vendor: "NRSC", stock: 100, sold: 20, price: 5000, status: "In stock" },
];

export default function Store() {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

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
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="text-center">
                <td className="border px-2 py-1">{p.id}</td>
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">{p.category}</td>
                <td className="border px-2 py-1">{p.vendor}</td>
                <td className={`border px-2 py-1 font-bold ${p.stock === 0 ? "bg-red-200" : "bg-green-200"}`}>{p.stock}</td>
                <td className="border px-2 py-1">{p.sold}</td>
                <td className="border px-2 py-1">{p.price.toLocaleString()}</td>
                <td className="border px-2 py-1">{p.status}</td>
                <td className="border px-2 py-1 flex justify-center gap-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
