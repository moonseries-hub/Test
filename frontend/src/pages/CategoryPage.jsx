// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Plus, Trash2, Layers } from "lucide-react";

const API_URL = "http://localhost:5000/api/categories";

export default function CategoryPage() {
  const { user, loading } = useUser();
  const [role, setRole] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newSubCat, setNewSubCat] = useState("");
  const [newSub, setNewSub] = useState({});

  // Sync role with user context & localStorage
  useEffect(() => {
    if (!loading) {
      if (user?.role) {
        setRole(user.role);
        localStorage.setItem("role", user.role);
      } else {
        const storedRole = localStorage.getItem("role") || "staff";
        setRole(storedRole);
      }
    }
  }, [user, loading]);

  // Fetch categories whenever role is loaded
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (role) fetchCategories();
  }, [role]);

  // Admin CRUD actions
  const addCategory = async () => {
    if (role !== "admin" || !newCat.trim()) return;
    try {
      const payload = { name: newCat };
      if (newSubCat.trim()) payload.subCategories = [{ name: newSubCat.trim() }];
      const token = localStorage.getItem("token"); // or however you store it

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(API_URL, payload, config);
      setCategories([...categories, res.data]);
      setNewCat("");
      setNewSubCat("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const deleteCategory = async (id) => {
    if (role !== "admin") return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const addSubCategory = async (catId) => {
    if (role !== "admin") return;
    const subName = newSub[catId]?.trim();
    if (!subName) return;
    try {
      const res = await axios.post(`${API_URL}/${catId}/sub`, { subName });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c)));
      setNewSub((prev) => ({ ...prev, [catId]: "" }));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const deleteSubCategory = async (catId, subName) => {
    if (role !== "admin") return;
    try {
      const res = await axios.delete(`${API_URL}/${catId}/sub`, { data: { subName } });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c)));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!role) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Layers className="w-7 h-7 text-orange-500" />
        Category Management
      </h1>

      {/* ADMIN VIEW */}
      {role === "admin" && (
        <>
          <div className="mb-6 bg-white p-4 rounded-2xl shadow-md space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">Add Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="New category"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <input
                type="text"
                placeholder="Optional subcategory"
                value={newSubCat}
                onChange={(e) => setNewSubCat(e.target.value)}
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

          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">{cat.name}</span>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>

                  <div className="ml-4 mt-3 space-y-2">
                    {cat.subCategories?.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span>• {sub.name}</span>
                        <button
                          onClick={() => deleteSubCategory(cat._id, sub.name)}
                          className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="New subcategory"
                      value={newSub[cat._id] || ""}
                      onChange={(e) =>
                        setNewSub((prev) => ({ ...prev, [cat._id]: e.target.value }))
                      }
                      className="p-2 border rounded-lg flex-grow focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    <button
                      onClick={() => addSubCategory(cat._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* STAFF VIEW */}
      {role === "staff" && (
        <div className="space-y-4">
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories available.</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <span className="text-lg font-semibold text-gray-800">{cat.name}</span>
                <div className="ml-4 mt-2 space-y-1">
                  {cat.subCategories?.map((sub, idx) => (
                    <p key={idx} className="text-gray-700">
                      • {sub.name}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}

          <p className="text-xs text-gray-400 italic mt-4">
            View-only mode. Contact your admin for modifications.
          </p>
        </div>
      )}
    </div>
  );
}
