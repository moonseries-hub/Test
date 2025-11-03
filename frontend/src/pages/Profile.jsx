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
