import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Edit3, Save, X } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // existing password
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🧠 Load profile data on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (role === "admin") {
      // 🔹 Load saved admin profile if it exists
      const storedAdmin = JSON.parse(localStorage.getItem("adminProfile"));
      if (storedAdmin) {
        setUser({ username: storedAdmin.username, role: "admin" });
        setUsername(storedAdmin.username);
        setPassword(storedAdmin.password);
      } else {
        // First-time default admin setup
        const defaultAdmin = { username: "admin", password: "admin123" };
        localStorage.setItem("adminProfile", JSON.stringify(defaultAdmin));
        setUser({ username: "admin", role: "admin" });
        setUsername("admin");
        setPassword("admin123");
      }
    } else if (stored) {
      // 🔹 For staff users
      const data = JSON.parse(stored);
      setUser(data);
      setUsername(data.username);

      // Optional: fetch latest staff password from backend
      axios
        .get(`http://localhost:5000/api/staff/${data._id}`)
        .then((res) => setPassword(res.data.password || ""))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  // 🧩 Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword && newPassword === password) {
      setMessage("❌ New password cannot be the same as the old password!");
      return;
    }

    setLoading(true);

    try {
      if (user.role === "admin") {
        const updatedAdmin = { username, password: newPassword || password };
        localStorage.setItem("adminProfile", JSON.stringify(updatedAdmin));
        setPassword(newPassword || password);
        setNewPassword("");
        setMessage("✅ Admin profile updated successfully!");
      } else {
        await axios.put(`http://localhost:5000/api/staff/${user._id}`, {
          username,
          password: newPassword || password,
        });
        const updated = { ...user, username };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setPassword(newPassword || password);
        setNewPassword("");
        setMessage("✅ Profile updated successfully!");
      }
      setIsEditingPassword(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("⚠️ Error updating profile!");
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
    <div className="max-w-lg mx-auto mt-12 bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 transition-transform hover:scale-[1.01]">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Profile Settings
      </h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        {/* Role */}
        <div>
          <label className="block text-gray-600 mb-1">Role</label>
          <p className="font-semibold text-gray-800 capitalize">
            {user.role === "admin" ? "Administrator" : "Staff Member"}
          </p>
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-600 mb-1">Username</label>
          <input
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-600 mb-1">Password</label>

          {!isEditingPassword ? (
            <div className="flex items-center border rounded-lg p-3 bg-gray-50 justify-between">
              <input
                type={showPassword ? "text" : "password"}
                value={password || ""}
                readOnly
                className="bg-transparent outline-none w-full text-gray-700"
              />
              <div className="flex gap-3 ml-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPassword(true)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center border rounded-lg p-3 bg-gray-50 justify-between">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
              <div className="flex gap-3 ml-2">
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPassword(false);
                    setNewPassword("");
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow"
        >
          {loading ? "Saving..." : <Save size={18} />}
          {loading ? "" : "Save Changes"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-5 text-center font-semibold ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("⚠️")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailPrompt, setEmailPrompt] = useState(false);
  const userId = localStorage.getItem("userId"); // from login
  const token = localStorage.getItem("token");

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/staff/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      if (!res.data.email) setEmailPrompt(true);
    } catch (error) {
      console.error("Profile fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update email
  const updateEmail = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/staff/${userId}/email`,
        { email: emailInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prev) => ({ ...prev, email: res.data.email }));
      setEmailPrompt(false);
      alert("Email updated successfully!");
    } catch (error) {
      alert("Failed to update email");
      console.error(error);
    }
  };

  if (!profile) return <p className="text-center mt-8">Loading profile...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

      <div className="space-y-3">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email || "Not set"}</p>
        <p><strong>Last Login:</strong> {new Date(profile.lastLogin).toLocaleString()}</p>
      </div>

      {emailPrompt && (
        <div className="mt-6 border-t pt-4">
          <p className="text-red-600 mb-2">⚠️ Please enter your email</p>
          <input
            type="email"
            placeholder="Enter email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={updateEmail}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Email
          </button>
        </div>
      )}
    </div>
  );
}
