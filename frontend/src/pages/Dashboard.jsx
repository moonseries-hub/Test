
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_PO = "http://localhost:5000/api/po";
const API_STAFF = "http://localhost:5000/api/staff/all";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [poData, setPoData] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchStaff();
    fetchPOData();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(API_STAFF);
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPOData = async () => {
    try {
      const res = await axios.get(API_PO);
      setPoData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /*** KPI Stats ***/
  const totalProducts = products.length;
  const totalConsumed = products.reduce(
    (sum, p) => sum + (p.consumptionRecords || []).reduce((s, r) => s + (r.quantity || 0), 0),
    0
  );
  const totalStock = products.reduce((sum, p) => sum + (p.availableStock || 0), 0);
  const totalCategories = new Set(products.map(p => p.category?.name)).size;

  /*** Products by Category ***/
  const categoryData = Object.values(
    products.reduce((acc, p) => {
      const cat = p.category?.name || "Uncategorized";
      if (!acc[cat]) acc[cat] = { name: cat, count: 0 };
      acc[cat].count += 1;
      return acc;
    }, {})
  );

  /*** Stock vs Consumed Pie ***/
  const pieData = [
    { name: "In Stock", value: totalStock },
    { name: "Consumed", value: totalConsumed }
  ];
  const PIE_COLORS = ["#10b981", "#ef4444"];

  /*** PO Trend - Count of Products per Month with Cleared vs Pending ***/
  const poTrend = useMemo(() => {
    const monthMap = {};
    poData.forEach(po => {
      if (!po.expectedDate) return;
      const dateObj = new Date(po.expectedDate);
      const monthKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`;
      monthMap[monthKey] = monthMap[monthKey] || { cleared: new Set(), pending: new Set() };
      if (po.isConsumed) monthMap[monthKey].cleared.add(po.productName);
      else monthMap[monthKey].pending.add(po.productName);
    });

    return Object.entries(monthMap)
      .map(([month, data]) => {
        const [year, m] = month.split("-");
        const date = new Date(year, Number(m) - 1);
        return {
          month: date.toLocaleString("default", { month: "short", year: "numeric" }),
          cleared: data.cleared.size,
          pending: data.pending.size
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [poData]);

  /*** Staff Consumption ***/
  const staffConsumptionMap = {};
  products.forEach(p => {
    (p.consumptionRecords || []).forEach(rec => {
      if (rec.consumedByName) {
        staffConsumptionMap[rec.consumedByName] = (staffConsumptionMap[rec.consumedByName] || 0) + (rec.quantity || 0);
      }
    });
  });
  const staffConsumptionData = staff.map(s => ({
    staff: s.name,
    consumed: staffConsumptionMap[s.name] || 0
  }));

  /*** Recent Consumption ***/
  const recentRecords = products
    .flatMap(p => (p.consumptionRecords || []).map(rec => ({
      product: p.productName,
      quantity: rec.quantity,
      location: rec.usedAtLocation?.name || "-",
      date: rec.date
    })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">📊 Inventory Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[{ label: "Total Products", value: totalProducts, color: "bg-blue-100 text-blue-700" },
          { label: "In Stock", value: totalStock, color: "bg-green-100 text-green-700" },
          { label: "Consumed", value: totalConsumed, color: "bg-red-100 text-red-700" },
          { label: "Categories", value: totalCategories, color: "bg-purple-100 text-purple-700" },
          { label: "Total Staff", value: staff.length, color: "bg-yellow-100 text-yellow-700" }].map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl shadow text-center font-semibold ${stat.color} hover:shadow-lg transition-all`}>
              <p>{stat.label}</p>
              <h3 className="text-3xl mt-2">{stat.value}</h3>
            </div>
          ))}
      </div>

      {/* PO Trend + Recent Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="font-semibold mb-2 text-center text-gray-700">PO in pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={poTrend} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-20} textAnchor="end" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
              <Bar dataKey="cleared" stackId="a" fill="#10b981" name="Cleared" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="font-semibold mb-3 text-center text-gray-700">🕓 Recent Consumption</h3>
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
                  <td colSpan="4" className="text-center text-gray-500 p-3">No recent activity.</td>
                </tr>
              ) : (
                recentRecords.map((r, i) => (
                  <tr key={i} className="text-center hover:bg-gray-50">
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

      {/* Products by Category + Stock vs Consumed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="font-semibold mb-2 text-center text-gray-700">Products by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="font-semibold mb-2 text-center text-gray-700">Stock vs Consumed</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((entry, index) => <Cell key={index} fill={PIE_COLORS[index]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
