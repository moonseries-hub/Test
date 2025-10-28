
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setUser({ username: "admin", role: "admin" });
      setUsername("admin");
    } else if (stored) {
      const data = JSON.parse(stored);
      setUser(data);
      setUsername(data.username);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (user.role === "admin") {
        // ✅ Local mock update for admin
        const updatedAdmin = { username, password };
        localStorage.setItem("adminProfile", JSON.stringify(updatedAdmin));
        setMessage("Admin profile updated successfully!");
      } else {
        // ✅ Actual backend update for staff
        await axios.put(`http://localhost:5000/api/staff/${user._id}`, {
          username,
          password,
        });
        const updated = { ...user, username };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("Error updating profile!");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Profile</h2>

      <p className="text-gray-700 mb-2">
        <strong>Role:</strong> {user.role === "admin" ? "Admin" : "Staff"}
      </p>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-gray-600 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold text-green-600">{message}</p>
      )}
    </div>
  );
}
