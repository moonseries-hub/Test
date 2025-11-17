

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API = "http://localhost:5000/api/staff";

export default function AddStaff() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      const filteredStaff = res.data.filter((s) => s.role !== "admin"); // hide admin
      setStaffList(filteredStaff);
    } catch (err) {
      console.error("Error loading staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API}/add`, formData);
      }
      setFormData({ username: "", password: "" });
      setShowPassword(false);
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving staff");
    }
  };

  const handleEdit = (staff) => {
    // Populate existing username and password
    setFormData({ username: staff.username, password: staff.password });
    setEditingId(staff._id);
    setShowPassword(false);
  };

  const handleCancelEdit = () => {
    setFormData({ username: "", password: "" });
    setEditingId(null);
    setShowPassword(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchStaff();
    } catch (err) {
      alert("Error deleting staff");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Staff Management</h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="border p-2 rounded w-1/3"
          required
        />
        <div className="relative w-1/3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            editingId ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Password</th>
            <th className="p-2 border">Last Login</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s) => (
            <tr key={s._id}>
              <td className="border p-2">{s.username}</td>
              <td className="border p-2">{s.password}</td>
              <td className="border p-2">
                {s.lastLogin ? new Date(s.lastLogin).toLocaleString() : "—"}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {staffList.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No staff found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
