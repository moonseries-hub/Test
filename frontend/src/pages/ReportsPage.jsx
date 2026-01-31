
// src/pages/ReportPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_PO = "http://localhost:5000/api/po";

export default function ReportPage() {
  const [products, setProducts] = useState([]);
  const [poData, setPoData] = useState([]);
  const [activeTab, setActiveTab] = useState("stock");
  const [filters, setFilters] = useState({
    product: "",
    location: "",
    staff: "",
    startDate: "",
    endDate: "",
    poStatus: "all",
  });

  useEffect(() => {
    fetchProducts();
    fetchPOData();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchPOData = async () => {
    try {
      const res = await axios.get(API_PO);
      setPoData(res.data);
    } catch (err) {
      console.error("Error fetching PO data:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      product: "",
      location: "",
      staff: "",
      startDate: "",
      endDate: "",
      poStatus: "all",
    });
  };

  const filterByDateRange = (recordDate) => {
    if (!recordDate) return true;
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const date = new Date(recordDate);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  };

  /*** PO History Records ***/
  const poHistoryRecords = useMemo(() => {
    return products
      .filter((p) => poData.some((po) => po.productName === p.productName))
      .map((p) => {
        const poRecord = poData.find((po) => po.productName === p.productName);
        return {
          productName: p.productName || "-",
          category: p.category?.name || "-",
          make: p.make || "-",
          model: p.model || "-",
          expectedDate: poRecord?.expectedDate
            ? new Date(poRecord.expectedDate).toLocaleDateString()
            : "-",
          productUpdatingDate: poRecord?.productUpdatingDate
            ? new Date(poRecord.productUpdatingDate).toLocaleDateString()
            : "-",
          cleared: poRecord?.isConsumed ? "Cleared" : "Not Cleared",
        };
      });
  }, [products, poData]);

  const filteredPOHistory = poHistoryRecords.filter(
    (r) =>
      (!filters.product ||
        r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
      filterByDateRange(r.productUpdatingDate) &&
      (filters.poStatus === "all"
        ? true
        : filters.poStatus === "cleared"
        ? r.cleared === "Cleared"
        : r.cleared === "Not Cleared")
  );

  /*** Stock Records ***/
  const stockRecords = products.map((p) => {
    const totalInstock = p.instock || 0;
    const openingStock = p.openingStock || 0;
    const consumed =
      p.consumptionRecords?.reduce((a, c) => a + (c.quantity || 0), 0) || 0;
    const newStock = totalInstock - openingStock;
    const availableStock = totalInstock - consumed;

    return {
      date: p.createdAt || new Date(),
      productName: p.productName || "-",
      makeModel: p.make ? `${p.make} ${p.model || ""}` : p.model || "-",
      category: p.category?.name || "-",
      location: p.locations?.[0]?.location?.name || "-",
      openingStock,
      newStock,
      consumed,
      availableStock,
      minStock: p.minstock || p.category?.minStock || 0,
      inOperation: p.inOperation || 0,
    };
  });

  const filteredStock = stockRecords.filter(
    (r) =>
      (!filters.product ||
        r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
      (!filters.location ||
        r.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      filterByDateRange(r.date)
  );

  /*** Consumed Records ***/
  const consumedRecords = products.flatMap((p) =>
    (p.consumptionRecords || []).map((r, idx) => ({
      date: r.date || new Date(),
      productName: p.productName || "-",
      makeModel: p.make ? `${p.make} ${p.model || ""}` : p.model || "-",
      quantity: r.quantity || 0,
      consumedAt: r.usedAtLocation?.name || "-",
      consumedBy: r.consumedByName || "-",
      purpose: r.remarks || "-",
    }))
  );

  const filteredConsumed = consumedRecords.filter(
    (r) =>
      (!filters.product ||
        r.productName.toLowerCase().includes(filters.product.toLowerCase())) &&
      (!filters.staff ||
        r.consumedBy.toLowerCase().includes(filters.staff.toLowerCase())) &&
      filterByDateRange(r.date)
  );

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

    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: data.map((row) => columns.map((col) => row[col] ?? "-")),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 100, 255] },
      theme: "grid",
    });

    doc.save(`${title}.pdf`);
  };

  /*** Render Tables ***/
  const renderStockTable = () => (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() =>
            exportToExcel(
              filteredStock.map((r) => ({
                Date: new Date(r.date).toLocaleDateString(),
                Product: r.productName,
                "Make/Model": r.makeModel,
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
              "Inventory_Stock"
            )
          }
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export Excel
        </button>
        <button
          onClick={() =>
            exportToPDF(
              [
                "Date",
                "Product",
                "Make/Model",
                "Category",
                "Location",
                "Opening Stock",
                "Consumed",
                "New Stock",
                "Available Stock",
                "Quantity in Operation",
                "Minimum Stock",
                "Qty to be Indented",
              ],
              filteredStock.map((r) => ({
                Date: new Date(r.date).toLocaleDateString(),
                Product: r.productName,
                "Make/Model": r.makeModel,
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
        >
          Export PDF
        </button>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Make/Model</th>
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
              <td className="border px-2 py-1">
                {new Date(r.date).toLocaleDateString()}
              </td>
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
              <td className="border px-2 py-1">
                {Math.max(0, r.minStock - r.availableStock)}
              </td>
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
          onClick={() =>
            exportToExcel(
              filteredConsumed.map((r) => ({
                "Consumed Date": new Date(r.date).toLocaleDateString(),
                Product: r.productName,
                "Make/Model": r.makeModel,
                Quantity: r.quantity,
                "Consumed At": r.consumedAt,
                "Consumed By": r.consumedBy,
                Purpose: r.purpose,
              })),
              "Consumed_Products"
            )
          }
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export Excel
        </button>
        <button
          onClick={() =>
            exportToPDF(
              [
                "Consumed Date",
                "Product",
                "Make/Model",
                "Quantity",
                "Consumed At",
                "Consumed By",
                "Purpose",
              ],
              filteredConsumed.map((r) => ({
                "Consumed Date": new Date(r.date).toLocaleDateString(),
                Product: r.productName,
                "Make/Model": r.makeModel,
                Quantity: r.quantity,
                "Consumed At": r.consumedAt,
                "Consumed By": r.consumedBy,
                Purpose: r.purpose,
              })),
              "Consumed Report"
            )
          }
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Export PDF
        </button>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Consumed Date</th>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Make/Model</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Consumed At</th>
            <th className="border px-2 py-1">Consumed By</th>
            <th className="border px-2 py-1">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {filteredConsumed.map((r, idx) => (
            <tr key={idx} className="text-center hover:bg-gray-50">
              <td className="border px-2 py-1">
                {new Date(r.date).toLocaleDateString()}
              </td>
              <td className="border px-2 py-1">{r.productName}</td>
              <td className="border px-2 py-1">{r.makeModel}</td>
              <td className="border px-2 py-1">{r.quantity}</td>
              <td className="border px-2 py-1">{r.consumedAt}</td>
              <td className="border px-2 py-1">{r.consumedBy}</td>
              <td className="border px-2 py-1">{r.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPOHistoryTable = () => (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() =>
            exportToExcel(
              filteredPOHistory.map((r) => ({
                Product: r.productName,
                Category: r.category,
                Make: r.make,
                Model: r.model,
                "Expected Date": r.expectedDate,
                "Updated Date": r.productUpdatingDate,
                "Cleared/Not": r.cleared,
              })),
              "PO_History"
            )
          }
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export Excel
        </button>
        <button
          onClick={() =>
            exportToPDF(
              [
                "Product",
                "Category",
                "Make",
                "Model",
                "Expected Date",
                "Updated Date",
                "Cleared/Not",
              ],
              filteredPOHistory.map((r) => ({
                Product: r.productName,
                Category: r.category,
                Make: r.make,
                Model: r.model,
                "Expected Date": r.expectedDate,
                "Updated Date": r.productUpdatingDate,
                "Cleared/Not": r.cleared,
              })),
              "PO History"
            )
          }
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Export PDF
        </button>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Make</th>
            <th className="border px-2 py-1">Model</th>
            <th className="border px-2 py-1">Expected Date</th>
            <th className="border px-2 py-1">Updated Date</th>
            <th className="border px-2 py-1">Cleared/Not</th>
          </tr>
        </thead>
        <tbody>
          {filteredPOHistory.map((r, idx) => (
            <tr key={idx} className="text-center hover:bg-gray-50">
              <td className="border px-2 py-1">{r.productName}</td>
              <td className="border px-2 py-1">{r.category}</td>
              <td className="border px-2 py-1">{r.make}</td>
              <td className="border px-2 py-1">{r.model}</td>
              <td className="border px-2 py-1">{r.expectedDate}</td>
              <td className="border px-2 py-1">{r.productUpdatingDate}</td>
              <td className="border px-2 py-1">{r.cleared}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Inventory Reports Dashboard
      </h1>

      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        <button
          onClick={() => setActiveTab("stock")}
          className={`px-4 py-2 rounded ${
            activeTab === "stock"
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Inventory Stock
        </button>
        <button
          onClick={() => setActiveTab("consumed")}
          className={`px-4 py-2 rounded ${
            activeTab === "consumed"
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Consumed Report
        </button>
        <button
          onClick={() => setActiveTab("pohistory")}
          className={`px-4 py-2 rounded ${
            activeTab === "pohistory"
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          PO in Pipeline Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center items-center">
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
        <input
          name="staff"
          placeholder="Staff"
          value={filters.staff}
          onChange={handleFilterChange}
          className="p-2 border rounded w-40"
        />
        <input
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 border rounded w-40"
        />
        <input
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 border rounded w-40"
        />
        {activeTab === "pohistory" && (
          <select
            name="poStatus"
            value={filters.poStatus}
            onChange={handleFilterChange}
            className="p-2 border rounded w-40"
          >
            <option value="all">All</option>
            <option value="cleared">Cleared</option>
            <option value="notCleared">Not Cleared</option>
          </select>
        )}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
        {activeTab === "stock" && renderStockTable()}
        {activeTab === "consumed" && renderConsumedTable()}
        {activeTab === "pohistory" && renderPOHistoryTable()}
      </div>
    </div>
  );
}
