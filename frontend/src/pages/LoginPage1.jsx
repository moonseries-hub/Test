// frontend/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";

const API_STAFF_LOGIN = "http://localhost:5000/api/staff/login";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔹 Identify role automatically
    const role = username === "admin" ? "admin" : "staff";

    // 🔸 Admin login (local)
    if (role === "admin") {
      if (password === "a*d*m") {
        const token = "admin-token";
        setUser({ username: "admin", role: "admin", token });
        navigate("/");
      } else {
        alert("Invalid admin credentials");
      }
      return;
    }

    // 🔹 Staff login through API
    try {
      const res = await axios.post(API_STAFF_LOGIN, { username, password });
      const { token, staff, emailMissing } = res.data;

      if (token && staff) {
        setUser({
          username: staff.username,
          role: "staff",
          token,
          lastLogin: staff.lastLogin,
          email: staff.email,
        });

        localStorage.setItem("staffToken", token);
        alert("Login successful");

        if (emailMissing) {
          alert("⚠️ Please update your email in your profile to complete setup.");
        }

        navigate("/");
      } else {
        alert("Invalid login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">ASTRA</h1>
          <p className="text-gray-600 font-semibold">
            <span className="text-orange-500">A</span>dvanced{" "}
            <span className="text-orange-500">S</span>tock{" "}
            <span className="text-orange-500">T</span>racking{" "}
            <span className="text-orange-500">R</span>eporting{" "}
            <span className="text-orange-500">A</span>pplication
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded hover:bg-orange-600 font-bold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">© 2025 ASTRA</p>
      </div>
    </div>
  );
}
