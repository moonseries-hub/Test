import React from "react";
import { useUser } from "../context/UserContext";

export default function DashboardStaff() {
  const { user } = useUser();
  return (
    <div>
      <h1>Welcome, {user.role === "staff" ? "Staff" : "Unknown"}</h1>
      <p>This is the staff dashboard.</p>
    </div>
  );
}
