

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API = "http://localhost:5000/api/staff";

export default function AddStaff() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // "exists" | "available"
  const [message, setMessage] = useState("");

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      const filteredStaff = res.data.filter((s) => s.role !== "admin"); // hide admin
      setStaffList(filteredStaff);
      // Hide admin
      const filtered = res.data.filter((staff) => staff.username !== "admin");
      setStaffList(filtered);
    } catch (err) {
      console.error("Error loading staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Check if username exists while typing
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null);
      return;
    }

    const check = setTimeout(() => {
      const exists = staffList.some(
        (staff) => staff.username.toLowerCase() === username.toLowerCase()
      );
      setUsernameStatus(exists ? "exists" : "available");
    }, 400);

    return () => clearTimeout(check);
  }, [username, staffList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameStatus === "exists") {
      setMessage("⚠ Username already exists! Please try a different one.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API}/add`, formData);
      }
      setFormData({ username: "", password: "" });
      setShowPassword(false);
      await axios.post(`${API}/add`, { username, password });
      setUsername("");
      setPassword("");
      setUsernameStatus(null);
      fetchStaff();
      setMessage("✅ Staff added successfully!");
      setTimeout(() => setMessage(""), 3000);
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
      console.error("Error adding staff:", err);
      setMessage("❌ Error adding staff. Try again!");
    }
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

  const handleEdit = (id) => {
    setEditingId(id);
    setNewPassword("");
    setShowPassword(false);
    setMessage("");
  };

  const handlePasswordUpdate = async (id) => {
    if (!newPassword.trim()) {
      alert("Please enter a new password");
      return;
    }

    try {
      await axios.patch(`${API}/${id}`, { password: newPassword });
      setMessage("✅ Password updated successfully!");
      setEditingId(null);
      setNewPassword("");
      fetchStaff();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Error updating password");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Staff Management</h2>
    <div className="p-6 bg-white rounded-xl shadow-xl max-w-4xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        Staff Management
      </h2>

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
      {/* Add Staff Form */}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col md:flex-row md:items-center gap-4 mb-6"
      >
        {/* Username Field */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            name="username"
            autoComplete="new-username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`border p-2 rounded w-full outline-none transition ${
              usernameStatus === "exists"
                ? "border-red-500 focus:ring-red-400"
                : usernameStatus === "available"
                ? "border-green-500 focus:ring-green-400"
                : "border-gray-300 focus:ring-blue-300"
            }`}
            required
          />
          {usernameStatus === "exists" && (
            <p className="text-sm text-red-600 mt-1">
              ⚠ Username already exists
            </p>
          )}
          {usernameStatus === "available" && (
            <p className="text-sm text-green-600 mt-1">✅ Available</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative w-full md:w-1/3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-300 outline-none"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Add Button */}
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
