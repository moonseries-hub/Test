import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const API_STAFF = "http://localhost:5000/api/staff/login";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "admin") {
        // ✅ Load stored admin credentials or fallback defaults
        const storedAdmin = JSON.parse(localStorage.getItem("adminProfile"));
        const adminUsername = storedAdmin?.username || "admin";
        const adminPassword = storedAdmin?.password || "a*d*m";

        if (username === adminUsername && password === adminPassword) {
          const adminUser = {
            username: adminUsername,
            role: "admin",
            token: "admin-token",
          };
          setUser(adminUser);
          localStorage.setItem("role", "admin");
          localStorage.setItem("user", JSON.stringify(adminUser));

          alert("Admin login successful!");
          navigate("/dashboard");
        } else {
          alert("Invalid admin credentials");
        }
        return;
      }

      // ✅ Staff login via backend
      const res = await axios.post(API_STAFF, { username, password });
      const { staff, token } = res.data;

      setUser({
        id: staff._id,
        username: staff.username,
        role: "staff",
        token,
      });
      localStorage.setItem("role", "staff");
      localStorage.setItem("user", JSON.stringify(staff));

      alert("Staff login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6 text-center">ASTRA</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
