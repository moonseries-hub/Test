import React, { useState } from "react";

export default function AddProduct() {
  // Mock categories
  const categories = [
    { id: "cat1", name: "Electronics" },
    { id: "cat2", name: "Mechanical" },
    { id: "cat3", name: "Chemicals" },
  ];

  // Mock subcategories (keyed by category)
  const subCategoriesMap = {
    cat1: [
      { id: "sub1", name: "ICs" },
      { id: "sub2", name: "Communication Equipments" },
    ],
    cat2: [
      { id: "sub3", name: "Fasteners" },
      { id: "sub4", name: "Bearings" },
    ],
    cat3: [
      { id: "sub5", name: "Acids" },
      { id: "sub6", name: "Solvents" },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mock Submit:", formData);
    alert("✅ Product added (mock mode)!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Add Product</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleChange(e);
            }}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block text-sm font-medium">Sub Category</label>
          <select
            name="subCategory"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
            disabled={!selectedCategory}
          >
            <option value="">Select sub category</option>
            {selectedCategory &&
              subCategoriesMap[selectedCategory].map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>

        {/* Make */}
        <div>
          <label className="block text-sm font-medium">Make</label>
          <input
            type="text"
            name="make"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium">Model</label>
          <input
            type="text"
            name="model"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium">Specifications</label>
          <textarea
            name="specifications"
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium">Serial No</label>
          <input
            type="text"
            name="serialNumber"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
          />
        </div>

        {/* Quantity Received */}
        <div>
          <label className="block text-sm font-medium">Quantity Received</label>
          <input
            type="number"
            name="quantity"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Receipt */}
        <div>
          <label className="block text-sm font-medium">Date of Receipt</label>
          <input
            type="date"
            name="dateOfReceipt"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-medium">Cost (with Tax)</label>
          <input
            type="number"
            name="cost"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Indent / PO */}
        <div>
          <label className="block text-sm font-medium">Indent / PO</label>
          <input
            type="text"
            name="po"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
          />
        </div>

        {/* MIRV Cleared Date */}
        <div>
          <label className="block text-sm font-medium">MIRV Cleared Date</label>
          <input
            type="date"
            name="mirvDate"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
    