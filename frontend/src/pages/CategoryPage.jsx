import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Layers } from "lucide-react";

const API_URL = "http://localhost:5000/api/categories";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const addCategory = async () => {
    if (!newCat.trim()) return; // prevent empty category

    try {
      const payload = {
        name: newCat,
        make: newMake || undefined,
        model: newModel || undefined,
      };

      const res = await axios.post(API_URL, payload);
      setCategories([...categories, res.data]);

      // Clear input fields
      setNewCat("");
      setNewMake("");
      setNewModel("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      // Confirm deletion with user
      if (!window.confirm("Are you sure you want to delete this category?")) return;

      await axios.delete(`${API_URL}/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete category. Make sure the server is running and the ID exists.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Layers className="w-7 h-7 text-orange-500" />
        Category Management
      </h1>

      {/* Add Category */}
      <div className="mb-6 bg-white p-4 rounded-2xl shadow-md space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Add Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="New category"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="text"
            placeholder="Make (optional)"
            value={newMake}
            onChange={(e) => setNewMake(e.target.value)}
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="text"
            placeholder="Model (optional)"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 flex justify-between items-center"
            >
              <div>
                <span className="text-lg font-semibold text-gray-800">{cat.name}</span>
                {cat.make && <span className="text-sm text-gray-500"> — {cat.make}</span>}
                {cat.model && <span className="text-sm text-gray-400"> ({cat.model})</span>}
              </div>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
