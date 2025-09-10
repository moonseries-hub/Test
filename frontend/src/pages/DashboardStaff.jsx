import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardStaff() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/inventory-receive")}
          className="bg-blue-900 text-white p-6 rounded-lg hover:bg-blue-700 transition"
        >
          Receive Inventory
        </button>
        <button
          onClick={() => navigate("/inventory-consume")}
          className="bg-blue-900 text-white p-6 rounded-lg hover:bg-blue-700 transition"
        >
          Consume Inventory
        </button>
        <button
          onClick={() => navigate("/reports")}
          className="bg-blue-900 text-white p-6 rounded-lg hover:bg-blue-700 transition"
        >
          Reports
        </button>
      </div>
    </div>
  );
}
