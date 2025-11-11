import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API = "http://localhost:5000/api/staff";

export default function AddStaff() {
  const [staffList, setStaffList] = useState([]);
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
      setMessage("⚠️ Username already exists! Please try a different one.");
      return;
    }

    try {
      await axios.post(`${API}/add`, { username, password });
      setUsername("");
      setPassword("");
      setUsernameStatus(null);
      fetchStaff();
      setMessage("✅ Staff added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
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
    <div className="p-6 bg-white rounded-xl shadow-xl max-w-4xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        Staff Management
      </h2>

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
              ⚠️ Username already exists
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
          disabled={usernameStatus === "exists"}
          className={`px-5 py-2 rounded-lg transition text-white ${
            usernameStatus === "exists"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Add
        </button>
      </form>

      {/* Success Message */}
      {message && (
        <p className="mb-4 text-green-600 font-semibold text-center">
          {message}
        </p>
      )}

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Last Login</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-4 border"
                >
                  No staff added yet.
                </td>
              </tr>
            ) : (
              staffList.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="border p-2 font-medium">{s.username}</td>
                  <td className="border p-2">
                    {s.lastLogin
                      ? new Date(s.lastLogin).toLocaleString()
                      : "—"}
                  </td>
                  <td className="border p-2 space-x-2">
                    {editingId === s._id ? (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border p-2 rounded pr-10"
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 cursor-pointer text-gray-500"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePasswordUpdate(s._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(s._id)}
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
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// frontend/pages/AddStaff.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_STAFF = "http://localhost:5000/api/staff";

export default function AddStaff() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(API_STAFF);
      setStaffList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStaff = async () => {
    if (!username || !password) return alert("Enter both username and password");
    try {
      await axios.post(`${API_STAFF}/register`, { username, password });
      alert("Staff added successfully");
      setUsername("");
      setPassword("");
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding staff");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff?")) return;
    try {
      await axios.delete(`${API_STAFF}/${id}`);
      fetchStaff();
    } catch (err) {
      alert("Error deleting staff");
    }
  };

  const handleEdit = async (id) => {
    if (!editPassword) return alert("Enter new password");
    try {
      await axios.patch(`${API_STAFF}/${id}`, { password: editPassword });
      alert("Password updated successfully");
      setEditId(null);
      setEditPassword("");
      fetchStaff();
    } catch (err) {
      alert("Error updating password");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          👥 Manage Staff Accounts
        </h2>

        {/* ADD STAFF FORM */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 flex-1 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 flex-1 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleAddStaff}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Staff
          </button>
        </div>

        {/* STAFF TABLE */}
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="border p-2">#</th>
              <th className="border p-2">Username</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr key={staff._id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{staff.username}</td>
                <td className="border p-2 text-center space-x-2">
                  {editId === staff._id ? (
                    <>
                      <input
                        type="password"
                        placeholder="New password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="border p-1 rounded"
                      />
                      <button
                        onClick={() => handleEdit(staff._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditId(staff._id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-3 text-gray-500">
                  No staff added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
