import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const API_URL = "http://localhost:5000/api/categories";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newSub, setNewSub] = useState({});
  const { user } = useUser();
  const role = (user && user.role) || localStorage.getItem("role") || "staff";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error fetching categories");
    }
  };

  const addCategory = async () => {
    if (role !== "admin" || !newCat.trim()) return;
    try {
      const res = await axios.post(API_URL, { name: newCat, role });
      setCategories([...categories, res.data]);
      setNewCat("");
    } catch (err) {
      alert(err.response?.data?.error || "Error adding category");
    }
  };

  const addSubCategory = async (catId) => {
    const subName = newSub[catId]?.trim();
    if (!subName) return alert("Enter a subcategory");

    try {
      const res = await axios.post(`${API_URL}/${catId}/sub`, { role, subName });
      setCategories(categories.map((c) => (c._id === catId ? res.data : c)));
      setNewSub((prev) => ({ ...prev, [catId]: "" }));
      alert(`Subcategory "${subName}" added!`);
    } catch (err) {
      alert(err.response?.data?.error || "Error adding subcategory");
    }
  };

  const deleteCategory = async (id) => {
    if (role !== "admin") return;
    try {
      await axios.delete(`${API_URL}/${id}`, { data: { role } });
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {role === "admin" && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="New category"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <button
            onClick={addCategory}
            className="bg-orange-500 text-white px-4 rounded hover:bg-orange-600 transition"
          >
            Add Category
          </button>
        </div>
      )}

      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat._id} className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{cat.name}</span>
              {role === "admin" && (
                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="text-red-500 font-bold hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>

            <ul className="ml-4 mt-2 space-y-1">
              {cat.subCategories?.map((sub, idx) => (
                <li key={idx}>• {sub.name}</li>
              ))}
            </ul>

           
          </li>
        ))}
      </ul>
    </div>
  );
}  
