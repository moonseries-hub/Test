import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function PurchaseOrder() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    category: "",
    make: "",
    model: "",
    expectedDate: "",
  });
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState([]);
  const [poList, setPoList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchPOs();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPOs = async () => {
    try {
      const res = await axios.get(`${API}/po`);
      setPoList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "category") {
      const selected = categories.find(c => c._id === value);
      if (selected) {
        setMakes(selected.makes || []);
        setModels(selected.models || []);
        setForm({ ...form, make: "", model: "", category: value });
      }
    }
  };

  const handleAddMakeOrModel = async (type) => {
    if (!form.category) return alert("Select category first!");
    const value = type === "make" ? newMake.trim() : newModel.trim();
    if (!value) return alert(`Enter new ${type}`);
    try {
      await axios.patch(`${API}/categories/${form.category}/add-${type}`, { [type]: value });
      if (type === "make") {
        setMakes(prev => [...prev, value]);
        setForm(prev => ({ ...prev, make: value }));
        setNewMake("");
      } else {
        setModels(prev => [...prev, value]);
        setForm(prev => ({ ...prev, model: value }));
        setNewModel("");
      }
      alert(`✅ ${type} added`);
    } catch (err) {
      alert(`❌ Failed to add ${type}`);
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/po/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API}/po`, form);
      }
      setForm({ productName: "", category: "", make: "", model: "", expectedDate: "" });
      fetchPOs();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save PO");
    }
  };

  const handleEdit = po => {
    setForm({ ...po });
    setEditingId(po._id);
    const cat = categories.find(c => c._id === po.category);
    if (cat) {
      setMakes(cat.makes || []);
      setModels(cat.models || []);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this PO?")) return;
    try {
      await axios.delete(`${API}/po/${id}`);
      fetchPOs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Purchase Orders</h1>

      {/* PO Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow mb-6 max-w-md mx-auto space-y-4">
        <div>
          <label>Product Name*</label>
          <input name="productName" value={form.productName} onChange={handleChange} required className="w-full border p-2 rounded"/>
        </div>

        <div>
          <label>Category*</label>
          <select name="category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label>Make*</label>
          <div className="flex gap-2">
            <select name="make" value={form.make} onChange={handleChange} className="flex-1 border p-2 rounded">
              <option value="">Select Make</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="text" placeholder="New Make" value={newMake} onChange={e => setNewMake(e.target.value)} className="border p-2 w-32 rounded"/>
            <button type="button" onClick={() => handleAddMakeOrModel("make")} className="bg-green-500 text-white px-3 rounded">+</button>
          </div>
        </div>

        <div>
          <label>Model (optional)</label>
          <div className="flex gap-2">
            <select name="model" value={form.model} onChange={handleChange} className="flex-1 border p-2 rounded">
              <option value="">Select Model</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="text" placeholder="New Model" value={newModel} onChange={e => setNewModel(e.target.value)} className="border p-2 w-32 rounded"/>
            <button type="button" onClick={() => handleAddMakeOrModel("model")} className="bg-green-500 text-white px-3 rounded">+</button>
          </div>
        </div>

        <div>
          <label>Expected Date</label>
          <input type="date" name="expectedDate" value={form.expectedDate} onChange={handleChange} className="w-full border p-2 rounded"/>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editingId ? "Update PO" : "Add PO"}</button>
      </form>

      {/* PO List */}
      <div className="bg-white p-5 rounded-2xl shadow max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Existing POs</h2>
        {poList.length === 0 ? <p>No Purchase Orders found.</p> :
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Make</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">Expected Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {poList.map(po => (
              <tr key={po._id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{po.productName}</td>
                <td className="border p-2">{categories.find(c => c._id===po.category)?.name || "-"}</td>
                <td className="border p-2">{po.make}</td>
                <td className="border p-2">{po.model || "-"}</td>
                <td className="border p-2">{po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : "-"}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(po)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
                  <button onClick={() => handleDelete(po._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
}
