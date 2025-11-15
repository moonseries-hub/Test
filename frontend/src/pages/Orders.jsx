import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PRODUCTS = "http://localhost:5000/api/products";

export default function OrdersPage() {
  const [products, setProducts] = useState([]);
  const [locationsMap, setLocationsMap] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      const productsData = res.data;

      // Build a map of locationId -> locationName for fast lookup
      const map = {};
      productsData.forEach((p) => {
        (p.consumptionRecords || []).forEach((rec) => {
          if (rec.usedAtLocation?._id) {
            map[rec.usedAtLocation._id] = rec.usedAtLocation.name;
          }
        });
      });

      setLocationsMap(map);
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products");
    }
  };

  // Flatten all consumption records with product info
  const consumptionRecords = products.flatMap((product) =>
    (product.consumptionRecords || []).map((record) => ({
      productName: product.productName,
      categoryName: product.category?.name || "-",
      quantity: record.quantity,
      usedAt: record.usedAtLocation?._id ? locationsMap[record.usedAtLocation._id] || "-" : "-",
      date: record.date ? new Date(record.date) : null,
      remarks: record.remarks || "-",
    }))
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Consumption History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Product</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Used At</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {consumptionRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No consumption records found.
                </td>
              </tr>
            ) : (
              consumptionRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{rec.productName}</td>
                  <td className="border px-4 py-2">{rec.categoryName}</td>
                  <td className="border px-4 py-2">{rec.quantity}</td>
                  <td className="border px-4 py-2">{rec.usedAt}</td>
                  <td className="border px-4 py-2">
                    {rec.date ? rec.date.toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-4 py-2">{rec.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
