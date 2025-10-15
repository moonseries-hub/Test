import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = [
      { username: "admin", password: "a*d*m", role: "admin" },
      { username: "staff", password: "s*s", role: "staff" },
    ];

    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      const token = "my-secret-token";
      setUser({ username: user.username, role: user.role, token });
      navigate("/");
    } else {
      alert("Invalid credentials");
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
            name="username"
            placeholder="Username"
            className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            name="role"
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
