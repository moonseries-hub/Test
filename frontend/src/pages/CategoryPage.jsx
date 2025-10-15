import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Layers } from "lucide-react";

const API_URL = "http://localhost:5000/api/categories";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", make: "", model: "" });
  const [addingMake, setAddingMake] = useState({});
  const [addingModel, setAddingModel] = useState({});

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try { const res = await axios.get(API_URL); setCategories(res.data); }
    catch (err) { console.error(err.response?.data || err.message); }
  };

  const handleChange = (e) => setNewCategory({ ...newCategory, [e.target.name]: e.target.value });

  const addCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.make.trim() || !newCategory.model.trim())
      return alert("All fields are required");
    try {
      const payload = { name: newCategory.name.trim(), makes: [newCategory.make.trim()], models: [newCategory.model.trim()] };
      const res = await axios.post(API_URL, payload);
      setCategories([res.data, ...categories]);
      setNewCategory({ name: "", make: "", model: "" });
    } catch (err) { console.error(err.response?.data || err.message); alert("Failed to add category"); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try { await axios.delete(`${API_URL}/${id}`); setCategories(categories.filter((c) => c._id !== id)); }
    catch (err) { console.error(err.response?.data || err.message); alert("Failed to delete category"); }
  };

  const addMakeToCategory = async (catId) => {
    const make = addingMake[catId]; if (!make?.trim()) return alert("Enter make");
    try { const res = await axios.patch(`${API_URL}/${catId}/addMake`, { make: make.trim() });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c))); setAddingMake({ ...addingMake, [catId]: "" });
    } catch (err) { console.error(err.response?.data || err.message); alert("Failed to add make"); }
  };

  const addModelToCategory = async (catId) => {
    const model = addingModel[catId]; if (!model?.trim()) return alert("Enter model");
    try { const res = await axios.patch(`${API_URL}/${catId}/addModel`, { model: model.trim() });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c))); setAddingModel({ ...addingModel, [catId]: "" });
    } catch (err) { console.error(err.response?.data || err.message); alert("Failed to add model"); }
  };

  const removeMakeFromCategory = async (catId, make) => {
    try { const res = await axios.patch(`${API_URL}/${catId}/removeMake`, { make });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c))); 
    } catch (err) { console.error(err.response?.data || err.message); alert("Failed to remove make"); }
  };

  const removeModelFromCategory = async (catId, model) => {
    try { const res = await axios.patch(`${API_URL}/${catId}/removeModel`, { model });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c))); 
    } catch (err) { console.error(err.response?.data || err.message); alert("Failed to remove model"); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Layers className="w-7 h-7 text-orange-500" /> Category Management
      </h1>

      {/* Add Category */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Add New Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" name="name" placeholder="Category name" value={newCategory.name} onChange={handleChange} className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none" />
          <input type="text" name="make" placeholder="Make" value={newCategory.make} onChange={handleChange} className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none" />
          <input type="text" name="model" placeholder="Model" value={newCategory.model} onChange={handleChange} className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none" />
        </div>
        <button onClick={addCategory} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition mt-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>

                {/* Makes */}
                <div className="flex flex-wrap gap-2">
                  {cat.makes.map((m) => (
                    <span key={m} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      {m}
                      <button onClick={() => removeMakeFromCategory(cat._id, m)} className="text-red-500 hover:text-red-700 text-xs">×</button>
                    </span>
                  ))}
                </div>

                {/* Add new make */}
                <div className="flex gap-2 mt-1">
                  <input type="text" placeholder="Add Make" value={addingMake[cat._id] || ""} onChange={(e) => setAddingMake({ ...addingMake, [cat._id]: e.target.value })} className="border rounded px-2 py-1 flex-1" />
                  <button onClick={() => addMakeToCategory(cat._id)} className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">➕</button>
                </div>

                {/* Models */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {cat.models.map((m) => (
                    <span key={m} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      {m}
                      <button onClick={() => removeModelFromCategory(cat._id, m)} className="text-red-500 hover:text-red-700 text-xs">×</button>
                    </span>
                  ))}
                </div>

                {/* Add new model */}
                <div className="flex gap-2 mt-1">
                  <input type="text" placeholder="Add Model" value={addingModel[cat._id] || ""} onChange={(e) => setAddingModel({ ...addingModel, [cat._id]: e.target.value })} className="border rounded px-2 py-1 flex-1" />
                  <button onClick={() => addModelToCategory(cat._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕</button>
                </div>
              </div>

              {/* Delete category */}
              <button onClick={() => deleteCategory(cat._id)} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium ml-4">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
