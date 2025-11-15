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

  // Load profile data on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (role === "admin") {
      const storedAdmin = JSON.parse(localStorage.getItem("adminProfile"));
      if (storedAdmin) {
        setUser({ username: storedAdmin.username, role: "admin" });
        setUsername(storedAdmin.username);
        setPassword(storedAdmin.password);
      } else {
        const defaultAdmin = { username: "admin", password: "admin123" };
        localStorage.setItem("adminProfile", JSON.stringify(defaultAdmin));
        setUser({ username: "admin", role: "admin" });
        setUsername("admin");
        setPassword("admin123");
      }
    } else if (stored) {
      const data = JSON.parse(stored);
      setUser(data);
      setUsername(data.username);

      // Fetch latest staff password from backend
      axios
        .get(`http://localhost:5000/api/staff/${data._id}`)
        .then((res) => setPassword(res.data.password || ""))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  const updateField = async (field) => {
    setMessage("");

    if (newPassword && newPassword === password) {
      setMessage("❌ New password cannot be the same as the old password!");
      return;
    }

    setLoading(true);

    try {
      const updatedData = {};
      if (field === "username") updatedData.username = usernameInput || user.username;
      if (field === "email") updatedData.email = emailInput || user.email;
      if (field === "password") updatedData.password = passwordInput || user.password;

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
      setMessage("⚠ Error updating profile!");
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

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
              : message.includes("⚠")
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