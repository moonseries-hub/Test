
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // Edit states
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loadingField, setLoadingField] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      const adminData = JSON.parse(localStorage.getItem("adminProfile")) || {};
      setUser({ username: "admin", role: "admin", ...adminData });
    } else {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setMessage("❌ No user found. Please log in.");
        return;
      }
      const parsed = JSON.parse(storedUser);
      if (!parsed._id) {
        setMessage("❌ User ID missing. Please log in again.");
        return;
      }
      setUser({ ...parsed, role: "staff" });
    }
  }, []);

  // Update user field
  const updateField = async (field) => {
    setMessage("");
    setLoadingField(field);

    try {
      const updatedData = {};
      if (field === "username") updatedData.username = usernameInput || user.username;
      if (field === "email") updatedData.email = emailInput || user.email;
      if (field === "password") updatedData.password = passwordInput || user.password;

      if (user.role === "admin") {
        // Admin updates stored locally
        const updatedAdmin = { ...user, ...updatedData };
        localStorage.setItem("adminProfile", JSON.stringify(updatedAdmin));
        setUser(updatedAdmin);
      } else {
        // Staff updates via API
        const token = localStorage.getItem("authToken") || "";
        await axios.put(
          `http://localhost:5000/api/staff/${user._id}`,
          updatedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedStaff = { ...user, ...updatedData };
        setUser(updatedStaff);
        localStorage.setItem("user", JSON.stringify(updatedStaff));
      }

      setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);

      // Reset input fields and edit state
      if (field === "username") { setEditUsername(false); setUsernameInput(""); }
      if (field === "email") { setEditEmail(false); setEmailInput(""); }
      if (field === "password") { setEditPassword(false); setPasswordInput(""); setShowNewPassword(false); }
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error updating ${field}`);
    } finally {
      setLoadingField("");
    }
  };

  const cancelEdit = (field) => {
    if (field === "username") { setEditUsername(false); setUsernameInput(""); }
    if (field === "email") { setEditEmail(false); setEmailInput(""); }
    if (field === "password") { setEditPassword(false); setPasswordInput(""); setShowNewPassword(false); }
  };

  if (!user)
    return <div className="flex items-center justify-center min-h-screen text-gray-700">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-xl rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Profile</h2>

      {/* Username */}
      <div className="space-y-1">
        <p className="text-gray-600">Username</p>
        {!editUsername ? (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{user.username}</span>
            <button onClick={() => setEditUsername(true)} className="text-blue-600 hover:underline">Edit</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="border p-2 rounded flex-1"
              placeholder="New username"
            />
            <button
              onClick={() => updateField("username")}
              disabled={loadingField === "username"}
              className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
            >
              {loadingField === "username" ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => cancelEdit("username")}
              className="bg-gray-200 px-3 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <p className="text-gray-600">Email</p>
        {!editEmail ? (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{user.email || "-"}</span>
            <button onClick={() => setEditEmail(true)} className="text-blue-600 hover:underline">Edit</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="border p-2 rounded flex-1"
              placeholder="New email"
            />
            <button
              onClick={() => updateField("email")}
              disabled={loadingField === "email"}
              className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
            >
              {loadingField === "email" ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => cancelEdit("email")}
              className="bg-gray-200 px-3 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <p className="text-gray-600 mb-1">Password</p>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            value={user.password || ""}
            readOnly
            className="p-2 w-full bg-gray-100 border rounded pr-16 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
          >
            {showOldPassword ? "Hide" : "Show"}
          </button>
        </div>

        {editPassword && (
          <div className="flex gap-2 mt-2">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="border p-2 rounded flex-1"
              placeholder="New password"
            />
            <button
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="px-3 bg-gray-200 rounded hover:bg-gray-300"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
            <button
              onClick={() => updateField("password")}
              disabled={loadingField === "password"}
              className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
            >
              {loadingField === "password" ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => cancelEdit("password")}
              className="bg-gray-200 px-3 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}

        {!editPassword && (
          <button
            onClick={() => setEditPassword(true)}
            className="mt-2 text-blue-600 hover:underline"
          >
            Edit Password
          </button>
        )}
      </div>

      {message && <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>}
    </div>
  );
}