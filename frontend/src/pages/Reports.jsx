// src/pages/InventoryReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products"; // your API

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("stock");
  const [filters, setFilters] = useState({ product: "", location: "", staff: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  /*** Flatten records ***/
  const stockRecords = products.map(p => ({
    productName: p.productName,
    category: p.category?.name || "-",
    location: p.locations?.[0]?.location?.name || "-",
    openingStock: p.openingStock || 0,
    newStock: p.newStock || 0,
    availableStock: p.instock || 0,
    consumed: p.consumptionRecords?.reduce((sum, r) => sum + r.quantity, 0) || 0,
    minStock: p.minstock || 0,
  }));

  const consumedRecords = products.flatMap(p =>
    (p.consumptionRecords || []).map(r => ({
      productName: p.productName,
      category: p.category?.name || "-",
      quantity: r.quantity,
      usedAtLocation: r.usedAtLocation?.name || "-",
      consumedBy: r.consumedBy?.name || "-",
      date: r.date,
      remarks: r.remarks || "-",
    }))
  );

  const receivedRecords = products.flatMap(p =>
    (p.receivedRecords || []).map(r => ({
      productName: p.productName,
      makeModel: p.make ? `${p.make} ${p.model || ""}` : p.model || "",
      location: p.locations?.[0]?.location?.name || "-",
      cost: p.cost || 0,
      receivedDetails: r.receivedDetails || [],
      quantity: r.quantity,
      stockPage: r.stockPage,
    }))
  );

  /*** Filtered views ***/
  const filteredStock = stockRecords.filter(r => 
    (!filters.product || r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
    (!filters.location || r.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  const filteredConsumed = consumedRecords.filter(r =>
    (!filters.product || r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
    (!filters.location || r.usedAtLocation.toLowerCase().includes(filters.location.toLowerCase())) &&
    (!filters.staff || r.consumedBy.toLowerCase().includes(filters.staff.toLowerCase()))
  );

  const filteredReceived = receivedRecords.filter(r =>
    (!filters.product || r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
    (!filters.location || r.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  /*** Tab UI ***/
  const tabs = [
    { id: "stock", label: "Inventory Stock" },
    { id: "consumed", label: "Consumed Report" },
    { id: "received", label: "Received Report" },
  ];

  /*** Table row rendering ***/
  const renderStockTable = () => (
    <table className="w-full border-collapse border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">S.No</th>
          <th className="border px-2 py-1">Product</th>
          <th className="border px-2 py-1">Category</th>
          <th className="border px-2 py-1">Location</th>
          <th className="border px-2 py-1">Opening Stock</th>
          <th className="border px-2 py-1">Consumed</th>
          <th className="border px-2 py-1">New Stock</th>
          <th className="border px-2 py-1">Available Stock</th>
          <th className="border px-2 py-1">Minimum Stock</th>
        </tr>
      </thead>
      <tbody>
        {filteredStock.map((r, idx) => (
          <tr key={idx} className="text-center hover:bg-gray-50">
            <td className="border px-2 py-1">{idx + 1}</td>
            <td className="border px-2 py-1">{r.productName}</td>
            <td className="border px-2 py-1">{r.category}</td>
            <td className="border px-2 py-1">{r.location}</td>
            <td className="border px-2 py-1">{r.openingStock}</td>
            <td className="border px-2 py-1">{r.consumed}</td>
            <td className="border px-2 py-1">{r.newStock}</td>
            <td className="border px-2 py-1">{r.availableStock}</td>
            <td className="border px-2 py-1">{r.minStock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderConsumedTable = () => (
    <table className="w-full border-collapse border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">S.No</th>
          <th className="border px-2 py-1">Product</th>
          <th className="border px-2 py-1">Category</th>
          <th className="border px-2 py-1">Quantity</th>
          <th className="border px-2 py-1">Used At</th>
          <th className="border px-2 py-1">Consumed By</th>
          <th className="border px-2 py-1">Date</th>
          <th className="border px-2 py-1">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {filteredConsumed.map((r, idx) => (
          <tr key={idx} className="text-center hover:bg-gray-50">
            <td className="border px-2 py-1">{idx + 1}</td>
            <td className="border px-2 py-1">{r.productName}</td>
            <td className="border px-2 py-1">{r.category}</td>
            <td className="border px-2 py-1">{r.quantity}</td>
            <td className="border px-2 py-1">{r.usedAtLocation}</td>
            <td className="border px-2 py-1">{r.consumedBy}</td>
            <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
            <td className="border px-2 py-1">{r.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderReceivedTable = () => (
    <table className="w-full border-collapse border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">S.No</th>
          <th className="border px-2 py-1">Product</th>
          <th className="border px-2 py-1">Make/Model</th>
          <th className="border px-2 py-1">Location</th>
          <th className="border px-2 py-1">Quantity</th>
          <th className="border px-2 py-1">Cost</th>
          <th className="border px-2 py-1">Stock Page</th>
          <th className="border px-2 py-1">Received Details</th>
        </tr>
      </thead>
      <tbody>
        {filteredReceived.map((r, idx) => (
          <tr key={idx} className="text-center hover:bg-gray-50 align-top">
            <td className="border px-2 py-1">{idx + 1}</td>
            <td className="border px-2 py-1">{r.productName}</td>
            <td className="border px-2 py-1">{r.makeModel}</td>
            <td className="border px-2 py-1">{r.location}</td>
            <td className="border px-2 py-1">{r.quantity}</td>
            <td className="border px-2 py-1">₹ {r.cost.toLocaleString()}</td>
            <td className="border px-2 py-1">{r.stockPage || "-"}</td>
            <td className="border px-2 py-1 text-left">
              {r.receivedDetails?.map((rec, i) => (
                <div key={i} className="mb-1 border-b border-gray-200 pb-1">
                  <div>MIRV Cleared on: {rec.clearedDate || "-"}</div>
                  <div>Indentor: {rec.indentor || "-"}</div>
                  <div>PO No: {rec.poNo || "-"}</div>
                  <div>Purpose: {rec.purpose || "-"}</div>
                  <div>S.No: {rec.serialNo || "-"}</div>
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Inventory Reports Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded ${activeTab === tab.id ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {activeTab !== "stock" && activeTab !== "received" && (
          <input
            name="staff"
            placeholder="Staff"
            value={filters.staff}
            onChange={handleFilterChange}
            className="p-2 border rounded w-40"
          />
        )}
        <input
          name="product"
          placeholder="Product"
          value={filters.product}
          onChange={handleFilterChange}
          className="p-2 border rounded w-40"
        />
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="p-2 border rounded w-40"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
        {activeTab === "stock" && renderStockTable()}
        {activeTab === "consumed" && renderConsumedTable()}
        {activeTab === "received" && renderReceivedTable()}
      </div>
    </div>
  );
}
