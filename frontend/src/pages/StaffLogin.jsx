import React, { useState } from "react";
import axios from "axios";

const API_LOGIN = "http://localhost:5000/api/staff/login";

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(API_LOGIN, { username, password });
      localStorage.setItem("staffToken", res.data.token);
      alert("Login successful");
      window.location.href = "/staff/dashboard"; // redirect to staff page
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Staff Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-3 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
      >
        Login
      </button>
    </div>
  );
}
