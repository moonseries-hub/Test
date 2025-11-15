// src/pages/InventoryReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function InventoryReports() {
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

  /*** Flatten Records ***/
  const stockRecords = products.map(p => ({
    productName: p.productName,
    makeModel: p.make ? `${p.make} ${p.model || ""}` : p.model || "",
    category: p.category?.name || "-",
    location: p.locations?.[0]?.location?.name || "-",
    openingStock: p.openingStock || 0,
    newStock: p.newStock || 0,
    availableStock: p.instock || 0,
    consumed: p.consumptionRecords?.reduce((sum, r) => sum + r.quantity, 0) || 0,
    minStock: p.minstock || 0,
    inOperation: p.inOperation || 0,
  }));

  const consumedRecords = products.flatMap(p =>
    (p.consumptionRecords || []).map((r, idx) => ({
      productName: p.productName,
      makeModel: p.make ? `${p.make} ${p.model || ""}` : p.model || "",
      location: p.locations?.[0]?.location?.name || "-",
      quantity: r.quantity,
      cost: p.cost || 0,
      consumedAt: r.usedAtLocation?.name || "-",
      consumedBy: r.consumedBy?.name || "-",
      date: r.date,
      purpose: r.remarks || "-",
      serialNo: idx + 1,
    }))
  );

  const receivedRecords = products.flatMap(p =>
    (p.receivedRecords || []).map((r, idx) => ({
      productName: p.productName,
      makeModel: p.make ? `${p.make} ${p.model || ""}` : p.model || "",
      location: p.locations?.[0]?.location?.name || "-",
      cost: p.cost || 0,
      quantity: r.quantity,
      receivedDetails: r.receivedDetails || [],
      stockPage: r.stockPage,
      serialNo: idx + 1,
    }))
  );

  /*** Apply Filters ***/
  const filteredStock = stockRecords.filter(r => 
    (!filters.product || r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
    (!filters.location || r.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  const filteredConsumed = consumedRecords.filter(r =>
    (!filters.product || r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
    (!filters.location || r.consumedAt.toLowerCase().includes(filters.location.toLowerCase())) &&
    (!filters.staff || r.consumedBy.toLowerCase().includes(filters.staff.toLowerCase()))
  );

  const filteredReceived = receivedRecords.filter(r =>
    (!filters.product || r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
    (!filters.location || r.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  /*** Tabs ***/
  const tabs = [
    { id: "stock", label: "Inventory Stock" },
    { id: "consumed", label: "Consumed Report" },
    { id: "received", label: "Received Report" },
  ];

  /*** Export Functions ***/
  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPDF = (columns, data, title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.autoTable({
      startY: 20,
      head: [columns],
      body: data.map(row => columns.map(col => row[col] || "-")),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 100, 255] },
      theme: "grid",
    });
    doc.save(`${title}.pdf`);
  };

  /*** Table Rendering ***/
  const renderStockTable = () => (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => exportToExcel(filteredStock, "Inventory_Stock")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >Export Excel</button>
        <button
          onClick={() =>
            exportToPDF(
              ["Product", "Make/Model No", "Category", "Location", "Opening Stock", "Consumed", "New Stock", "Available Stock", "Quantity in Operation", "Minimum Stock", "Qty to be Indented"],
              filteredStock.map(r => ({
                Product: r.productName,
                "Make/Model No": r.makeModel,
                Category: r.category,
                Location: r.location,
                "Opening Stock": r.openingStock,
                Consumed: r.consumed,
                "New Stock": r.newStock,
                "Available Stock": r.availableStock,
                "Quantity in Operation": r.inOperation,
                "Minimum Stock": r.minStock,
                "Qty to be Indented": Math.max(0, r.minStock - r.availableStock),
              })),
              "Inventory Stock"
            )
          }
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >Export PDF</button>
      </div>
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Make/Model No</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Opening Stock</th>
            <th className="border px-2 py-1">Consumed</th>
            <th className="border px-2 py-1">New Stock</th>
            <th className="border px-2 py-1">Available Stock</th>
            <th className="border px-2 py-1">Quantity in Operation</th>
            <th className="border px-2 py-1">Minimum Stock</th>
            <th className="border px-2 py-1">Qty to be Indented</th>
          </tr>
        </thead>
        <tbody>
          {filteredStock.map((r, idx) => (
            <tr key={idx} className="text-center hover:bg-gray-50">
              <td className="border px-2 py-1">{r.productName}</td>
              <td className="border px-2 py-1">{r.makeModel}</td>
              <td className="border px-2 py-1">{r.category}</td>
              <td className="border px-2 py-1">{r.location}</td>
              <td className="border px-2 py-1">{r.openingStock}</td>
              <td className="border px-2 py-1">{r.consumed}</td>
              <td className="border px-2 py-1">{r.newStock}</td>
              <td className="border px-2 py-1">{r.availableStock}</td>
              <td className="border px-2 py-1">{r.inOperation}</td>
              <td className="border px-2 py-1">{r.minStock}</td>
              <td className="border px-2 py-1">{Math.max(0, r.minStock - r.availableStock)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderConsumedTable = () => (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => exportToExcel(filteredConsumed, "Consumed_Report")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >Export Excel</button>
        <button
          onClick={() =>
            exportToPDF(
              ["Total Item Consumed", "Total Cost", "Cost of Each Item", "Item Description", "Make/Model No", "Location", "Consumed at", "Consumed By", "Consumed Date", "Purpose", "S.No"],
              filteredConsumed.map(r => ({
                "Total Item Consumed": r.quantity,
                "Total Cost": r.cost,
                "Cost of Each Item": r.quantity ? (r.cost / r.quantity).toFixed(2) : 0,
                "Item Description": r.productName,
                "Make/Model No": r.makeModel,
                Location: r.location,
                "Consumed at": r.consumedAt,
                "Consumed By": r.consumedBy,
                "Consumed Date": new Date(r.date).toLocaleDateString(),
                Purpose: r.purpose,
                "S.No": r.serialNo
              })),
              "Consumed Report"
            )
          }
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >Export PDF</button>
      </div>
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Total Item Consumed</th>
            <th className="border px-2 py-1">Total Cost</th>
            <th className="border px-2 py-1">Cost of Each Item</th>
            <th className="border px-2 py-1">Item Description</th>
            <th className="border px-2 py-1">Make/Model No</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Consumed at</th>
            <th className="border px-2 py-1">Consumed By</th>
            <th className="border px-2 py-1">Consumed Date</th>
            <th className="border px-2 py-1">Purpose</th>
            <th className="border px-2 py-1">S.No</th>
          </tr>
        </thead>
        <tbody>
          {filteredConsumed.map((r, idx) => {
            const costPerItem = r.quantity ? r.cost / r.quantity : 0;
            return (
              <tr key={idx} className="text-center hover:bg-gray-50">
                <td className="border px-2 py-1">{r.quantity}</td>
                <td className="border px-2 py-1">₹ {r.cost.toLocaleString()}</td>
                <td className="border px-2 py-1">₹ {costPerItem.toFixed(2)}</td>
                <td className="border px-2 py-1">{r.productName}</td>
                <td className="border px-2 py-1">{r.makeModel}</td>
                <td className="border px-2 py-1">{r.location}</td>
                <td className="border px-2 py-1">{r.consumedAt}</td>
                <td className="border px-2 py-1">{r.consumedBy}</td>
                <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
                <td className="border px-2 py-1">{r.purpose}</td>
                <td className="border px-2 py-1">{r.serialNo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderReceivedTable = () => (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => exportToExcel(filteredReceived, "Received_Report")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >Export Excel</button>
        <button
          onClick={() =>
            exportToPDF(
              ["Total Item Received", "Total Cost", "Cost of Each Item", "Item Description", "Make/Model No", "Location", "Stock Page", "Received Details", "S.No"],
              filteredReceived.map(r => ({
                "Total Item Received": r.quantity,
                "Total Cost": r.cost,
                "Cost of Each Item": r.quantity ? (r.cost / r.quantity).toFixed(2) : 0,
                "Item Description": r.productName,
                "Make/Model No": r.makeModel,
                Location: r.location,
                "Stock Page": r.stockPage || "-",
                "Received Details": r.receivedDetails.map(rd => `MIRV Cleared on: ${rd.clearedDate || "-"}, Indentor: ${rd.indentor || "-"}, PO: ${rd.poNo || "-"}, Purpose: ${rd.purpose || "-"}, S.No: ${rd.serialNo || "-"}`).join(" | "),
                "S.No": r.serialNo
              })),
              "Received Report"
            )
          }
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >Export PDF</button>
      </div>
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Total Item Received</th>
            <th className="border px-2 py-1">Total Cost</th>
            <th className="border px-2 py-1">Cost of Each Item</th>
            <th className="border px-2 py-1">Item Description</th>
            <th className="border px-2 py-1">Make/Model No</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Stock Page</th>
            <th className="border px-2 py-1">Received Details</th>
            <th className="border px-2 py-1">S.No</th>
          </tr>
        </thead>
        <tbody>
          {filteredReceived.map((r, idx) => {
            const costPerItem = r.quantity ? r.cost / r.quantity : 0;
            return (
              <tr key={idx} className="text-center hover:bg-gray-50 align-top">
                <td className="border px-2 py-1">{r.quantity}</td>
                <td className="border px-2 py-1">₹ {r.cost.toLocaleString()}</td>
                <td className="border px-2 py-1">₹ {costPerItem.toFixed(2)}</td>
                <td className="border px-2 py-1">{r.productName}</td>
                <td className="border px-2 py-1">{r.makeModel}</td>
                <td className="border px-2 py-1">{r.location}</td>
                <td className="border px-2 py-1">{r.stockPage || "-"}</td>
                <td className="border px-2 py-1 text-left">
                  {r.receivedDetails.map((rec, i) => (
                    <div key={i} className="mb-1 border-b border-gray-200 pb-1 text-xs">
                      <div>MIRV Cleared on: {rec.clearedDate || "-"}</div>
                      <div>Indentor: {rec.indentor || "-"}</div>
                      <div>PO No: {rec.poNo || "-"}</div>
                      <div>Purpose: {rec.purpose || "-"}</div>
                      <div>S.No: {rec.serialNo || "-"}</div>
                    </div>
                  ))}
                </td>
                <td className="border px-2 py-1">{r.serialNo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
        {activeTab === "consumed" && (
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
