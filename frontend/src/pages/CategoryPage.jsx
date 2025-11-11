
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Layers, Edit3, Check, X, AlertCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/categories";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    make: "",
    model: "",
    minStock: "",
  });
  const [nameExists, setNameExists] = useState(false);
  const [addingMake, setAddingMake] = useState({});
  const [addingModel, setAddingModel] = useState({});
  const [editingStock, setEditingStock] = useState(null);
  const [tempStock, setTempStock] = useState("");
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from DB
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Real-time name validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });

    if (name === "name") {
      const exists = categories.some(
        (c) => c.name.toLowerCase() === value.trim().toLowerCase()
      );
      setNameExists(exists);
    }
  };

  // Add category
  const addCategory = async () => {
    if (
      !newCategory.name.trim() ||
      !newCategory.make.trim() ||
      !newCategory.model.trim()
    )
      return toast.error("All fields are required");

    if (newCategory.minStock < 0 || isNaN(newCategory.minStock))
      return toast.error("Min stock must be a non-negative number");

    if (nameExists)
      return toast.error("This category already exists, try another name");

    try {
      const payload = {
        name: newCategory.name.trim(),
        makes: [newCategory.make.trim()],
        models: [newCategory.model.trim()],
        minStock: Number(newCategory.minStock) || 0,
      };
      const res = await axios.post(API_URL, payload);
      setCategories([res.data, ...categories]);
      setNewCategory({ name: "", make: "", model: "", minStock: "" });
      setNameExists(false);
      toast.success("✅ Category added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to add category");
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_URL}`/`${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success("🗑 Category deleted");
    } catch (err) {
      toast.error("❌ Failed to delete category");
    }
  };

  // Make/Model CRUD
  const addMakeToCategory = async (catId) => {
    const make = addingMake[catId];
    if (!make?.trim()) return toast.error("Enter make");
    try {
      const res = await axios.patch(`${API_URL}`/`${catId}/add-make`, {
        make: make.trim(),
      });
      setCategories(
        categories.map((c) =>
          c._id === catId ? { ...c, makes: res.data.makes } : c
        )
      );
      setAddingMake({ ...addingMake, [catId]: "" });
      toast.success("✅ Make added successfully!");
    } catch {
      toast.error("❌ Failed to add make");
    }
  };

  const addModelToCategory = async (catId) => {
    const model = addingModel[catId];
    if (!model?.trim()) return toast.error("Enter model");
    try {
      const res = await axios.patch(`${API_URL}`/`${catId}/add-model`, {
        model: model.trim(),
      });
      setCategories(
        categories.map((c) =>
          c._id === catId ? { ...c, models: res.data.models } : c
        )
      );
      setAddingModel({ ...addingModel, [catId]: "" });
      toast.success("✅ Model added successfully!");
    } catch {
      toast.error("❌ Failed to add model");
    }
  };

  const removeMakeFromCategory = async (catId, make) => {
    try {
      const res = await axios.patch(`${API_URL}`/`${catId}/remove-make`, { make });
      setCategories(
        categories.map((c) =>
          c._id === catId ? { ...c, makes: res.data.makes } : c
        )
      );
      toast.success("🗑 Make removed");
    } catch {
      toast.error("❌ Failed to remove make");
    }
  };

  const removeModelFromCategory = async (catId, model) => {
    try {
      const res = await axios.patch(`${API_URL}`/`${catId}/remove-model`, {
        model,
      });
      setCategories(
        categories.map((c) =>
          c._id === catId ? { ...c, models: res.data.models } : c
        )
      );
      toast.success("🗑 Model removed");
    } catch {
      toast.error("❌ Failed to remove model");
    }
  };

  // Min Stock Editing
  const handleStockInput = (value) => {
    setTempStock(value);
    if (value === "" || Number(value) < 0) {
      setStockError("Stock cannot be negative or empty");
    } else {
      setStockError("");
    }
  };

  const saveMinStock = async (catId) => {
    if (tempStock === "" || Number(tempStock) < 0) {
      setStockError("Stock cannot be negative or empty");
      return;
    }
    try {
      const res = await axios.patch(`${API_URL}`/`${catId}/updateMinStock`, {
        minStock: Number(tempStock),
      });
      setCategories(
        categories.map((c) =>
          c._id === catId ? res.data.category : c
        )
      );
      setEditingStock(null);
      toast.success("📦 Minimum stock updated");
    } catch {
      toast.error("❌ Failed to update stock");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Layers className="w-7 h-7 text-orange-500" /> Category Management
      </h1>

      {/* Add Category */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Add New Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Category name"
              value={newCategory.name}
              onChange={handleChange}
              className={`p-2 border rounded-lg w-full focus:ring-2 outline-none ${
                nameExists
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-orange-400"
              }`}
            />
            {nameExists && (
              <div className="absolute text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> Already exists
              </div>
            )}
          </div>

          <input
            type="text"
            name="make"
            placeholder="Make"
            value={newCategory.make}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={newCategory.model}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="number"
            name="minStock"
            placeholder="Min Stock"
            min="0"
            value={newCategory.minStock}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition mt-2"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 transition hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {cat.name}
                </h3>

                {/* Min Stock */}
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <strong>Min Stock:</strong>
                  {editingStock === cat._id ? (
                    <span className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={tempStock}
                        onChange={(e) => handleStockInput(e.target.value)}
                        className={`border rounded px-2 py-1 w-20 ${
                          stockError ? "border-red-500" : ""
                        }`}
                      />
                      {stockError && (
                        <span className="text-red-500 text-xs">{stockError}</span>
                      )}
                      <button
                        onClick={() => saveMinStock(cat._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingStock(null);
                          setStockError("");
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {cat.minStock ?? 0}
                      <button
                        onClick={() => {
                          setEditingStock(cat._id);
                          setTempStock(cat.minStock ?? 0);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit3 size={16} />
                      </button>
                    </span>
                  )}
                </p>

                {/* Makes */}
                <div className="flex flex-wrap gap-2">
                  {cat.makes.map((m) => (
                    <span
                      key={m}
                      className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {m}
                      <button
                        onClick={() => removeMakeFromCategory(cat._id, m)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Add Make"
                    value={addingMake[cat._id] || ""}
                    onChange={(e) =>
                      setAddingMake({ ...addingMake, [cat._id]: e.target.value })
                    }
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <button
                    onClick={() => addMakeToCategory(cat._id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                  >
                    ➕
                  </button>
                </div>

                {/* Models */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {cat.models.map((m) => (
                    <span
                      key={m}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {m}
                      <button
                        onClick={() => removeModelFromCategory(cat._id, m)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Add Model"
                    value={addingModel[cat._id] || ""}
                    onChange={(e) =>
                      setAddingModel({ ...addingModel, [cat._id]: e.target.value })
                    }
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <button
                    onClick={() => addModelToCategory(cat._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    ➕
                  </button>
                </div>
              </div>

              <button
                onClick={() => deleteCategory(cat._id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium ml-4"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
 </div>
);
}