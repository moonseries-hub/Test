import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Eye, EyeOff } from "lucide-react";

const API_STAFF = "http://localhost:5000/api/staff/login";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(API_STAFF, { username, password });
      const data = res.data;

      let userObj = null;
      if (data.role === "admin") userObj = { username: "admin", role: "admin", token: "admin-token" };
      else if (data.role === "staff" && data.staff)
        userObj = { _id: data.staff._id, username: data.staff.username, role: "staff", token: "staff-token" };

      if (!userObj) {
        alert("Login failed");
        return;
      }

      setUser(userObj);
      localStorage.setItem("role", userObj.role);
      localStorage.setItem("user", JSON.stringify(userObj));

      alert(`${userObj.role.toUpperCase()} login successful!`);

      if (userObj.role === "admin") navigate("/dashboard");
      else navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6 text-center">ASTRA</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="p-3 border rounded" required />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="p-3 border rounded w-full" required />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <button type="submit" disabled={loading} className="bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600">{loading ? "Logging in..." : "Login"}</button>
        </form>

        {/* Temporary credentials display */}
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-gray-700 mb-2">Temporary Credentials:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Staff: <span className="font-medium">staff1</span> / <span className="font-medium">staff@isro</span></li>
            <li>Admin: <span className="font-medium">admin</span> / <span className="font-medium">admin123</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}