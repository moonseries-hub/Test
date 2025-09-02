import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Total Stock</h2>
          <p className="text-2xl mt-4">1500 Items</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Recent Receipts</h2>
          <p className="text-2xl mt-4">45 Items</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Recent Consumption</h2>
          <p className="text-2xl mt-4">30 Items</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/inventory-receive")}
          className="bg-green-500 text-white py-3 rounded hover:bg-green-600"
        >
          Receive Inventory
        </button>
        <button
          onClick={() => navigate("/inventory-consume")}
          className="bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600"
        >
          Record Consumption
        </button>
        <button
          onClick={() => navigate("/categories")}
          className="bg-indigo-500 text-white py-3 rounded hover:bg-indigo-600"
        >
          Manage Categories
        </button>
      </div>
    </div>
  );
}
