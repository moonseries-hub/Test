// src/pages/ReportPage.jsx
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { Download } from "lucide-react";

const initialProducts = [
  { id: 101, name: "RISAT-2B", category: "Satellite", subCategory: "Earth Observation", make: "ISRO", vendor: "ISRO", stock: 2, price: 5000000, warranty: "5 years" },
  { id: 102, name: "Cartosat-3", category: "Satellite", subCategory: "Cartography", make: "ISRO", vendor: "ISRO", stock: 1, price: 7000000, warranty: "5 years" },
];

const initialConsumedStock = [
  { productId: 101, person: "Dr. Sharma", location: "Bangalore", quantity: 1, date: "2025-09-01", reason: "Testing" },
  { productId: 102, person: "Dr. Mehta", location: "Hyderabad", quantity: 1, date: "2025-09-03", reason: "Calibration" },
];

const initialReceivedStock = [
  { productId: 101, quantity: 2, vendor: "ISRO", date: "2025-08-20", price: 5000000, warranty: "5 years" },
  { productId: 102, quantity: 1, vendor: "ISRO", date: "2025-08-25", price: 7000000, warranty: "5 years" },
];

export default function ReportPage() {
  const [filters, setFilters] = useState({ startDate: "", endDate: "", category: "", location: "" });
  const [dropdownOpen, setDropdownOpen] = useState({}); // track which dropdown is open

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filter data
  const filteredConsumed = initialConsumedStock.filter(c =>
    (!filters.location || c.location === filters.location) &&
    (!filters.startDate || new Date(c.date) >= new Date(filters.startDate)) &&
    (!filters.endDate || new Date(c.date) <= new Date(filters.endDate))
  );

  const filteredReceived = initialReceivedStock.filter(r =>
    (!filters.startDate || new Date(r.date) >= new Date(filters.startDate)) &&
    (!filters.endDate || new Date(r.date) <= new Date(filters.endDate))
  );

  // Export functions
  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportPDF = (data, columns, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    doc.autoTable({
      head: [columns],
      body: data.map(d => columns.map(col => d[col])),
      startY: 20,
    });
    doc.save(`${title}.pdf`);
  };

  const renderExportButton = (sectionName, data, columns) => (
    <div className="relative inline-block text-left ml-auto">
      <button
        onClick={() => setDropdownOpen({ ...dropdownOpen, [sectionName]: !dropdownOpen[sectionName] })}
        className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
      >
        <Download size={16} />
        Export
      </button>
      {dropdownOpen[sectionName] && (
        <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10">
          <button
            className="block w-full text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => exportCSV(data, sectionName)}
          >
            Excel (CSV)
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => exportPDF(data, Object.keys(data[0] || {}), sectionName)}
          >
            PDF
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-bold text-lg mb-4">Inventory Reports</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border p-2 rounded" />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border p-2 rounded" />
        <input type="text" name="category" value={filters.category} onChange={handleFilterChange} placeholder="Category" className="border p-2 rounded" />
        <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" className="border p-2 rounded" />
      </div>

      {/* Current Stock */}
      <div className="bg-white p-4 rounded-lg shadow relative">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-lg">Current Stock</h3>
          {renderExportButton("Current Stock", initialProducts, ["id","name","category","subCategory","make","vendor","stock","price","warranty"])}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Category</th>
                <th className="border px-2 py-1">Subcategory</th>
                <th className="border px-2 py-1">Make</th>
                <th className="border px-2 py-1">Vendor</th>
                <th className="border px-2 py-1">Stock</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Warranty</th>
              </tr>
            </thead>
            <tbody>
              {initialProducts.map(p => (
                <tr key={p.id} className="text-center">
                  <td className="border px-2 py-1">{p.id}</td>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1">{p.category}</td>
                  <td className="border px-2 py-1">{p.subCategory}</td>
                  <td className="border px-2 py-1">{p.make}</td>
                  <td className="border px-2 py-1">{p.vendor}</td>
                  <td className="border px-2 py-1">{p.stock}</td>
                  <td className="border px-2 py-1">{p.price.toLocaleString()}</td>
                  <td className="border px-2 py-1">{p.warranty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consumed Stock */}
      <div className="bg-white p-4 rounded-lg shadow relative">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-lg">Consumed Stock</h3>
          {renderExportButton("Consumed Stock", filteredConsumed, ["productId","person","location","quantity","date","reason"])}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Product ID</th>
                <th className="border px-2 py-1">Person</th>
                <th className="border px-2 py-1">Location</th>
                <th className="border px-2 py-1">Quantity</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsumed.map((c, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border px-2 py-1">{c.productId}</td>
                  <td className="border px-2 py-1">{c.person}</td>
                  <td className="border px-2 py-1">{c.location}</td>
                  <td className="border px-2 py-1">{c.quantity}</td>
                  <td className="border px-2 py-1">{c.date}</td>
                  <td className="border px-2 py-1">{c.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Received Stock */}
      <div className="bg-white p-4 rounded-lg shadow relative">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-lg">Received Stock</h3>
          {renderExportButton("Received Stock", filteredReceived, ["productId","quantity","vendor","date","price","warranty"])}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Product ID</th>
                <th className="border px-2 py-1">Quantity</th>
                <th className="border px-2 py-1">Vendor</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Warranty</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceived.map((r, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border px-2 py-1">{r.productId}</td>
                  <td className="border px-2 py-1">{r.quantity}</td>
                  <td className="border px-2 py-1">{r.vendor}</td>
                  <td className="border px-2 py-1">{r.date}</td>
                  <td className="border px-2 py-1">{r.price.toLocaleString()}</td>
                  <td className="border px-2 py-1">{r.warranty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
