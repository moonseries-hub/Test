import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { useNavigate } from "react-router-dom";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  // === KPI Stats ===
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.instock || 0), 0);
  const totalConsumed = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const totalCategories = new Set(products.map((p) => p.category?.name)).size;

  // === Chart: Products by Category ===
  const categoryData = Object.values(
    products.reduce((acc, p) => {
      const cat = p.category?.name || "Uncategorized";
      if (!acc[cat]) acc[cat] = { name: cat, count: 0 };
      acc[cat].count += 1;
      return acc;
    }, {})
  );

  // === Chart: In Stock vs Consumed ===
  const pieData = [
    { name: "In Stock", value: totalStock },
    { name: "Consumed", value: totalConsumed },
  ];
  const PIE_COLORS = ["#10b981", "#ef4444"];

  // === Chart: Monthly Consumption Trend ===
  const monthMap = {};
  products.forEach((p) => {
    (p.consumptionRecords || []).forEach((rec) => {
      const month = new Date(rec.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthMap[month] = (monthMap[month] || 0) + rec.quantity;
    });
  });
  const monthlyTrend = Object.entries(monthMap)
    .map(([month, qty]) => ({ month, qty }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // === Table: Recent Activity ===
  const recentRecords = products
    .flatMap((p) =>
      (p.consumptionRecords || []).map((rec) => ({
        product: p.productName,
        quantity: rec.quantity,
        date: rec.date,
        location: rec.usedAtLocation?.name || "-",
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // === Top Locations ===
  const locationMap = {};
  products.forEach((p) =>
    (p.consumptionRecords || []).forEach((r) => {
      const loc = r.usedAtLocation?.name || "Unknown";
      locationMap[loc] = (locationMap[loc] || 0) + r.quantity;
    })
  );
  const topLocations = Object.entries(locationMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📊 Inventory Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: totalProducts, color: "bg-blue-100 text-blue-700" },
          { label: "In Stock", value: totalStock, color: "bg-green-100 text-green-700" },
          { label: "Consumed", value: totalConsumed, color: "bg-red-100 text-red-700" },
          { label: "Categories", value: totalCategories, color: "bg-purple-100 text-purple-700" },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl shadow text-center font-semibold ${stat.color}`}>
            <p>{stat.label}</p>
            <h3 className="text-3xl mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products by Category */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-2 text-center">Products by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock vs Consumed */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-2 text-center">Stock vs Consumed</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        
        
      </div>

      {/* Bottom Section: Monthly Trend + Recent Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Consumption Trend */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-2 text-center">PO in pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="qty" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-3 text-center">🕓 Recent Consumption</h3>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 p-3">
                    No recent activity.
                  </td>
                </tr>
              ) : (
                recentRecords.map((r, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-2">{r.product}</td>
                    <td className="border p-2">{r.quantity}</td>
                    <td className="border p-2">{r.location}</td>
                    <td className="border p-2">{new Date(r.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

  
    </div>
  );
}
