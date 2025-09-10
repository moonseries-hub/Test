// src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Dashboard</h2>

      {/* Example stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg">Total Items</h3>
          <p className="text-2xl font-bold">245</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg">Orders</h3>
          <p className="text-2xl font-bold">52</p>
        </div>
      </div>
    </div>
  );
}
