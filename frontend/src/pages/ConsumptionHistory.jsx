import React, { useEffect, useState } from "react";
import axios from "axios";

const API_HISTORY = "http://localhost:5000/api/products/consumption-history";

export default function ConsumptionHistory() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ staff: "", product: "", location: "" });

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(API_HISTORY);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching consumption history:", err);
    }
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Flatten consumption records for all products
  const records = products.flatMap(p =>
    p.consumptionRecords.map(r => ({
      ...r,
      productName: p.productName,
      category: p.category?.name,
      consumedBy: r.consumedBy?.name || "-"
    }))
  );

  const filteredRecords = records.filter(r => {
    if (filters.staff && r.consumedBy !== filters.staff) return false;
    if (filters.product && r.productName !== filters.product) return false;
    if (filters.location && r.usedAtLocation?.name !== filters.location) return false;
    return true;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Consumption History</h2>

      <div className="flex gap-2 mb-4 justify-center">
        <input name="staff" placeholder="Staff" onChange={handleFilterChange} className="p-2 border rounded" />
        <input name="product" placeholder="Product" onChange={handleFilterChange} className="p-2 border rounded" />
        <input name="location" placeholder="Location" onChange={handleFilterChange} className="p-2 border rounded" />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
                
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">From Location</th>
              <th className="border px-2 py-1">To Location</th>
              <th className="border px-2 py-1">Consumed By</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-2 py-1">{r.productName}</td>
                <td className="border px-2 py-1">{r.category}</td>
                <td className="border px-2 py-1">{r.quantity}</td>
                <td className="border px-2 py-1">{r.usedAtLocation?.name || "-"}</td>
                <td className="border px-2 py-1">{r.toLocation?.name || "-"}</td>
                <td className="border px-2 py-1">{r.consumedBy}</td>
                <td className="border px-2 py-1">{new Date(r.date).toLocaleString()}</td>
                <td className="border px-2 py-1">{r.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
