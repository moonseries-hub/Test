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
