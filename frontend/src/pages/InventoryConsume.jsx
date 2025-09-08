import React, { useState } from "react";

export default function InventoryConsume() {
  const [formData, setFormData] = useState({
    person: "",
    location: "",
    quantity: "",
    date: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Consumption Recorded!");
    console.log(formData);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Record Inventory Consumption</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {[
          { name: "person", placeholder: "Person/Department" },
          { name: "location", placeholder: "Location" },
          { name: "quantity", placeholder: "Quantity Consumed", type: "number" },
          { name: "date", placeholder: "Date of Consumption", type: "date" },
          { name: "reason", placeholder: "Reason for Consumption" },
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
          className="bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700 col-span-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
