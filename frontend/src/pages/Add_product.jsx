  import React, { useState } from "react";

  export default function AddProduct() {
    const categories = [
      { id: "cat1", name: "Electronics" },
      { id: "cat2", name: "Mechanical" },
      { id: "cat3", name: "Chemicals" },
    ];

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
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">
          Add New Product
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Sub Category</label>
            <select
              name="subCategory"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Make</label>
            <input
              type="text"
              name="make"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Model */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Specifications */}
          <div className="md:col-span-2 flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Specifications</label>
            <textarea
              name="specifications"
              rows="3"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Serial Number */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Serial No</label>
            <input
              type="text"
              name="serialNumber"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Quantity Received</label>
            <input
              type="number"
              name="quantity"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of Receipt */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Date of Receipt</label>
            <input
              type="date"
              name="dateOfReceipt"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Cost */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Cost (with Tax)</label>
            <input
              type="number"
              name="cost"
              step="0.01"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Indent / PO */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Indent / PO</label>
            <input
              type="text"
              name="po"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* MIRV Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">MIRV Cleared Date</label>
            <input
              type="date"
              name="mirvDate"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"  
            >
              ➕ Add Product
            </button>
          </div>
        </form>
      </div>
    );
  }
