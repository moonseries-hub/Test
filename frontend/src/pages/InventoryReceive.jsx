import React, { useState } from "react";

export default function InventoryReceive() {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    manufacturer: "",
    model: "",
    serial: "",
    specs: "",
    quantity: "",
    date: "",
    cost: "",
    po: "",
    mirv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Inventory Received Recorded!");
    console.log(formData);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Receive Inventory</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {[
          { name: "category", placeholder: "Item Category" },
          { name: "subcategory", placeholder: "Item Subcategory" },
          { name: "manufacturer", placeholder: "Manufacturer/Brand" },
          { name: "model", placeholder: "Model Number" },
          { name: "serial", placeholder: "Serial Number" },
          { name: "specs", placeholder: "Specifications" },
          { name: "quantity", placeholder: "Quantity Received", type: "number" },
          { name: "date", placeholder: "Date of Receipt", type: "date" },
          { name: "cost", placeholder: "Total Cost", type: "number" },
          { name: "po", placeholder: "PO/Indent Details" },
          { name: "mirv", placeholder: "MIRV Clearance Date", type: "date" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700 col-span-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
