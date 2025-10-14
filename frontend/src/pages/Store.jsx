import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function Store() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      const data = res.data;

      const grouped = {};

      data.forEach(p => {
        const key = `${p.category._id}-${p.make}-${p.model}`;

        if (!grouped[key]) {
          grouped[key] = {
            productName: p.productName,
            category: p.category.name,
            vendor: p.make,
            model: p.model,
            instock: p.instock,
            sold: p.sold,
            status: p.instock > 0 ? "available" : "out of stock",
          };
        } else {
          grouped[key].instock += p.instock;
          grouped[key].sold += p.sold;
        }
      });

      setProducts(Object.entries(grouped));
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
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Make</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Sold</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(([key, p]) => (
              <tr key={key} className="text-center">
                <td className="border px-2 py-1">{p.productName}</td>
                <td className="border px-2 py-1">{p.category}</td>
                <td className="border px-2 py-1">{p.vendor}</td>
                <td className="border px-2 py-1">{p.model}</td>
                <td className={`border px-2 py-1 font-bold ${p.instock === 0 ? "bg-red-200" : "bg-green-200"}`}>
                  {p.instock}
                </td>
                <td className="border px-2 py-1">{p.sold}</td>
                <td className={`border px-2 py-1 font-bold ${p.status === "available" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
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
