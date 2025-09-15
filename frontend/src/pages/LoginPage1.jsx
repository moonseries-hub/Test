// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage1() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = [
      { username: "admin", password: "1277", role: "admin" },
      { username: "s", password: "1277staff", role: "staff" },
    ];

    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      localStorage.setItem("token", "my-secret-token");
      localStorage.setItem("role", user.role);
      setUser({ username: user.username, role: user.role });

      navigate("/");
  };
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">ASTRA</h1>
          <p className="text-gray-600 font-semibold">
            <span className="text-orange-500">A</span>dvanced&nbsp;
            <span className="text-orange-500">S</span>tock&nbsp;
            <span className="text-orange-500">T</span>racking&nbsp;
            <span className="text-orange-500">R</span>eporting&nbsp;
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
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
